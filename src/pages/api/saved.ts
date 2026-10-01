export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Saved sits, saved-search alert switches and alert channels for the signed-in sitter.
//   { action: 'save' | 'unsave', listing_id }
//   { action: 'search', id, on }
//   { action: 'channels', channels: { email, push, weekly } }
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, saved_searches_json')
      .eq('user_id', session.userId)
      .single();
    if (!profile) return json({ error: 'No profile' }, 400);

    const body = await request.json();

    if (body.action === 'save' || body.action === 'unsave') {
      if (!body.listing_id) return json({ error: 'Missing listing' }, 400);
      const q = body.action === 'save'
        ? supabase.from('saved_sits').upsert(
            { profile_id: profile.id, listing_id: body.listing_id },
            { onConflict: 'profile_id,listing_id' },
          )
        : supabase.from('saved_sits').delete().eq('profile_id', profile.id).eq('listing_id', body.listing_id);
      const { error } = await q;
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (body.action === 'search') {
      const list: any[] = Array.isArray((profile as any).saved_searches_json) ? (profile as any).saved_searches_json : [];
      const next = list.map((s) => (s.id === body.id ? { ...s, on: !!body.on } : s));
      const { error } = await supabase.from('profiles').update({ saved_searches_json: next }).eq('id', profile.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (body.action === 'channels') {
      const c = body.channels || {};
      const prefs = { email: !!c.email, push: !!c.push, weekly: !!c.weekly };
      const { error } = await supabase.from('profiles').update({ alert_prefs_json: prefs }).eq('id', profile.id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
};
