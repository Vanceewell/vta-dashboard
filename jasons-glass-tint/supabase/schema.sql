-- ═══════════════════════════════════════════════════════════
-- Jason's Glass Tint — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Create the gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path   TEXT NOT NULL UNIQUE,
  public_url     TEXT NOT NULL,
  filename       TEXT NOT NULL,
  category       TEXT NOT NULL DEFAULT 'automotive',
  title          TEXT,
  display_order  INTEGER DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- 3. Allow public reads (gallery is public)
CREATE POLICY "Public read access" ON gallery_images
  FOR SELECT
  USING (true);

-- 4. Allow all writes (no auth in basic setup)
--    For production: replace this with an auth check
CREATE POLICY "Allow all writes" ON gallery_images
  FOR ALL
  USING (true);

-- 5. Auto-update updated_at timestamp
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

-- 6. Index for category filtering
CREATE INDEX IF NOT EXISTS gallery_images_category_idx ON gallery_images (category);
CREATE INDEX IF NOT EXISTS gallery_images_order_idx    ON gallery_images (display_order, created_at);

-- ═══════════════════════════════════════════════════════════
-- STORAGE BUCKET SETUP
-- Run these steps manually in Supabase Dashboard:
-- 1. Go to Storage → Create bucket
-- 2. Name: "gallery"
-- 3. Public bucket: YES (toggle on)
-- 4. File size limit: 10MB (recommended)
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp
-- ═══════════════════════════════════════════════════════════
