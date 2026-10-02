export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { notify } from '../../lib/notify';
import { accountFor, sideOfProfile } from '../../lib/account';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Owner invites a sitter to one of their listings (/find-a-sitter).
//   { action: 'invite' | 'undo', listing_id, sitter_profile_id }
// An invite records the row, opens (or reuses) the owner/sitter conversation for
// that listing and drops a notification in the sitter's feed. Undo removes the
// row and the notification, and the conversation too if the invite opened it
// and nothing has been said in it yet.
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const acct = await accountFor(session.userId, session.email, session.role);
    const owner: any = acct.profile;
    if (!owner || acct.side !== 'owner') return json({ error: 'Owners only' }, 403);

    const { action, listing_id, sitter_profile_id } = await request.json();
    if (!listing_id || !sitter_profile_id || !['invite', 'undo'].includes(action)) {
      return json({ error: 'Invalid request' }, 400);
    }

    const { data: listing } = await supabase
      .from('listings')
      .select('id, title')
      .eq('id', listing_id)
      .eq('profile_id', owner.id)
      .single();
    if (!listing) return json({ error: 'Listing not found' }, 404);

    const link = '/listings/' + listing.id;

    if (action === 'undo') {
      const { data: inv } = await supabase
        .from('invites')
        .select('id, conversation_id, opened_conversation')
        .eq('listing_id', listing.id)
        .eq('sitter_profile_id', sitter_profile_id)
        .maybeSingle();
      if (!inv) return json({ ok: true });

      await supabase.from('invites').delete().eq('id', inv.id);
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('profile_id', sitter_profile_id)
          .eq('kind', 'sit')
          .eq('link', link)
          .eq('read', false);
      } catch {}
      if (inv.opened_conversation && inv.conversation_id) {
        try {
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', inv.conversation_id);
          if (!count) await supabase.from('conversations').delete().eq('id', inv.conversation_id);
        } catch {}
      }
      return json({ ok: true });
    }

    const { data: sitter } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sitter_profile_id)
      .single();
    if (!sitter || (await sideOfProfile(sitter)) !== 'sitter') return json({ error: 'Sitter not found' }, 404);

    const { data: existingInvite } = await supabase
      .from('invites')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('sitter_profile_id', sitter.id)
      .maybeSingle();
    if (existingInvite) return json({ ok: true });

    // Same conversation lookup as /api/messages/start.
    let conversationId: string | null = null;
    let opened = false;
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
      if (made) { conversationId = made.id; opened = true; }
    }

    const { error } = await supabase.from('invites').insert({
      listing_id: listing.id,
      owner_profile_id: owner.id,
      sitter_profile_id: sitter.id,
      conversation_id: conversationId,
      opened_conversation: opened,
    });
    if (error) return json({ error: error.message }, 500);

    await notify(sitter.id, {
      kind: 'sit',
      title: (owner.name || 'An owner') + ' invited you to ' + listing.title,
      body: 'They found your profile and would like you to apply.',
      link,
      cta: 'View the sit',
    });

    return json({ ok: true, conversation_id: conversationId });
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
};
