-- Set default locale ke 'id' dan tambahkan 'en'
INSERT INTO languages (code, name, is_default)
VALUES ('id', 'Indonesian', true)
  ON CONFLICT (code) DO NOTHING;

INSERT INTO languages (code, name, is_default)
VALUES ('en', 'English', false)
  ON CONFLICT (code) DO NOTHING;
