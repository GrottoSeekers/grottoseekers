export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { conversation_id, listing_id, recipient_profile_id, body } = await request.json();

    if (!body?.trim()) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), { status: 400 });
    }

    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('id, profile_type')
      .eq('user_id', session.userId)
      .single();

    if (!senderProfile) {
      return new Response(JSON.stringify({ error: 'No profile found' }), { status: 400 });
    }

    let convId = conversation_id;

    if (!convId) {
      if (!recipient_profile_id) {
        return new Response(JSON.stringify({ error: 'Missing recipient' }), { status: 400 });
      }

      const isSitter = senderProfile.profile_type === 'sitter';
      const sitterProfileId = isSitter ? senderProfile.id : recipient_profile_id;
      const ownerProfileId = isSitter ? recipient_profile_id : senderProfile.id;

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('sitter_profile_id', sitterProfileId)
        .eq('owner_profile_id', ownerProfileId)
        .eq('listing_id', listing_id ?? null as any)
        .maybeSingle();

      if (existing) {
        convId = existing.id;
      } else {
        const insert: Record<string, any> = {
          sitter_profile_id: sitterProfileId,
          owner_profile_id: ownerProfileId,
        };
        if (listing_id) insert.listing_id = listing_id;

        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert(insert)
          .select('id')
          .single();

        if (convError || !newConv) {
          return new Response(JSON.stringify({ error: convError?.message ?? 'Failed to create conversation' }), { status: 500 });
        }
        convId = newConv.id;
      }
    }

    const { data: conv } = await supabase
      .from('conversations')
      .select('id, sitter_profile_id, owner_profile_id')
      .eq('id', convId)
      .single();

    if (!conv) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), { status: 404 });
    }

    if (conv.sitter_profile_id !== senderProfile.id && conv.owner_profile_id !== senderProfile.id) {
      return new Response(JSON.stringify({ error: 'Not a participant' }), { status: 403 });
    }

    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_profile_id: senderProfile.id,
        body: body.trim(),
      })
      .select('id, body, sender_profile_id, created_at')
      .single();

    if (msgError) {
      return new Response(JSON.stringify({ error: msgError.message }), { status: 500 });
    }

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', convId);

    return new Response(JSON.stringify({ conversation_id: convId, message }), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
