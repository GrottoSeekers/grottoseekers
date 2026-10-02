-- Let the website use the newer tables.
--
-- Supabase switches on row-level security for every new table, and a table
-- with security on but no rules refuses every write ("new row violates
-- row-level security policy"). MYAH signs people in itself and talks to the
-- database only from its server, with the project key in Vercel — the key
-- never reaches visitors' browsers. So each table gets one rule: the website
-- may read and write it. Security stays switched on.
-- Safe to run more than once.

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['applications','notifications','sits','invites','saved_sits','conversations','messages']
  LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('DROP POLICY IF EXISTS myah_website_access ON public.%I', t);
      EXECUTE format('CREATE POLICY myah_website_access ON public.%I FOR ALL TO public USING (true) WITH CHECK (true)', t);
    END IF;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
