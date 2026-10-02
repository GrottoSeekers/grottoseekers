-- ID verification: everyone uploads photo ID + a selfie; the founders review
-- them on /admin/verifications. Run once in the Supabase SQL Editor
-- (project vutlmqzvakbmosrpicre). Safe to run more than once.

-- 1. Where each member's check is recorded.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_id      BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_check_status  TEXT    NOT NULL DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_submitted_at  TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_verified_at   TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_doc_path      TEXT;   -- private file, deleted after review
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_selfie_path   TEXT;   -- private file, deleted after review
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_reject_reason TEXT;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_check_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_id_check_status_check
  CHECK (id_check_status IN ('none', 'pending', 'verified', 'rejected'));

-- 2. The founders' account is verified (it is the one that approves others).
UPDATE profiles
SET verified_id = true, id_check_status = 'verified', id_verified_at = COALESCE(id_verified_at, now())
WHERE slug = 'callumandniamh';

-- 3. A PRIVATE storage folder for the ID photos (no public links). Only the
--    website's server — which holds the project key — can read or write it.
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-documents', 'id-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS myah_id_documents ON storage.objects;
CREATE POLICY myah_id_documents ON storage.objects
  FOR ALL TO public
  USING (bucket_id = 'id-documents')
  WITH CHECK (bucket_id = 'id-documents');

NOTIFY pgrst, 'reload schema';
