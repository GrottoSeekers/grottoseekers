export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  // Protect endpoint — Vercel sends CRON_SECRET in Authorization header
  const authHeader = request.headers.get('authorization');
  const cronSecret = import.meta.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  // Find users whose account is 30 days old (±12 hours to avoid gaps)
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
        from: 'Grotto Sitters <hello@grottositters.com>',
        to: user.email,
        subject: 'Your free month is almost up — continue with Grotto Sitters',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Continue with Grotto Sitters</title>
</head>
<body style="margin:0;padding:0;background:#faf6ee;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ee;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(44,26,14,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#2c1a0e;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:1.5rem;font-weight:700;color:#ffffff;letter-spacing:0.02em;">
              Grotto <span style="color:#c8963e;">Sitters</span>
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:0.75rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#c8963e;">
              Your free month
            </p>
            <h1 style="margin:0 0 24px;font-size:1.8rem;color:#2c1a0e;line-height:1.25;font-weight:700;">
              Thanks for being part of<br />Grotto Sitters
            </h1>
            <p style="margin:0 0 20px;font-size:1rem;color:#5c3d20;line-height:1.7;">
              Your free month is coming to an end — we hope you've loved the platform so far.
            </p>
            <p style="margin:0 0 20px;font-size:1rem;color:#5c3d20;line-height:1.7;">
              To keep your profile live and continue connecting with sitters and owners,
              your subscription will be <strong style="color:#2c1a0e;">£4.99/month</strong> going forward.
            </p>
            <p style="margin:0 0 32px;font-size:1rem;color:#5c3d20;line-height:1.7;">
              We'll be in touch shortly with payment details. In the meantime, your profile
              stays live and nothing changes on your end.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#c8963e;border-radius:6px;padding:14px 36px;">
                  <a href="https://grottositters.com/dashboard" style="color:#ffffff;font-size:0.9rem;font-weight:700;text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;">
                    Go to my dashboard
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:0.9rem;color:#8b5e3c;line-height:1.7;">
              Any questions? Just reply to this email — we're always happy to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf6ee;padding:24px 40px;border-top:1px solid rgba(200,150,62,0.15);">
            <p style="margin:0;font-size:0.78rem;color:#8b5e3c;text-align:center;line-height:1.6;">
              © ${new Date().getFullYear()} Grotto Sitters &nbsp;·&nbsp;
              <a href="https://grottositters.com" style="color:#c8963e;text-decoration:none;">grottositters.com</a>
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
