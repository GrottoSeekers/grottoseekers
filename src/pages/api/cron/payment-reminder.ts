export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const cronSecret = import.meta.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const now = new Date();
  const windowStart = new Date(now.getTime() - 30.5 * 24 * 60 * 60 * 1000);
  const windowEnd   = new Date(now.getTime() - 29.5 * 24 * 60 * 60 * 1000);

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .gte('created_at', windowStart.toISOString())
    .lte('created_at', windowEnd.toISOString());

  if (error) {
    console.error('Supabase error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No users in window' }), { status: 200 });
  }

  const results: { email: string; success: boolean }[] = [];

  for (const user of users) {
    try {
      await resend.emails.send({
        from: 'MYAH <hello@myahsits.com>',
        to: user.email,
        subject: 'Your free month is almost up — continue with MYAH',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Continue with MYAH</title>
</head>
<body style="margin:0;padding:0;background:#faf6ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(44,26,14,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#2f5d45;padding:32px 40px;text-align:center;">
            <img src="https://myahsits.com/images/logo-mark-cream.png" width="64" height="64" alt="MYAH" style="display:block;margin:0 auto 12px;" />
            <p style="margin:0;font-size:1rem;font-weight:600;color:#e9e0d2;letter-spacing:0.28em;text-transform:uppercase;">
              MYAH
            </p>
            <p style="margin:4px 0 0;font-size:0.7rem;color:rgba(233,224,210,0.7);letter-spacing:0.22em;text-transform:uppercase;">
              Make yourself at home
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#6e5438;">
              Your free month
            </p>
            <h1 style="margin:0 0 24px;font-size:1.8rem;color:#2c1a0e;line-height:1.25;font-weight:700;">
              Thanks for being part of MYAH
            </h1>
            <p style="margin:0 0 20px;font-size:1rem;color:#6e5438;line-height:1.7;">
              Your free month is coming to an end — we hope you have loved the platform so far.
            </p>
            <p style="margin:0 0 20px;font-size:1rem;color:#6e5438;line-height:1.7;">
              To keep your profile live and continue connecting with sitters and owners,
              your subscription will be <strong style="color:#2c1a0e;">£4.99/month</strong> going forward.
            </p>
            <p style="margin:0 0 32px;font-size:1rem;color:#6e5438;line-height:1.7;">
              We will be in touch shortly with payment details. In the meantime, your profile
              stays live and nothing changes on your end.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#2f5d45;border-radius:999px;padding:14px 36px;">
                  <a href="https://myahsits.com/dashboard" style="color:#ffffff;font-size:0.9rem;font-weight:600;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;">
                    Go to my dashboard
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:0.9rem;color:#6e5438;line-height:1.7;">
              Any questions? Just reply to this email — we are always happy to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf6ee;padding:24px 40px;border-top:1px solid rgba(47,93,69,0.15);">
            <p style="margin:0;font-size:0.78rem;color:#6e5438;text-align:center;line-height:1.6;">
              © ${new Date().getFullYear()} MYAH &nbsp;·&nbsp;
              <a href="https://myahsits.com" style="color:#2f5d45;text-decoration:none;">myahsits.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
      results.push({ email: user.email, success: true });
    } catch (err) {
      console.error(`Failed to send to ${user.email}:`, err);
      results.push({ email: user.email, success: false });
    }
  }

  return new Response(JSON.stringify({ sent: results.filter(r => r.success).length, total: users.length, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
