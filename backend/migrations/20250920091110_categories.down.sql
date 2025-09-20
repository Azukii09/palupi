DROP INDEX IF EXISTS ix_categories_not_deleted;
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
DROP TABLE IF EXISTS categories;
