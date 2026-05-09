-- ═══════════════════════════════════════════════════════════
-- Migration 001 — Fix display_order INTEGER → BIGINT overflow
-- ═══════════════════════════════════════════════════════════
--
-- Problem:
--   display_order was defined as INTEGER (max ~2,147,483,647).
--   The app sets it to Date.now() in milliseconds (~1,778,357,050,327
--   as of May 2026), which is ~830× larger than INTEGER can hold.
--   Every upload attempt failed with:
--     "value '1778357050327' is out of range for type integer"
--
-- Fix:
--   Change display_order to BIGINT (max ~9.2 quintillion).
--   Date.now() values fit comfortably; JS numbers handle up to 2^53.
--
-- Safe to run on a live table — ALTER COLUMN TYPE is non-destructive
-- when the existing values are compatible (all 0s or small integers).
-- ═══════════════════════════════════════════════════════════

ALTER TABLE gallery_images
  ALTER COLUMN display_order TYPE BIGINT;

-- Verify (optional — shows current column type):
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'gallery_images' AND column_name = 'display_order';
