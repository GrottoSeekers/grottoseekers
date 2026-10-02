export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/notify';
import { accountFor } from '../../lib/account';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// A sitter applies for a listing from its sit page.
//   { listing_id, message }
// Works out the date fit from the sitter's Availability (days marked free),
// tags the application with the pets they're happy with, and tells the owner.
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const { listing_id, message } = await request.json();
    if (!listing_id) return json({ error: 'Missing listing' }, 400);

    // Side from the account (sign-up), not the profile's own type field,
    // which older databases may not have.
    const acct = await accountFor(session.userId, session.email, session.role);
    const sitter: any = acct.profile;
    if (!sitter) return json({ error: 'no_profile' }, 400);
    if (acct.side !== 'sitter') return json({ error: 'sitters_only' }, 403);
    // Everyone is ID checked before they can apply.
    if (!acct.verified) return json({ error: 'id_required', detail: 'Verify your ID first — go to Verification.' }, 403);

    const { data: listing } = await supabase
      .from('listings')
      .select('id, title, status, date_from, date_to, profile_id')
      .eq('id', listing_id)
      .single();
    if (!listing || listing.status !== 'active') return json({ error: 'closed' }, 400);
    if (listing.profile_id === sitter.id) return json({ error: 'own_listing' }, 400);

    const { data: existing } = await supabase
      .from('applications')
      .select('id, status')
      .eq('listing_id', listing.id)
      .eq('profile_id', sitter.id)
      .maybeSingle();
    if (existing) return json({ ok: true, status: existing.status, already: true });

    // Date fit from the sitter's free days.
    const days: string[] = [];
    const d = new Date(listing.date_from + 'T00:00:00Z');
    const end = new Date(listing.date_to + 'T00:00:00Z');
    for (let i = 0; d <= end && i < 400; i++) {
      days.push(d.toISOString().slice(0, 10));
      d.setUTCDate(d.getUTCDate() + 1);
    }
    const map = sitter.availability_json && typeof sitter.availability_json === 'object' && !Array.isArray(sitter.availability_json)
      ? sitter.availability_json as Record<string, string>
      : {};
    const free = days.filter((k) => map[k] === 'free').length;
    const total = Math.max(1, days.length - 1);
    const date_fit = !free
      ? null
      : free >= days.length
        ? 'Free for all ' + total + ' days'
        : 'Free for ' + Math.min(free, total) + ' of ' + total + ' days';

    const prefs: any = sitter.availability_prefs_json || {};
    const tags = (Array.isArray(prefs.pets) ? prefs.pets : []).slice(0, 3);

    const note = typeof message === 'string' ? message.trim().slice(0, 2000) : '';
    const { error } = await supabase.from('applications').insert({
      listing_id: listing.id,
      profile_id: sitter.id,
      message: note || null,
      date_fit,
      tags_json: tags,
      status: 'new',
    });
    if (error) return json({ error: 'server', detail: error.message }, 500);

    await notify(listing.profile_id, {
      kind: 'urgent',
      title: (sitter.name || 'A sitter') + ' applied for ' + (listing.title || 'your sit'),
      body: note ? '“' + note.slice(0, 140) + (note.length > 140 ? '…' : '') + '”' : undefined,
      link: '/applications?listing=' + listing.id,
      cta: 'See applications',
    });

    return json({ ok: true, status: 'new' });
  } catch (e) {
    return json({ error: 'server', detail: e instanceof Error ? e.message : '' }, 500);
  }
};
