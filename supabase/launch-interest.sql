-- The "launching soon" interest list: everyone who registers their email
-- before MYAH opens, so they can be emailed from /admin on launch day.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.launch_interest (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL UNIQUE,
  role        text,
  source      text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz
);

ALTER TABLE public.launch_interest ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS myah_website_access ON public.launch_interest;
CREATE POLICY myah_website_access ON public.launch_interest FOR ALL TO public USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
