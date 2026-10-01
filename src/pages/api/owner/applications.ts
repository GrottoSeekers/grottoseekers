export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

const STATUSES = ['new', 'shortlisted', 'declined'];
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Owner sets an application's status (shortlist / decline / back to new).
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const { id, status } = await request.json();
    if (!id || !STATUSES.includes(status)) return json({ error: 'Invalid request' }, 400);

    const { data: owner } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', session.userId)
      .single();
    if (!owner) return json({ error: 'No profile' }, 400);

    // Only the owner of the listing may change its applications.
    const { data: app } = await supabase
      .from('applications')
      .select('id, listings!inner(profile_id)')
      .eq('id', id)
      .single();
    if (!app || (app as any).listings?.profile_id !== owner.id) return json({ error: 'Not found' }, 404);

    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) return json({ error: error.message }, 500);

    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
};
