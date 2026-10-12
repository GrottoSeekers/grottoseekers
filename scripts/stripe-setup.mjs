// Creates MYAH's membership products and prices in Stripe. Run once per
// Stripe account (test mode first, then live). Safe to run again: anything
// that already exists is left alone.
//
//   STRIPE_SECRET_KEY=sk_test_… node scripts/stripe-setup.mjs \
//     --currency gbp --monthly 499 --annual 4999
//
// Amounts are in the smallest unit (pence). Prices include VAT
// (tax_behavior=inclusive), as UK shoppers expect. To change a price later,
// create a new one in the Dashboard and transfer the lookup key to it.
import Stripe from 'stripe';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error('Set STRIPE_SECRET_KEY first.');
const stripe = new Stripe(key);
const currency = (args.currency || 'gbp').toLowerCase();

// Electronically supplied services: an online membership.
const TAX_CODE = 'txcd_10000000';

// One membership for everyone: sitters and owners pay the same.
const PRODUCT = { name: 'MYAH Membership', description: 'Membership of MYAH, for house & pet sitters and home owners.' };
const PRICES = [
  { interval: 'month', lookup_key: 'myah_monthly', arg: 'monthly' },
  { interval: 'year', lookup_key: 'myah_annual', arg: 'annual' },
];

for (const p of PRICES) {
  if (!/^\d+$/.test(args[p.arg] || '')) throw new Error(`Missing --${p.arg} <amount in pence>`);
}

const found = await stripe.products.search({ query: `metadata['myah']:'membership' AND active:'true'` });
const product = found.data[0] ?? (await stripe.products.create({ ...PRODUCT, tax_code: TAX_CODE, metadata: { myah: 'membership' } }));
console.log(`${found.data[0] ? 'exists ' : 'created'}  ${product.id}  ${PRODUCT.name}`);

for (const p of PRICES) {
  const { data } = await stripe.prices.list({ lookup_keys: [p.lookup_key], active: true, limit: 1 });
  if (data[0]) {
    console.log(`exists   ${data[0].id}  ${p.lookup_key}  ${data[0].unit_amount} ${data[0].currency}/${p.interval}`);
    continue;
  }
  const price = await stripe.prices.create({
    product: product.id,
    currency,
    unit_amount: Number(args[p.arg]),
    recurring: { interval: p.interval },
    tax_behavior: 'inclusive',
    lookup_key: p.lookup_key,
  });
  console.log(`created  ${price.id}  ${p.lookup_key}  ${price.unit_amount} ${currency}/${p.interval}`);
}
