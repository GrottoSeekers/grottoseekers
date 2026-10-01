export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const PREF_KEYS = ['applications', 'messages', 'sit', 'matches', 'product'];

// /notifications actions for the signed-in user.
//   { action: 'read', id, read }   { action: 'read-all' }   { action: 'prefs', prefs }
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();
    if (!profile) return json({ error: 'No profile' }, 400);

    const body = await request.json();

    if (body.action === 'read') {
      const { error } = await supabase
        .from('notifications')
        .update({ read: !!body.read })
        .eq('id', body.id)
        .eq('profile_id', profile.id);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }

    if (body.action === 'read-all') {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('profile_id', profile.id)
        .eq('read', false);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }

    if (body.action === 'prefs') {
      const p = body.prefs || {};
      const prefs = Object.fromEntries(PREF_KEYS.map((k) => [k, !!p[k]]));
      const { error } = await supabase.from('profiles').update({ notify_prefs_json: prefs }).eq('id', profile.id);
      return error ? json({ error: error.message }, 500) : json({ ok: true });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
};
