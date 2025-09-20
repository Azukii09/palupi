-- Wajibkan setiap category punya terjemahan pada default locale
-- (agar read tanpa fallback, performa lebih bagus)

CREATE OR REPLACE FUNCTION ensure_default_translation() RETURNS trigger AS $$
DECLARE def_locale text;
BEGIN
SELECT code INTO def_locale FROM languages WHERE is_default = true LIMIT 1;
IF def_locale IS NULL THEN
    RAISE EXCEPTION 'No default language configured in table languages';
END IF;

  -- Jika kategori belum soft delete, wajib ada baris terjemahan default
  IF NEW.deleted_at IS NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM category_translations
      WHERE category_id = NEW.id
        AND locale = def_locale
        AND deleted_at IS NULL
    ) THEN
      RAISE EXCEPTION 'Category % is missing default (%) translation', NEW.id, def_locale;
END IF;
END IF;

RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Constraint trigger: dicek saat COMMIT (DEFERRABLE), aman saat insert category + translation dalam 1 transaksi
DROP TRIGGER IF EXISTS trg_categories_require_default ON categories;
CREATE CONSTRAINT TRIGGER trg_categories_require_default
AFTER INSERT OR UPDATE ON categories
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ensure_default_translation();
