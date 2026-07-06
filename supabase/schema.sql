-- ═══════════════════════════════════════════════════════════════════
--  Grotto Sitters — SaaS Database Schema
--  Run this in your Supabase SQL editor (or psql) before seed.sql
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────────────────────
-- Stores login credentials for sitters.
-- IMPORTANT: Always bcrypt-hash passwords before inserting. Never store
-- plaintext. Use bcrypt cost factor ≥ 12.
CREATE TABLE IF NOT EXISTS users (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        UNIQUE NOT NULL,
  password   TEXT        NOT NULL,          -- bcrypt hash only
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- One profile per sitter (or sitter pair).
-- Each profile maps to a public page at /profile/[slug].
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
