export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { notify } from '../../../lib/notify';

const STATUSES = ['new', 'shortlisted', 'declined'];
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Owner sets an application's status (shortlist / decline / back to new),
// or confirms the sitter: { id, action: 'confirm' }.
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const { id, status, action } = await request.json();
    if (action === 'confirm') return confirm(session.userId, id);
    if (!id || !STATUSES.includes(status)) return json({ error: 'Invalid request' }, 400);

    const { data: owner } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();
    if (!owner) return json({ error: 'No profile' }, 400);

    // Only the owner of the listing may change its applications.
    const { data: app } = await supabase
      .from('applications')
      .select('id, profile_id, status, listing_id, listings!inner(profile_id, title)')
      .eq('id', id)
      .single();
    if (!app || (app as any).listings?.profile_id !== owner.id) return json({ error: 'Not found' }, 404);

    if ((app as any).status === 'confirmed') return json({ error: 'already_confirmed' }, 409);

    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) return json({ error: error.message }, 500);

    if (status === 'shortlisted' && (app as any).status !== 'shortlisted') {
      const title = (app as any).listings?.title || 'a sit';
      await notify((app as any).profile_id, {
        kind: 'urgent',
        title: 'You were shortlisted for ' + title,
        body: 'The owner liked your application. Keep an eye on your messages.',
        link: '/listings/' + (app as any).listing_id,
        cta: 'View the sit',
      });
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
};

// Confirm one applicant for the listing:
//   - creates the `sits` row (their sit pack at /sits/[id]) linked to the
//     owner/sitter conversation for this listing (opened if there isn't one),
//   - marks the application confirmed and the listing filled,
//   - tells the sitter, and politely declines everyone else still waiting.
async function confirm(userId: string, id: string) {
  if (!id) return json({ error: 'Invalid request' }, 400);

  const { data: owner } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('user_id', userId)
    .single();
  if (!owner) return json({ error: 'No profile' }, 400);

  const { data: app } = await supabase
    .from('applications')
    .select('id, profile_id, status, listing_id, listings!inner(id, profile_id, title)')
    .eq('id', id)
    .single();
  const listing = (app as any)?.listings;
  if (!app || listing?.profile_id !== owner.id) return json({ error: 'Not found' }, 404);
  if (app.status === 'declined') return json({ error: 'declined' }, 400);

  const { data: sitter } = await supabase
    .from('profiles')
    .select('id, user_id, name')
    .eq('id', app.profile_id)
    .single();
  if (!sitter) return json({ error: 'Sitter not found' }, 404);

  // One confirmed sitter per listing.
  const { data: existing } = await supabase
    .from('sits')
    .select('id, sitter_user_id')
    .eq('listing_id', listing.id)
    .maybeSingle();
  if (existing && existing.sitter_user_id !== sitter.user_id) {
    return json({ error: 'already_confirmed' }, 409);
  }

  let sitId = existing?.id as string | undefined;
  if (!sitId) {
    // Same conversation lookup as /api/messages/start.
    let conversationId: string | null = null;
    const { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .eq('sitter_profile_id', sitter.id)
      .eq('owner_profile_id', owner.id)
      .eq('listing_id', listing.id)
      .maybeSingle();
    if (conv) {
      conversationId = conv.id;
    } else {
      const { data: made } = await supabase
        .from('conversations')
        .insert({ sitter_profile_id: sitter.id, owner_profile_id: owner.id, listing_id: listing.id })
        .select('id')
        .single();
      conversationId = made?.id ?? null;
    }

    const { data: sit, error: sitError } = await supabase
      .from('sits')
      .insert({
        listing_id: listing.id,
        sitter_user_id: sitter.user_id,
        sitter_profile_id: sitter.id,
        conversation_id: conversationId,
      })
      .select('id')
      .single();
    if (sitError || !sit) return json({ error: sitError?.message || 'server' }, 500);
    sitId = sit.id;
  }

  const { error: appError } = await supabase.from('applications').update({ status: 'confirmed' }).eq('id', app.id);
  if (appError) return json({ error: appError.message }, 500);
  await supabase.from('listings').update({ status: 'filled' }).eq('id', listing.id);

  const title = listing.title || 'your sit';
  await notify(sitter.id, {
    kind: 'urgent',
    title: "You're confirmed for " + title,
    body: (owner.name || 'The owner') + ' picked you. Your sit pack has the dates, the pets and the handover details.',
    link: '/sits/' + sitId,
    cta: 'Open your sit pack',
  });

  // Everyone else still waiting is told politely.
  const { data: others } = await supabase
    .from('applications')
    .select('id, profile_id')
    .eq('listing_id', listing.id)
    .neq('id', app.id)
    .in('status', ['new', 'shortlisted']);
  if (others && others.length) {
    await supabase.from('applications').update({ status: 'declined' }).in('id', others.map((o) => o.id));
    for (const o of others) {
      await notify(o.profile_id, {
        kind: 'sit',
        title: title + ' has gone to another sitter',
        body: 'Thank you for applying. The owner picked someone else this time.',
        link: '/listings',
        cta: 'Browse sits',
      });
    }
  }

  return json({ ok: true, sit_id: sitId });
}
