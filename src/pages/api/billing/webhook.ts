export const prerender = false;

import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { stripe, syncSubscription } from '../../../lib/billing';

// Stripe → MYAH. Add this URL in Stripe → Developers → Webhooks
// (https://www.myahsits.com/api/billing/webhook) with the events below, and put
// its signing secret in Vercel as STRIPE_WEBHOOK_SECRET.
//
// Every event just re-reads the subscription from Stripe and saves it, so
// duplicates and out-of-order deliveries are harmless. A failure answers 500
// and Stripe retries it for up to three days.
const SUBSCRIPTION_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
]);

function subscriptionOf(event: Stripe.Event): string | null {
  const ref = (v: unknown) => (typeof v === 'string' ? v : (v as { id?: string } | null)?.id ?? null);
  if (SUBSCRIPTION_EVENTS.has(event.type)) return (event.data.object as Stripe.Subscription).id;
  if (event.type === 'checkout.session.completed') return ref((event.data.object as Stripe.Checkout.Session).subscription);
  if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
    return ref((event.data.object as Stripe.Invoice).parent?.subscription_details?.subscription);
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const secret = String(import.meta.env.STRIPE_WEBHOOK_SECRET ?? (globalThis as any).process?.env?.STRIPE_WEBHOOK_SECRET ?? '');
  const signature = request.headers.get('stripe-signature');
  if (!secret || !signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(await request.text(), signature, secret);
  } catch (e) {
    return new Response(`Bad signature: ${e instanceof Error ? e.message : ''}`, { status: 400 });
  }

  try {
    const sub = subscriptionOf(event);
    if (sub) await syncSubscription(sub);
    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[stripe webhook]', event.type, event.id, e);
    return new Response('Webhook handler failed', { status: 500 });
  }
};
