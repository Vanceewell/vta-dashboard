/**
 * siteImages.ts — Supabase-backed storage for non-gallery site images.
 *
 * Stores images like hero background, logo, service cards, about portrait, etc.
 * Uses a `site_images` Supabase table with one row per named image slot.
 *
 * SQL to create the table (run once in Supabase SQL editor):
 *
 * create table if not exists site_images (
 *   id           uuid primary key default gen_random_uuid(),
 *   slot         text not null unique,   -- e.g. 'heroBackground', 'heroLogo'
 *   storage_path text not null,
 *   public_url   text not null,
 *   framing      jsonb,
 *   created_at   timestamptz not null default now(),
 *   updated_at   timestamptz not null default now()
 * );
 *
 * alter table site_images enable row level security;
 * create policy "Public read"  on site_images for select using (true);
 * create policy "Anon insert"  on site_images for insert with check (true);
 * create policy "Anon update"  on site_images for update using (true);
 * create policy "Anon delete"  on site_images for delete using (true);
 *
 * The storage bucket is the SAME "gallery" bucket used for gallery images.
 * Site images go into the "site/" prefix to keep them organised.
 */

import { supabase, STORAGE_BUCKET, isSupabaseConfigured } from './supabase';
import type { ImageFraming } from './galleryStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Named image slots
// ─────────────────────────────────────────────────────────────────────────────

export type SiteImageSlot =
  | 'heroBackground'
  | 'heroLogo'
  | 'aboutPortrait'
  | 'automotiveServiceImage'
  | 'residentialServiceImage'
  | 'commercialServiceImage'
  | 'marineServiceImage'
  | 'frostServiceImage'
  | 'safetyServiceImage'
  | 'ctaBackground'
  | 'automotivePageHero'
  | 'residentialPageHero'
  | 'commercialPageHero'
  | 'marinePageHero'
  | 'sanClementePageHero'
  | 'sanJuanPageHero'
  | 'talegaPageHero'
  | 'danaPointPageHero'
  | 'frostPageHero'
  | 'safetyPageHero'
  | 'laderaRanchPageHero'
  | 'campPendletonPageHero';

/** Map from slot name → legacy admin panel id (for migration awareness only) */
export const SLOT_TO_LEGACY_ID: Record<SiteImageSlot, string> = {
  heroBackground:          'hero-bg',
  heroLogo:                'hero-logo',
  aboutPortrait:           'about-portrait',
  automotiveServiceImage:  'service-automotive',
  residentialServiceImage: 'service-residential',
  commercialServiceImage:  'service-commercial',
  marineServiceImage:      'service-marine',
  frostServiceImage:       'service-frost',
  safetyServiceImage:      'service-safety',
  ctaBackground:           'cta-background',
  automotivePageHero:      'page-hero-automotive',
  residentialPageHero:     'page-hero-residential',
  commercialPageHero:      'page-hero-commercial',
  marinePageHero:          'page-hero-marine',
  sanClementePageHero:     'page-hero-san-clemente',
  sanJuanPageHero:         'page-hero-san-juan',
  talegaPageHero:          'page-hero-talega',
  danaPointPageHero:       'page-hero-dana-point',
  frostPageHero:            'page-hero-frost',
  safetyPageHero:           'page-hero-safety',
  laderaRanchPageHero:      'page-hero-ladera-ranch',
  campPendletonPageHero:    'page-hero-camp-pendleton',
};

/** All known slots in display order */
export const ALL_SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  'heroBackground',
  'heroLogo',
  'aboutPortrait',
  'automotiveServiceImage',
  'residentialServiceImage',
  'commercialServiceImage',
  'marineServiceImage',
  'frostServiceImage',
  'safetyServiceImage',
  'ctaBackground',
  'automotivePageHero',
  'residentialPageHero',
  'commercialPageHero',
  'marinePageHero',
  'sanClementePageHero',
  'sanJuanPageHero',
  'talegaPageHero',
  'danaPointPageHero',
  'frostPageHero',
  'safetyPageHero',
  'laderaRanchPageHero',
  'campPendletonPageHero',
];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteImageRow {
  id:           string;
  slot:         SiteImageSlot;
  storage_path: string;
  public_url:   string;
  framing:      ImageFraming | null;
  created_at:   string;
  updated_at:   string;
}

/** The map returned to components — slot → public URL */
export type SiteImageMap = Partial<Record<SiteImageSlot, string>>;

/** slot → framing config (only for slots with saved framing) */
export type SiteFramingMap = Partial<Record<SiteImageSlot, ImageFraming>>;

// ─────────────────────────────────────────────────────────────────────────────
// Fetch all site images
// ─────────────────────────────────────────────────────────────────────────────

/** Error codes Supabase returns when the table does not exist */
function isTableMissingError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === '42P01' ||
    (error.message ?? '').includes('does not exist') ||
    (error.message ?? '').includes('relation "site_images"')
  );
}

