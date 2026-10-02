export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const CHECK_COUNT = 6;

// Saves the "Before the handover" checklist on /sits/[id].
//   { sit_id, done: { "0": true, "3": true } }
// Only the sitter or the listing's owner can change it.
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    const body = await request.json();
    if (!body?.sit_id) return json({ error: 'Missing sit' }, 400);

    const { data: sit } = await supabase
      .from('sits')
      .select('id, sitter_user_id, checklist_json, listings!inner(profiles!inner(user_id))')
      .eq('id', body.sit_id)
      .single();
    if (!sit) return json({ error: 'Not found' }, 404);

    const ownerUserId = (sit as any).listings?.profiles?.user_id;
    if (sit.sitter_user_id !== session.userId && ownerUserId !== session.userId) {
      return json({ error: 'Forbidden' }, 403);
    }

    const done: Record<string, boolean> = {};
    const raw = body.done && typeof body.done === 'object' ? body.done : {};
    for (let i = 0; i < CHECK_COUNT; i++) if (raw[i]) done[i] = true;

    // Keep the owner's "shared early" flag (see /api/sits/release).
    const prev: any = (sit as any).checklist_json;
    const released = !!(prev && typeof prev === 'object' ? prev._released : String(prev || '').includes('"_released":true'));
    const next: Record<string, boolean> = released ? { ...done, _released: true } : done;
    const { error } = await supabase.from('sits').update({ checklist_json: next }).eq('id', sit.id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
};
