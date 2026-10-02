export const prerender = false;

import type { APIRoute } from 'astro';
import { getAccount } from '../../../lib/account';
import { supabase } from '../../../lib/supabase';
import { emailLaunch } from '../../../lib/email';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Founders only. GET: the launch list as a CSV file.
export const GET: APIRoute = async ({ request }) => {
  const acct = await getAccount(request);
  if (!acct?.isAdmin) return json({ error: 'Forbidden' }, 403);
  const { data, error } = await supabase.from('launch_interest')
    .select('email, role, source, created_at, notified_at').order('created_at', { ascending: true });
  if (error) return json({ error: error.message }, 500);
  const cell = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv = ['email,role,source,registered,emailed_at_launch']
    .concat((data ?? []).map((r: any) => [r.email, r.role, r.source, r.created_at, r.notified_at].map(cell).join(',')))
    .join('\n') + '\n';
  return new Response(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="myah-launch-list.csv"' },
  });
};

// POST { action: 'notify' }: email "MYAH is live" to everyone not yet emailed.
export const POST: APIRoute = async ({ request }) => {
  const acct = await getAccount(request);
  if (!acct?.isAdmin) return json({ error: 'Forbidden' }, 403);
  const body = await request.json().catch(() => ({}));
  if (body.action !== 'notify') return json({ error: 'Unknown action' }, 400);

  const { data, error } = await supabase.from('launch_interest').select('email').is('notified_at', null);
  if (error) return json({ error: error.message }, 500);
  const list = (data ?? []).map((r: any) => r.email).filter(Boolean);
  if (!list.length) return json({ sent: 0 });

  const res = await emailLaunch(list);
  if (res.sent.length) {
    await supabase.from('launch_interest').update({ notified_at: new Date().toISOString() }).in('email', res.sent);
  }
  return json({ sent: res.sent.length, error: res.error }, res.error && !res.sent.length ? 500 : 200);
};
