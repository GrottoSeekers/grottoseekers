// Emails to the MYAH founders (via Resend, the same service as enquiries).
import { Resend } from 'resend';
import { supabase } from './supabase';
import { FOUNDERS_SLUG } from '../data/founders';

const SITE = 'https://www.myahsits.com';
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

/** Who gets admin alerts: ADMIN_NOTIFY_EMAIL (comma-separated), else the founders' login email. */
async function adminRecipients(): Promise<string[]> {
  const env = String(import.meta.env.ADMIN_NOTIFY_EMAIL || '').split(',').map((e) => e.trim()).filter(Boolean);
  if (env.length) return env;
  try {
    const { data: f } = await supabase.from('profiles').select('user_id').eq('slug', FOUNDERS_SLUG).limit(1);
    const uid = (f as any)?.[0]?.user_id;
    if (!uid) return [];
    const { data: u } = await supabase.from('users').select('email').eq('id', uid).limit(1);
    const email = (u as any)?.[0]?.email;
    return email ? [email] : [];
  } catch {
    return [];
  }
}

/** "New ID check to review" — sent the moment a member submits their ID. */
export async function emailNewIdCheck(member: { name?: string; location?: string; slug?: string }, side: 'sitter' | 'owner') {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: 'no RESEND_API_KEY' };
  const to = await adminRecipients();
  if (!to.length) return { sent: false, reason: 'no recipient' };
  const who = esc(member.name || 'A new member');
  const role = side === 'owner' ? 'Home owner' : 'Sitter';
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  try {
    await new Resend(key).emails.send({
      from: 'MYAH <hello@myahsits.com>',
      to,
      subject: `New ID check: ${member.name || 'a new member'} (${role})`,
      html: `
<div style="font-family:Montserrat,Arial,sans-serif;max-width:520px;margin:0 auto;background:#faf6ee;padding:28px 24px;color:#2c1a0e">
  <p style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#6e5438;margin:0 0 12px">MYAH · ID checks</p>
  <h1 style="font-family:Georgia,serif;font-weight:400;font-size:26px;margin:0 0 14px">${who} sent their ID</h1>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e3d8c8;border-radius:12px;margin:0 0 22px">
    <tr><td style="padding:12px 16px;color:#6b4e35;font-size:14px">Member</td><td style="padding:12px 16px;font-size:14px;text-align:right">${who}</td></tr>
    <tr><td style="padding:12px 16px;color:#6b4e35;font-size:14px;border-top:1px solid #efe7da">Joined as</td><td style="padding:12px 16px;font-size:14px;text-align:right;border-top:1px solid #efe7da">${role}</td></tr>
    ${member.location ? `<tr><td style="padding:12px 16px;color:#6b4e35;font-size:14px;border-top:1px solid #efe7da">Location</td><td style="padding:12px 16px;font-size:14px;text-align:right;border-top:1px solid #efe7da">${esc(member.location)}</td></tr>` : ''}
    <tr><td style="padding:12px 16px;color:#6b4e35;font-size:14px;border-top:1px solid #efe7da">Sent</td><td style="padding:12px 16px;font-size:14px;text-align:right;border-top:1px solid #efe7da">${esc(when)}</td></tr>
  </table>
  <a href="${SITE}/admin" style="display:inline-block;background:#2f5d45;color:#fff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:14px 28px;border-radius:50px">Review now</a>
  <p style="font-size:13px;color:#6b4e35;line-height:1.6;margin:22px 0 0">They can't apply, post, message or confirm until you approve them. The ID photos are only viewable on the admin page and are deleted once you decide.</p>
</div>`,
    });
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : 'send failed' };
  }
}
