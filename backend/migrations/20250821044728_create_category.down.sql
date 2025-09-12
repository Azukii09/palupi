-- Drop triggers
DROP TRIGGER IF EXISTS trg_categories_i18n_updated_at ON categories_i18n;
DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;

-- Drop function
DROP FUNCTION IF EXISTS set_updated_at;

-- Drop tables (child first)
DROP TABLE IF EXISTS categories_i18n;
DROP TABLE IF EXISTS categories;

-- Drop enum type
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_status') THEN
DROP TYPE category_status;
END IF;
END$$;

-- (Keep pgcrypto extension; biasanya tidak di-drop di down)-- Add down migration script here
