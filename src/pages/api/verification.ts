export const prerender = false;

import type { APIRoute } from 'astro';
import { getAccount } from '../../lib/account';
import { supabase } from '../../lib/supabase';
import { safeUpdate } from '../../lib/db';
import { notify } from '../../lib/notify';
import { FOUNDERS_SLUG } from '../../data/founders';
import { emailNewIdCheck } from '../../lib/email';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const BUCKET = 'id-documents';
const MAX = 6 * 1024 * 1024;

// /verification actions for the signed-in member (sitters and owners).
//   POST multipart { action: 'submit', document: File, selfie: File }
//        Uploads both photos to the PRIVATE id-documents storage, marks the
//        check 'pending' and tells the founders there is one to review.
//   POST JSON { action: 'remove' }
//        Drops the badge and any check, so a new one can be submitted.
export const POST: APIRoute = async ({ request }) => {
  try {
    const acct = await getAccount(request);
    if (!acct) return json({ error: 'Unauthorized' }, 401);
    const profile: any = acct.profile;
    if (!profile) return json({ error: 'no_profile' }, 400);

    const type = request.headers.get('content-type') || '';
    const removeFiles = async () => {
      const paths = [profile.id_doc_path, profile.id_selfie_path].filter(Boolean);
      if (paths.length) { try { await supabase.storage.from(BUCKET).remove(paths); } catch {} }
    };

    if (type.includes('application/json')) {
      const body = await request.json();
      if (body.action !== 'remove') return json({ error: 'Unknown action' }, 400);
      await removeFiles();
      const { error } = await safeUpdate('profiles', {
        id_check_status: 'none', verified_id: false, id_verified_at: null, id_submitted_at: null,
        id_doc_path: null, id_selfie_path: null, id_reject_reason: null,
      }, ['id', profile.id]);
      if (error) return json({ error: 'server', detail: error.message }, 500);
      return json({ ok: true });
    }

    const form = await request.formData();
    if (form.get('action') !== 'submit') return json({ error: 'Unknown action' }, 400);
    const doc = form.get('document');
    const selfie = form.get('selfie');
    if (!(doc instanceof File) || !doc.size || !(selfie instanceof File) || !selfie.size) {
      return json({ error: 'missing', detail: 'Add a photo of your ID and a selfie.' }, 400);
    }
    if (doc.size > MAX || selfie.size > MAX) return json({ error: 'too_large', detail: 'Each photo must be under 6 MB.' }, 400);

    const stamp = Date.now();
    const put = async (file: File, kind: string) => {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${acct.userId}/${kind}-${stamp}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET)
        .upload(path, new Uint8Array(await file.arrayBuffer()), { contentType: file.type || 'image/jpeg', upsert: true });
      if (error) throw new Error('upload: ' + error.message);
      return path;
    };
    let docPath: string, selfiePath: string;
    try {
      docPath = await put(doc, 'document');
      selfiePath = await put(selfie, 'selfie');
    } catch (e) {
      return json({ error: 'setup_needed', detail: e instanceof Error ? e.message : 'upload failed' }, 500);
    }

    await removeFiles(); // an earlier submission's photos
    const { error, dropped } = await safeUpdate('profiles', {
      id_check_status: 'pending', verified_id: false, id_submitted_at: new Date().toISOString(),
      id_verified_at: null, id_doc_path: docPath, id_selfie_path: selfiePath, id_reject_reason: null,
    }, ['id', profile.id]);
    if (error) return json({ error: 'server', detail: error.message }, 500);
    if (dropped.includes('id_doc_path') || dropped.includes('id_check_status')) {
      try { await supabase.storage.from(BUCKET).remove([docPath, selfiePath]); } catch {}
      return json({ error: 'setup_needed', detail: 'The ID check columns are missing — run supabase/id-verification.sql.' }, 500);
    }

    // Email the founders straight away so they can review it.
    await emailNewIdCheck(profile, acct.side);

    // And drop it in their MYAH notifications.
    try {
      const { data: f } = await supabase.from('profiles').select('id').eq('slug', FOUNDERS_SLUG).limit(1);
      const fid = (f as any)?.[0]?.id;
      if (fid && fid !== profile.id) {
        await notify(fid, {
          kind: 'urgent',
          title: (profile.name || 'A member') + ' sent their ID for review',
          body: (acct.side === 'owner' ? 'Home owner' : 'Sitter') + ' · check the photo ID against the selfie.',
          link: '/admin',
          cta: 'Review ID checks',
        });
      }
    } catch {}

    return json({ ok: true, status: 'pending' });
  } catch (e) {
    return json({ error: 'server', detail: e instanceof Error ? e.message : '' }, 500);
  }
};
