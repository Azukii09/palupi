CREATE TABLE IF NOT EXISTS category_translations (
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale      text NOT NULL REFERENCES languages(code),
  name        varchar(255) NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz,
  PRIMARY KEY (category_id, locale)
  );

-- Auto-update updated_at
DROP TRIGGER IF EXISTS trg_category_translations_updated_at ON category_translations;
CREATE TRIGGER trg_category_translations_updated_at
  BEFORE UPDATE ON category_translations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indeks bantu (query per-locale)
CREATE INDEX IF NOT EXISTS ix_cat_trans_locale
  ON category_translations (locale) WHERE deleted_at IS NULL;
