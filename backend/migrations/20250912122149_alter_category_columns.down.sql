-- Rollback ke text
ALTER TABLE categories_i18n
DROP CONSTRAINT IF EXISTS categories_i18n_category_id_fkey;

ALTER TABLE categories_i18n
ALTER COLUMN category_id TYPE text
  USING category_id::text;

ALTER TABLE categories
ALTER COLUMN id TYPE text
  USING id::text;

ALTER TABLE categories_i18n
  ADD CONSTRAINT categories_i18n_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;-- Add down migration script here
