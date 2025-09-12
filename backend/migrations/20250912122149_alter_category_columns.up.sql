-- Pastikan extension UUID tersedia (untuk cast / gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ubah kolom parent (id) ke UUID
ALTER TABLE categories
ALTER COLUMN id TYPE uuid
  USING id::uuid;

-- Ubah kolom child (category_id) ke UUID
ALTER TABLE categories_i18n
ALTER COLUMN category_id TYPE uuid
  USING category_id::uuid;

-- Perbarui constraint FK
ALTER TABLE categories_i18n
DROP CONSTRAINT IF EXISTS categories_i18n_category_id_fkey;

ALTER TABLE categories_i18n
  ADD CONSTRAINT categories_i18n_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;-- Add up migration script here
