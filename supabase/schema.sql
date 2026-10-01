-- ═══════════════════════════════════════════════════════════════════
--  Grotto Sitters — SaaS Database Schema
--  Run this in your Supabase SQL editor (or psql) before seed.sql
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────────────────────
-- Stores login credentials for sitters and owners.
-- IMPORTANT: Always bcrypt-hash passwords before inserting. Never store
-- plaintext. Use bcrypt cost factor ≥ 12.
CREATE TABLE IF NOT EXISTS users (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        UNIQUE NOT NULL,
  password   TEXT        NOT NULL,          -- bcrypt hash only
  role       TEXT        NOT NULL DEFAULT 'sitter',  -- 'sitter' or 'owner'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- One profile per user (sitter or owner).
-- Each profile maps to a public page at /[slug].
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- URL slug:  "callum-and-niamh"  →  /profile/callum-and-niamh
  slug              TEXT        UNIQUE NOT NULL
                                CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  -- Core display fields
  name              TEXT        NOT NULL,    -- "Callum & Niamh"
  tagline           TEXT,                    -- hero sub-headline
  badge_text        TEXT,                    -- small pill in hero ("Currently in Australia…")
  bio               TEXT,                    -- plain text; paragraphs separated by \n\n

  -- Images
  profile_pic       TEXT,                    -- URL of main profile photo
  hero_images_json  JSONB NOT NULL DEFAULT '[]',   -- [{src, pos}]
  about_images_json JSONB NOT NULL DEFAULT '[]',   -- [{src, alt}]

  -- Content blobs
  gallery_json      JSONB NOT NULL DEFAULT '[]',   -- [{src, alt}]
  reviews_json      JSONB NOT NULL DEFAULT '[]',   -- [{text, name, initials, platform}]
  platforms_json    JSONB NOT NULL DEFAULT '[]',   -- [{name, url, emoji, description}]
  review_requests_json JSONB NOT NULL DEFAULT '[]', -- [{token, created_at, status, reviewer_name?}]
  account_type      TEXT  NOT NULL DEFAULT 'solo',  -- 'solo' or 'joint'
  profile_type      TEXT  NOT NULL DEFAULT 'sitter', -- 'sitter' or 'owner'
  location          TEXT,                           -- city/area for owner listings
  pets_json         JSONB NOT NULL DEFAULT '[]',   -- [{name, type, breed, age, temperament, special_needs, photo_url}]
  amenities_json    JSONB NOT NULL DEFAULT '[]',   -- ["WiFi", "Parking", ...]
  looking_for       TEXT,                           -- what owner wants in a sitter
  contact_email     TEXT,                           -- where enquiries go
  whatsapp_number   TEXT,                           -- optional WhatsApp
  headings_json     JSONB NOT NULL DEFAULT '{}',   -- {about_label, about_title, reviews_label, ...}
  theme_json        JSONB NOT NULL DEFAULT '{}',   -- {background, accent, accent_light, text, text_soft}

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_slug_idx    ON profiles (slug);
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles (user_id);

-- Auto-bump updated_at on every row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── LISTINGS ─────────────────────────────────────────────────────────────────
-- Date-based sit requests posted by owners.
-- Each listing references the owner's profile (which holds the reusable
-- home / pets "master") and adds dates + description for a specific sit.
CREATE TABLE IF NOT EXISTS listings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  title       TEXT        NOT NULL,               -- "2 weeks in Sydney with 2 dogs"
  description TEXT,                               -- sit-specific details
  date_from   DATE        NOT NULL,
  date_to     DATE        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'filled', 'cancelled')),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listings_profile_id_idx ON listings (profile_id);
CREATE INDEX IF NOT EXISTS listings_status_idx     ON listings (status);
CREATE INDEX IF NOT EXISTS listings_dates_idx      ON listings (date_from, date_to);

DROP TRIGGER IF EXISTS listings_updated_at ON listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ── APPLICATIONS ─────────────────────────────────────────────────────────────
-- A sitter applying for an owner's listing. Read by /applications (and counted
-- on the Edit listing page); the owner shortlists or declines each one.
CREATE TABLE IF NOT EXISTS applications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- the sitter
  message     TEXT,                                -- the sitter's note to the owner
  date_fit    TEXT,                                -- e.g. "Free for all 14 days"
  tags_json   JSONB       NOT NULL DEFAULT '[]',   -- ["Dogs", "Works from home"]
  status      TEXT        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'shortlisted', 'declined')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, profile_id)
);

CREATE INDEX IF NOT EXISTS applications_listing_id_idx ON applications (listing_id);


-- ── SAVED SITS ───────────────────────────────────────────────────────────────
-- Listings a sitter has hearted. Shown on /saved.
CREATE TABLE IF NOT EXISTS saved_sits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- the sitter
  listing_id  UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, listing_id)
);

CREATE INDEX IF NOT EXISTS saved_sits_profile_id_idx ON saved_sits (profile_id);

-- Saved searches and how the sitter wants to hear about matches (/saved).
--   saved_searches_json: [{id, name, terms, on}]
--   alert_prefs_json:    {email, push, weekly}
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS saved_searches_json JSONB NOT NULL DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alert_prefs_json    JSONB NOT NULL DEFAULT '{"email": true, "push": true, "weekly": false}';


-- ── NOTIFICATIONS ────────────────────────────────────────────────────────────
-- Everything that happens on an account. Shown on /notifications; written by
-- src/lib/notify.ts (new message, shortlisted by an owner, new review).
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind        TEXT        NOT NULL DEFAULT 'account'
                          CHECK (kind IN ('urgent', 'message', 'sit', 'review', 'match', 'account')),
  title       TEXT        NOT NULL,
  body        TEXT,
  link        TEXT,                                -- where the button goes
  cta         TEXT,                                -- button label
  read        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_profile_id_idx ON notifications (profile_id, created_at DESC);

-- What also leaves the page (email/push): {applications, messages, sit, matches, product}
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notify_prefs_json JSONB NOT NULL DEFAULT '{"applications": true, "messages": true, "sit": true, "matches": false, "product": false}';


-- ── ID VERIFICATION ──────────────────────────────────────────────────────────
-- /verification. The sitter starts a check (status -> pending); whoever reviews
-- it sets verified_id = true, id_check_status = 'verified' and id_verified_at.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_id     BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_check_status TEXT    NOT NULL DEFAULT 'none'
  CHECK (id_check_status IN ('none', 'pending', 'verified'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_submitted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS id_verified_at  TIMESTAMPTZ;
