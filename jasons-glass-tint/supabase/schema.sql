-- ═══════════════════════════════════════════════════════════
-- Jason's Glass Tint — Supabase Schema (v3)
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Create the gallery_images table
--    Columns match the GalleryRow interface in src/lib/supabase.ts
--
--    NOTE: display_order is BIGINT (not INTEGER) because it stores
--    Date.now() values (~1.78 trillion ms) which exceed INTEGER max
--    (~2.1 billion). Using INTEGER caused: "value is out of range for
--    type integer" errors on every upload.
CREATE TABLE IF NOT EXISTS gallery_images (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path   TEXT NOT NULL UNIQUE,
  public_url     TEXT NOT NULL,
  filename       TEXT NOT NULL DEFAULT '',
  title          TEXT NOT NULL DEFAULT '',
  categories     TEXT[] NOT NULL DEFAULT '{}',
  framing        JSONB,
  display_order  BIGINT DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. Allow public reads (gallery is public)
CREATE POLICY "Public read access" ON gallery_images
  FOR SELECT
  USING (true);

-- 4. Allow anonymous inserts (admin upload with anon key)
CREATE POLICY "Anon insert" ON gallery_images
  FOR INSERT
  WITH CHECK (true);

-- 5. Allow anonymous updates (title/category edits)
CREATE POLICY "Anon update" ON gallery_images
  FOR UPDATE
  USING (true);

-- 6. Allow anonymous deletes
CREATE POLICY "Anon delete" ON gallery_images
  FOR DELETE
  USING (true);

-- 7. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 8. Indexes
CREATE INDEX IF NOT EXISTS gallery_images_order_idx ON gallery_images (display_order DESC, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- MIGRATION (if table already exists with INTEGER display_order)
-- Run this if you see: "value is out of range for type integer"
-- ═══════════════════════════════════════════════════════════
-- ALTER TABLE gallery_images ALTER COLUMN display_order TYPE BIGINT;
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- STORAGE BUCKET SETUP (if not already done)
-- 1. Go to Supabase → Storage → New Bucket
-- 2. Name: "gallery"  ← must be exact
-- 3. Public bucket: YES (toggle on)
-- 4. File size limit: 10 MB recommended
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp
-- ═══════════════════════════════════════════════════════════
