export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../lib/supabase';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const slug = (form.get('slug') as string)?.trim();
    const firstName = (form.get('first_name') as string)?.trim();
    const lastName = (form.get('last_name') as string)?.trim();
    const email = (form.get('email') as string)?.trim();
    const dateFrom = (form.get('date_from') as string)?.trim();
    const dateTo = (form.get('date_to') as string)?.trim();
    const message = (form.get('message') as string)?.trim();

    if (!slug || !firstName || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, contact_email, whatsapp_number, user_id')
      .eq('slug', slug)
      .single();

    // No enquiry email set? Send it to the email they log in with.
    let to = profile?.contact_email as string | undefined;
    if (!to && profile?.user_id) {
      const { data: u } = await supabase.from('users').select('email').eq('id', profile.user_id).limit(1);
      to = (u as any)?.[0]?.email;
    }
    if (!to) {
      return new Response(JSON.stringify({ error: "They haven't set up email enquiries yet — message them on MYAH instead." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
    const fullName = esc(`${firstName} ${lastName ?? ''}`.trim());
    const dates = dateFrom && dateTo ? esc(`${dateFrom} to ${dateTo}`) : 'Not specified';

    await resend.emails.send({
      from: 'MYAH <enquiries@myahsits.com>',
      to,
      replyTo: email,
      subject: `New enquiry from ${fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
          <h2 style="color:#2c1a0e;">New Enquiry</h2>
          <p>You've received a new enquiry through your MYAH page.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Name</td><td style="padding:8px 0;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Dates</td><td style="padding:8px 0;">${dates}</td></tr>
            ${message ? `<tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 0;">${esc(message).replace(/\n/g, '<br>')}</td></tr>` : ''}
          </table>
          <p style="color:#6b4e35;font-size:0.85em;">Reply directly to this email to respond to ${esc(firstName)}.</p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to send enquiry' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
