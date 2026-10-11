-- Memberships: each member's Stripe customer and subscription, kept up to date
-- by the Stripe webhook (/api/billing/webhook). Run once in the Supabase SQL
-- Editor. Safe to run more than once.

CREATE TABLE IF NOT EXISTS billing (
  user_id                UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT        UNIQUE,
  stripe_subscription_id TEXT,
  status                 TEXT        NOT NULL DEFAULT 'none',  -- Stripe subscription status, or 'none'
  plan                   TEXT,                                 -- price lookup key, e.g. myah_sitter_annual
  current_period_end     TIMESTAMPTZ,
  cancel_at_period_end   BOOLEAN     NOT NULL DEFAULT false,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Same rule as the other tables (see allow-website-access.sql): only the
-- website's server talks to the database, so it may read and write this one.
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS myah_website_access ON public.billing;
CREATE POLICY myah_website_access ON public.billing FOR ALL TO public USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
