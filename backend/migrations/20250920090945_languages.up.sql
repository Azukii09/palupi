CREATE TABLE IF NOT EXISTS languages (
  code       text PRIMARY KEY,          -- contoh: 'id', 'en'
  name       text NOT NULL,
  is_default boolean NOT NULL DEFAULT false
);

-- Hanya boleh satu baris default=true
CREATE UNIQUE INDEX IF NOT EXISTS ux_languages_default_true
  ON languages ((CASE WHEN is_default THEN 1 END))
  WHERE is_default = true;
