DROP INDEX IF EXISTS ix_cat_trans_locale;
DROP TRIGGER IF EXISTS trg_category_translations_updated_at ON category_translations;
DROP TABLE IF EXISTS category_translations;
