export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// /verification actions for the signed-in user.
//   { action: 'start' }   none -> pending (submitted now; a reviewer sets verified_id later)
//   { action: 'remove' }  drops the badge and the check, so a new document can be submitted
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

    let patch: Record<string, unknown>;
    if (body.action === 'start') {
      patch = { id_check_status: 'pending', id_submitted_at: new Date().toISOString() };
    } else if (body.action === 'remove') {
      patch = { id_check_status: 'none', verified_id: false, id_verified_at: null, id_submitted_at: null };
    } else {
      return json({ error: 'Unknown action' }, 400);
    }

    const { error } = await supabase.from('profiles').update(patch).eq('id', profile.id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
};
