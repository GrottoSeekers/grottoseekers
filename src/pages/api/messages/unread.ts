export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ count: 0, messages: [] }), { status: 200 });
    }

    const { data: convs } = await supabase
      .from('conversations')
      .select('id')
      .or(`sitter_profile_id.eq.${profile.id},owner_profile_id.eq.${profile.id}`);

    const convIds = (convs ?? []).map(c => c.id);

    if (convIds.length === 0) {
      return new Response(JSON.stringify({ count: 0, messages: [] }), { status: 200 });
    }

    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', convIds)
      .neq('sender_profile_id', profile.id)
      .is('read_at', null);

    const { data: messages } = await supabase
      .from('messages')
      .select('id, body, created_at, conversation_id, sender:profiles!messages_sender_profile_id_fkey(name, profile_pic)')
      .in('conversation_id', convIds)
      .neq('sender_profile_id', profile.id)
      .is('read_at', null)
      .order('created_at', { ascending: false })
      .limit(5);

    return new Response(JSON.stringify({ count: count ?? 0, messages: messages ?? [] }), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