export async function fetchSiteImages(): Promise<{
  urls:    SiteImageMap;
  framing: SiteFramingMap;
}> {
  if (!supabase || !isSupabaseConfigured()) return { urls: {}, framing: {} };

  const { data, error } = await supabase
    .from('site_images')
    .select('*');

  if (error) {
    if (isTableMissingError(error)) {
      console.warn('[siteImages] site_images table not found — run setup SQL in Supabase.');
    } else {
      console.error('[siteImages] fetch error:', error);
    }
    return { urls: {}, framing: {} };
  }

  const urls:    SiteImageMap    = {};
  const framing: SiteFramingMap  = {};

  for (const row of (data ?? []) as SiteImageRow[]) {
    urls[row.slot]    = row.public_url;
    if (row.framing) framing[row.slot] = row.framing;
  }

  return { urls, framing };
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload / upsert a site image
// ─────────────────────────────────────────────────────────────────────────────

export type UploadSiteImageStatus =
  | { status: 'uploading' }
  | { status: 'saved'; publicUrl: string }
  | { status: 'error'; message: string };

export interface UploadSiteImageResult {
  ok:       boolean;
  publicUrl?: string;
  error?:   string;
}

/**
 * Upload a blob to Supabase Storage and upsert the site_images row for `slot`.
 * If a row already exists for this slot, the storage_path and public_url are updated
 * (old blob is removed after the new one is confirmed).
 */
export async function uploadSiteImage(
  slot:    SiteImageSlot,
  blob:    Blob,
  framing?: ImageFraming,
): Promise<UploadSiteImageResult> {
  if (!supabase || !isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  // Check if row already exists so we can clean up old storage file
  const { data: existing } = await supabase
    .from('site_images')
    .select('id, storage_path')
    .eq('slot', slot)
    .maybeSingle();

  const oldPath = (existing as SiteImageRow | null)?.storage_path ?? null;

  // Determine MIME / extension
  const isPng = blob.type === 'image/png';
  const mime  = isPng ? 'image/png' : 'image/webp';
  const ext   = isPng ? 'png' : 'webp';
  const path  = `site/${Date.now()}-${slot}.${ext}`;

  // Upload new blob
  const { error: storageErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: mime, upsert: false });

  if (storageErr) {
    console.error('[siteImages] storage upload error:', storageErr);
    return { ok: false, error: `Storage upload failed: ${storageErr.message}` };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Upsert the DB row (insert or update)
  const { error: dbErr } = await supabase
    .from('site_images')
    .upsert(
      {
        slot,
        storage_path: path,
        public_url:   publicUrl,
        framing:      framing ?? null,
        updated_at:   new Date().toISOString(),
      },
      { onConflict: 'slot' },
    );

  if (dbErr) {
    console.error('[siteImages] db upsert error:', dbErr);
    // Cleanup new storage blob since DB failed
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    if (isTableMissingError(dbErr)) {
      return { ok: false, error: 'Supabase site_images table or permissions need setup. Run the setup SQL in your Supabase SQL editor.' };
    }
    return { ok: false, error: `Database error: ${dbErr.message}` };
  }

  // Remove old storage blob if it existed
  if (oldPath && oldPath !== path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([oldPath]);
  }

  return { ok: true, publicUrl };
}

// ─────────────────────────────────────────────────────────────────────────────
// Update framing only (no re-upload)
// ─────────────────────────────────────────────────────────────────────────────

export async function updateSiteImageFraming(
  slot:    SiteImageSlot,
  framing: ImageFraming,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase not configured.' };
  }

  const { error } = await supabase
    .from('site_images')
    .update({ framing, updated_at: new Date().toISOString() })
    .eq('slot', slot);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete a site image (storage + DB row)
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteSiteImage(
  slot: SiteImageSlot,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase not configured.' };
  }

  // Get the row to find the storage path
  const { data } = await supabase
    .from('site_images')
    .select('storage_path')
    .eq('slot', slot)
    .maybeSingle();

  const storagePath = (data as Pick<SiteImageRow, 'storage_path'> | null)?.storage_path;
  if (storagePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  }

  const { error } = await supabase
    .from('site_images')
    .delete()
    .eq('slot', slot);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Image compression (same logic as gallery, for site images)
// ─────────────────────────────────────────────────────────────────────────────

const ACCEPTED_EXT  = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/** Validate, compress, and return a Blob ready for upload. Max 1800×1800, WebP 0.82. */
export async function processSiteImageFile(file: File): Promise<Blob> {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const extOk  = ACCEPTED_EXT.some((e) => name.endsWith(e));
  const mimeOk = ACCEPTED_MIME.includes(mime);

  if (!extOk && !mimeOk) {
    if (name.endsWith('.heic') || name.endsWith('.heif'))
      throw new Error('HEIC is not supported. Convert to JPG or PNG first.');
    if (name.endsWith('.tiff') || name.endsWith('.tif'))
      throw new Error('TIFF is not supported. Use JPG, PNG, or WebP.');
    if (['.raw', '.cr2', '.nef', '.arw', '.dng'].some((e) => name.endsWith(e)))
      throw new Error('RAW camera files are not supported. Export as JPG/PNG first.');
    throw new Error('Unsupported file type. Upload JPG, PNG, or WebP.');
  }

  const hasAlpha = mime === 'image/png' || name.endsWith('.png');
  return _compressToBlob(file, 1800, 1800, 0.82, hasAlpha);
}

function _compressToBlob(
  file:      File,
  maxWidth:  number,
  maxHeight: number,
  quality:   number,
  hasAlpha:  boolean,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable.')); return; }

        if (!hasAlpha) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        const outputMime = hasAlpha ? 'image/png' : 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Canvas toBlob returned null.')); return; }
            resolve(blob);
          },
          outputMime,
          hasAlpha ? undefined : quality,
        );
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };
    img.src = url;
  });
}
