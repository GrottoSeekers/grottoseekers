export const prerender = false;

import type { APIRoute } from 'astro';
import { getAccount } from '../../../lib/account';
import { supabase } from '../../../lib/supabase';
import { safeUpdate } from '../../../lib/db';
import { notify } from '../../../lib/notify';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Founders approve or reject an ID check from /admin/verifications.
//   { profile_id, decision: 'approve' | 'reject', reason? }
// Either way the uploaded photos are deleted straight after the decision.
export const POST: APIRoute = async ({ request }) => {
  try {
    const acct = await getAccount(request);
    if (!acct?.isAdmin) return json({ error: 'Admins only' }, 403);

    const { profile_id, decision, reason } = await request.json();
    if (!profile_id || !['approve', 'reject'].includes(decision)) return json({ error: 'Invalid request' }, 400);

    const { data } = await supabase.from('profiles').select('*').eq('id', profile_id).limit(1);
    const member: any = (data as any)?.[0];
    if (!member) return json({ error: 'Not found' }, 404);

    const paths = [member.id_doc_path, member.id_selfie_path].filter(Boolean);
    const why = String(reason || '').trim().slice(0, 300);
    const patch = decision === 'approve'
      ? { verified_id: true, id_check_status: 'verified', id_verified_at: new Date().toISOString(), id_reject_reason: null, id_doc_path: null, id_selfie_path: null }
      : { verified_id: false, id_check_status: 'rejected', id_verified_at: null, id_reject_reason: why || 'The photos could not be matched.', id_doc_path: null, id_selfie_path: null };
    const { error } = await safeUpdate('profiles', patch, ['id', member.id]);
    if (error) return json({ error: error.message }, 500);
    if (paths.length) { try { await supabase.storage.from('id-documents').remove(paths); } catch {} }

    await notify(member.id, decision === 'approve'
      ? { kind: 'urgent', title: 'Your ID is verified', body: 'Everything on MYAH is now open to you, and the verified badge shows on your profile.', link: '/verification', cta: 'See your badge' }
      : { kind: 'urgent', title: 'We could not verify your ID', body: (why || 'The photos could not be matched.') + ' Please send new photos.', link: '/verification', cta: 'Try again' });

    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'server' }, 500);
  }
};
