export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'No profile' }), { status: 400 });
    }

    const convId = params.id;

    const { data: conv } = await supabase
      .from('conversations')
      .select('id, sitter_profile_id, owner_profile_id')
      .eq('id', convId)
      .single();

    if (!conv) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    if (conv.sitter_profile_id !== profile.id && conv.owner_profile_id !== profile.id) {
      return new Response(JSON.stringify({ error: 'Not a participant' }), { status: 403 });
    }

    const { data: messages } = await supabase
      .from('messages')
      .select('id, body, sender_profile_id, read_at, created_at')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', convId)
      .neq('sender_profile_id', profile.id)
      .is('read_at', null);

    return new Response(JSON.stringify(messages ?? []), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
