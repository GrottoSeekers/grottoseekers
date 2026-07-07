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
      .select('name, contact_email, whatsapp_number')
      .eq('slug', slug)
      .single();

    if (!profile?.contact_email) {
      return new Response(JSON.stringify({ error: 'This sitter has not set up email yet' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const dates = dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : 'Not specified';

    await resend.emails.send({
      from: 'Grotto Sitters <enquiries@grottositters.com>',
      to: profile.contact_email,
      replyTo: email,
      subject: `New enquiry from ${fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
          <h2 style="color:#2c1a0e;">New Enquiry</h2>
          <p>You've received a new enquiry through your Grotto Sitters page.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Name</td><td style="padding:8px 0;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;">Dates</td><td style="padding:8px 0;">${dates}</td></tr>
            ${message ? `<tr><td style="padding:8px 0;color:#6b4e35;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 0;">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
          </table>
          <p style="color:#6b4e35;font-size:0.85em;">Reply directly to this email to respond to ${firstName}.</p>
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
