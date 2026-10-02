export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { accountFor } from '../../../lib/account';

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    // Sitter or owner comes from the account (sign-up role).
    const acct = await accountFor(session.userId, session.email, session.role);
    const profile: any = acct.profile ? { ...acct.profile, profile_type: acct.side } : null;

    if (!profile) {
      return new Response(JSON.stringify({ error: 'No profile' }), { status: 400 });
    }

    // Every conversation this profile is part of, whichever side it was saved
    // under (older rows can have sitter/owner swapped). Names and listing
    // titles are fetched separately rather than through embedded joins, which
    // depend on foreign-key names an older database may not have.
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id, listing_id, sitter_profile_id, owner_profile_id, last_message_at, created_at')
      .or(`sitter_profile_id.eq.${profile.id},owner_profile_id.eq.${profile.id}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    const convs: any[] = conversations ?? [];
    const otherIds = [...new Set(convs.map((c) => (c.sitter_profile_id === profile.id ? c.owner_profile_id : c.sitter_profile_id)).filter(Boolean))];
    const listingIds = [...new Set(convs.map((c) => c.listing_id).filter(Boolean))];
    const people = new Map<string, any>();
    const sits = new Map<string, any>();
    if (otherIds.length) {
      const { data } = await supabase.from('profiles').select('id, name, profile_pic, slug').in('id', otherIds);
      (data ?? []).forEach((p: any) => people.set(p.id, p));
    }
    if (listingIds.length) {
      const { data } = await supabase.from('listings').select('id, title').in('id', listingIds);
      (data ?? []).forEach((l: any) => sits.set(l.id, l));
    }

    const result = [];
    for (const c of convs) {
      const otherId = c.sitter_profile_id === profile.id ? c.owner_profile_id : c.sitter_profile_id;
      const other = people.get(otherId) ?? (otherId ? { id: otherId, name: 'MYAH member', profile_pic: null, slug: null } : null);

      const { data: lastRows } = await supabase
        .from('messages')
        .select('body, sender_profile_id, created_at')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1);
      const lastMsg = lastRows?.[0] ?? null;

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', c.id)
        .neq('sender_profile_id', profile.id)
        .is('read_at', null);

      result.push({
        id: c.id,
        other,
        listing: c.listing_id ? sits.get(c.listing_id) ?? null : null,
        last_message: lastMsg,
        unread_count: count ?? 0,
        last_message_at: c.last_message_at || lastMsg?.created_at || c.created_at,
      });
    }
    result.sort((x, y) => String(y.last_message_at || '').localeCompare(String(x.last_message_at || '')));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
