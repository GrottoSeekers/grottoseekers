# Stripe memberships

MYAH will charge sitters and owners a monthly or yearly membership. The code is
in place but **switched off** — MYAH stays free until `PAYMENTS_ENABLED=true`
is set in Vercel.

| Stripe product | What it does for MYAH |
| --- | --- |
| **Payments** (Checkout) | Takes the first payment on a Stripe-hosted page — cards, Apple Pay, Google Pay. |
| **Billing / Invoicing** | Renews each membership and emails an invoice/receipt every period. Members download past invoices in the Customer Portal. One-off invoices can be sent from the Dashboard. |
| **Tax** | Adds UK VAT (and overseas tax where MYAH is registered) from the member's address. |

## How it fits together

- `src/lib/billing.ts` — the switch (`PAYMENTS_ENABLED`), plan lookup keys, `hasAccess()`, syncing.
- `/billing` — the member's Membership page (in the nav only when payments are on).
- `/api/billing/checkout` — starts a Checkout for the member's own side.
- `/api/billing/portal` — opens the Customer Portal (change plan, card, invoices, cancel).
- `/api/billing/webhook` — Stripe tells MYAH about changes; saved in the `billing` table.
- `supabase/billing.sql` — creates the `billing` table.
- `scripts/stripe-setup.mjs` — creates the products and prices.

Prices are found by **lookup key**: `myah_sitter_monthly`, `myah_sitter_annual`,
`myah_owner_monthly`, `myah_owner_annual`.

## Setting it up (do it all in test mode first)

1. **Stripe account** — business country United Kingdom; business name MYAH,
   website https://www.myahsits.com.
2. **Tax** — Settings → Tax: set your head office address, and add your UK VAT
   registration once you have one. Stripe Tax's monitoring will tell you when
   sales in another country need registering there.
3. **Supabase** — run `supabase/billing.sql` in the SQL Editor.
4. **Products and prices** —
   `STRIPE_SECRET_KEY=sk_test_… node scripts/stripe-setup.mjs --sitter-monthly 999 --sitter-annual 9900 --owner-monthly 999 --owner-annual 9900`
   (amounts in pence, VAT included).
5. **Customer portal** — Settings → Billing → Customer portal: allow cancelling,
   updating payment methods, invoice history, and switching between the
   monthly and yearly prices of each product.
6. **Webhook** — Developers → Webhooks → add
   `https://www.myahsits.com/api/billing/webhook` with events
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `customer.subscription.paused`, `customer.subscription.resumed`,
   `invoice.paid`, `invoice.payment_failed`.
7. **Vercel env vars** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and
   `PAYMENTS_ENABLED` (leave `false` until you start charging).
8. **Recommended Dashboard settings** — Billing → Revenue recovery: Smart
   Retries and failed-payment emails on; Emails: send receipts and upcoming
   renewal reminders; Checkout → Adaptive Pricing on, so members abroad see
   prices in their own currency.

Founders can test `/billing` before launch: the full-site preview from `/admin`
plus `PAYMENTS_ENABLED=true` in a Vercel *Preview* environment with test keys.
Test card: `4242 4242 4242 4242`, any future date, any CVC.

## Before switching it on for real

- Decide what free members can still do; use `hasAccess()` (it is always true
  while payments are off) to gate applying, posting sits or messaging.
- Update the "Free to join / No membership fees" copy on the coming-soon page
  and section 4 of the terms ("Membership is free"), and give existing members
  notice.
- Swap to live keys and repeat steps 4–7 in live mode.
