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
      .select('id, profile_type')
      .eq('user_id', session.userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'No profile' }), { status: 400 });
    }

    const col = profile.profile_type === 'sitter' ? 'sitter_profile_id' : 'owner_profile_id';
    const otherCol = profile.profile_type === 'sitter' ? 'owner_profile_id' : 'sitter_profile_id';

    const { data: conversations } = await supabase
      .from('conversations')
      .select(`
        id, listing_id, last_message_at, created_at,
        sitter:profiles!conversations_sitter_profile_id_fkey(id, name, profile_pic, slug),
        owner:profiles!conversations_owner_profile_id_fkey(id, name, profile_pic, slug),
        listings(title)
      `)
      .eq(col, profile.id)
      .order('last_message_at', { ascending: false });

    const convs = conversations ?? [];

    const result = [];
    for (const c of convs) {
      const other = profile.profile_type === 'sitter' ? c.owner : c.sitter;

      const { data: lastMsg } = await supabase
        .from('messages')
        .select('body, sender_profile_id, created_at')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', c.id)
        .neq('sender_profile_id', profile.id)
        .is('read_at', null);

      result.push({
        id: c.id,
        other,
        listing: c.listings,
        last_message: lastMsg,
        unread_count: count ?? 0,
        last_message_at: c.last_message_at,
      });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
