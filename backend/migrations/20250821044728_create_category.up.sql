-- Add up migration script here
-- Enable UUID generator for seeding (doesn't force defaults on app inserts)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enum status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_status') THEN
CREATE TYPE category_status AS ENUM ('active', 'inactive');
END IF;
END$$;

-- Parent table: categories
CREATE TABLE IF NOT EXISTS categories (
                                        id          UUID PRIMARY KEY,
                                        status      category_status NOT NULL DEFAULT 'active',
                                        created_at  TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
  );

-- Child table for i18n (name & description per-locale)
CREATE TABLE IF NOT EXISTS categories_i18n (
                                             category_id UUID        NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale      VARCHAR(16) NOT NULL,
  name        TEXT        NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT categories_i18n_pk PRIMARY KEY (category_id, locale)
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_i18n_locale_name
  ON categories_i18n (locale, lower(name));

CREATE INDEX IF NOT EXISTS idx_categories_not_deleted
  ON categories (id)
  WHERE deleted_at IS NULL;

-- Updated_at trigger function (shared)
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_i18n_updated_at ON categories_i18n;
CREATE TRIGGER trg_categories_i18n_updated_at
  BEFORE UPDATE ON categories_i18n
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

---------------------------------------------------------------------
-- Seed 10 dummy categories (UUID generated here only for seed)
---------------------------------------------------------------------
WITH cats AS (
INSERT INTO categories (id, status)
SELECT gen_random_uuid(),
       CASE WHEN i IN (3, 7) THEN 'inactive'::category_status ELSE 'active'::category_status END
FROM generate_series(1,10) AS s(i)
  RETURNING id, created_at
)
INSERT INTO categories_i18n (category_id, locale, name, description)
SELECT id, 'id',
       'Kategori ' || row_number() OVER (ORDER BY created_at),
  'Deskripsi contoh kategori ' || row_number() OVER (ORDER BY created_at)
FROM cats
UNION ALL
SELECT id, 'en',
       'Category ' || row_number() OVER (ORDER BY created_at),
  'Sample description for category ' || row_number() OVER (ORDER BY created_at)
FROM cats;
