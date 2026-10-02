export const prerender = false;

import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';
import { notify } from '../../../lib/notify';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// The owner shares the sit pack's private details (address, wifi, access,
// house notes, neighbour, direct contact) before the day before the sit.
//   { sit_id }
// Stored as checklist_json._released so no new column is needed.
export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);
    if (!session) return json({ error: 'Unauthorized' }, 401);
    const { sit_id } = await request.json();
    if (!sit_id) return json({ error: 'Missing sit' }, 400);

    const { data: sit } = await supabase.from('sits').select('*').eq('id', sit_id).single();
    if (!sit) return json({ error: 'Not found' }, 404);
    const { data: listing } = await supabase.from('listings').select('id, title, profile_id').eq('id', (sit as any).listing_id).single();
    const { data: owner } = listing
      ? await supabase.from('profiles').select('id, user_id, name').eq('id', (listing as any).profile_id).single()
      : { data: null };
    if (!owner || (owner as any).user_id !== session.userId) return json({ error: 'Only the owner can share these details' }, 403);

    const raw = (sit as any).checklist_json;
    const current = raw && typeof raw === 'object' ? raw : (() => { try { return JSON.parse(raw || '{}'); } catch { return {}; } })();
    const { error } = await supabase.from('sits').update({ checklist_json: { ...current, _released: true } }).eq('id', (sit as any).id);
    if (error) return json({ error: error.message }, 500);

    if ((sit as any).sitter_profile_id) {
      await notify((sit as any).sitter_profile_id, {
        kind: 'urgent',
        title: ((owner as any).name || 'The owner') + ' shared the house details',
        body: 'Address, wifi, access and contact details are now in your sit pack for ' + ((listing as any)?.title || 'your sit') + '.',
        link: '/sits/' + (sit as any).id,
        cta: 'Open your sit pack',
      });
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'server' }, 500);
  }
};
