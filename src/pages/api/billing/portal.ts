export const prerender = false;

import type { APIRoute } from 'astro';
import { getAccount } from '../../../lib/account';
import { PAYMENTS_ENABLED, getBilling, stripe } from '../../../lib/billing';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// → { url } of the Stripe Customer Portal, where members switch between
// monthly and yearly, update their card, download invoices or cancel. What it
// offers is set in Stripe → Settings → Billing → Customer portal.
export const POST: APIRoute = async ({ request }) => {
  try {
    if (!PAYMENTS_ENABLED) return json({ error: 'payments_off' }, 403);
    const acct = await getAccount(request);
    if (!acct) return json({ error: 'Unauthorized' }, 401);

    const billing = await getBilling(acct.userId);
    if (!billing?.stripe_customer_id) return json({ error: 'no_membership' }, 400);

    const portal = await stripe().billingPortal.sessions.create({
      customer: billing.stripe_customer_id,
      return_url: `${new URL(request.url).origin}/billing`,
    });
    return json({ url: portal.url });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
};
