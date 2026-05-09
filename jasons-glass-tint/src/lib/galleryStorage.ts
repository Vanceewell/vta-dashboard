/**
 * galleryStorage.ts — Supabase-first gallery storage
 * ─────────────────────────────────────────────────────────────────────────────
 * PRIMARY:  Supabase Storage (blobs) + Supabase DB (metadata)
 *           → images are public URLs visible on ALL devices
 *
 * FALLBACK: If Supabase is not configured, uploads are rejected with a clear
 *           setup instruction message. We never silently fall back to local-only
 *           storage, which caused images to disappear on other devices.
 *
 * LOCAL CACHE: IndexedDB stores blob previews for instant display while the
 *              public URL is loading, and for the upload preview. This is
 *              cleared/not relied upon for cross-device visibility.
 */

import {
  isSupabaseConfigured,
  fetchSupabaseGallery,
  uploadToSupabase,
  updateSupabaseMeta,
  deleteFromSupabase,
  replaceInSupabase,
  type GalleryRow,
} from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Re-export category types (unchanged — used across the codebase)
// ─────────────────────────────────────────────────────────────────────────────

export const GALLERY_CATEGORIES = [
  'All Projects',
  'Automotive',
  'Residential',
  'Commercial',
  'Marine',
  'RV',
  'Frost',
  'Safety Film',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

// ─────────────────────────────────────────────────────────────────────────────
// Data models
// ─────────────────────────────────────────────────────────────────────────────

export interface ImageFraming {
  zoom:    number;
  offsetX: number;
  offsetY: number;
}

/**
 * The shape components work with.
 * `objectUrl` is either a Supabase public URL or a temporary local blob URL.
 */
export interface GalleryItem {
  id:         string;
  title:      string;
  categories: GalleryCategory[];
  framing?:   ImageFraming;
  createdAt:  number;
  updatedAt:  number;
  /** Public URL (Supabase) or temporary blob URL (local preview only) */
  objectUrl:  string;
  /** True when the image lives in Supabase and is publicly accessible */
  isPublic:   boolean;
}

// Keep GalleryMeta for any callers that use it
export type GalleryMeta = Omit<GalleryItem, 'objectUrl' | 'isPublic'>;

// ─────────────────────────────────────────────────────────────────────────────
// Row → GalleryItem converter
// ─────────────────────────────────────────────────────────────────────────────

function rowToItem(row: GalleryRow): GalleryItem {
  return {
    id:         row.id,
    title:      row.title,
    categories: row.categories as GalleryCategory[],
    framing:    row.framing ?? undefined,
    createdAt:  new Date(row.created_at).getTime(),
    updatedAt:  new Date(row.updated_at).getTime(),
    objectUrl:  row.public_url,
    isPublic:   true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API — mirrors old interface so admin page and GallerySection
//              need minimal changes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all gallery items from Supabase.
 * Returns items ordered by newest first.
 */
export async function loadGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    // Return empty so gallery shows the empty state rather than crashing
    console.warn('[gallery] Supabase not configured — gallery will be empty until credentials are set.');
    return [];
  }
  const rows = await fetchSupabaseGallery();
  return rows.map(rowToItem);
}

/**
 * Add a new image to the gallery via Supabase.
 */
export async function addGalleryImage(
  blob:       Blob,
  title:      string,
  categories: GalleryCategory[],
  framing?:   ImageFraming,
): Promise<{ ok: boolean; item?: GalleryItem; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok:    false,
      error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables, then redeploy.',
    };
  }

  const result = await uploadToSupabase(
    blob,
    `upload-${Date.now()}`,
    title,
    categories,
    framing,
  );

  if (!result.ok || !result.row) {
    return { ok: false, error: result.error ?? 'Upload failed.' };
  }

  return { ok: true, item: rowToItem(result.row) };
}

/**
 * Replace the image blob for an existing gallery item.
 * `row` is optional for API compatibility — if omitted the replace will fail gracefully.
 */
export async function replaceGalleryImage(
  id:   string,
  blob: Blob,
  row?: GalleryRow,
): Promise<{ ok: boolean; objectUrl?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase not configured.' };
  }
  if (!row) {
    return { ok: false, error: 'Row data required to replace image in Supabase mode.' };
  }
  const result = await replaceInSupabase(row, blob);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, objectUrl: result.publicUrl };
}

/**
 * Update metadata (title, categories, framing) for an existing item.
 */
export async function updateGalleryMeta(
  id:    string,
  patch: Partial<Pick<GalleryMeta, 'title' | 'categories' | 'framing'>>,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await updateSupabaseMeta(id, {
    title:      patch.title,
    categories: patch.categories as GalleryCategory[],
    framing:    patch.framing ?? null,
  });
}

/**
 * Delete an image from Supabase Storage and DB.
 * `row` is optional for API compatibility — if omitted, only the DB row is deleted
 * (the storage blob will be orphaned; clean up via Supabase dashboard).
 */
export async function deleteGalleryImage(
  id:   string,
  row?: GalleryRow,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (row) {
    await deleteFromSupabase(row);
  } else {
    // Fallback: delete only the DB row (blob stays in storage)
    const { supabase } = await import('./supabase');
    if (supabase) {
      await supabase.from('gallery_images').delete().eq('id', id);
    }
  }
}

/**
 * Get gallery metadata (synchronous helper — fetches from Supabase async).
 * Use loadGallery() for the actual async load.
 */
export function getGalleryMeta(): GalleryMeta[] {
  // This is a sync API from the old interface; we can't fetch async here.
  // Callers should use loadGallery() instead.
  return [];
}

/**
 * Clear ALL gallery images from Supabase.
 * @deprecated Use individual deleteGalleryImage() calls instead.
 * This no-ops silently — deleting all images via the admin panel should be
 * done image-by-image. Kept for API compatibility with admin-hero-layout.
 */
export async function clearGallery(): Promise<void> {
  // No-op: Supabase gallery should not be bulk-cleared from the browser.
  // The admin-hero-layout reset button is a legacy IndexedDB action.
  console.warn('[gallery] clearGallery() is a no-op in Supabase mode. Delete images individually in the Gallery Manager.');
}

/**
 * Remove metadata entries whose blobs are missing (orphan cleanup).
 * In Supabase mode, rows with missing storage files are cleaned by checking public URLs.
 * Returns 0 — Supabase orphan cleanup should be done via the Supabase dashboard.
 */
export async function cleanBrokenGalleryData(): Promise<number> {
  console.warn('[gallery] cleanBrokenGalleryData() is a no-op in Supabase mode.');
  return 0;
}

/**
 * Export gallery metadata as a downloadable JSON.
 * Works with the in-memory GalleryMeta list passed by the caller.
 */
export function exportGalleryMetaJSON(metas: GalleryMeta[]): string {
  return JSON.stringify(
    metas.map(({ id, title, categories, createdAt, updatedAt }) => ({
      id, title, categories, createdAt, updatedAt,
    })),
    null, 2,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image compression (unchanged — still used before upload)
// ─────────────────────────────────────────────────────────────────────────────

const ACCEPTED_EXT  = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate, compress, and return a Blob ready for Supabase upload.
 * Max 1600×1600 px, WebP at 0.78 quality (PNG preserved for transparency).
 */
export async function processImageForGallery(file: File): Promise<Blob> {
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
  return compressToBlob(file, 1600, 1600, 0.78, hasAlpha);
}

function compressToBlob(
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
      reject(new Error('Failed to load image.'));
    };
    img.src = url;
  });
}
