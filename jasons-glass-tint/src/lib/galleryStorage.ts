/**
 * galleryStorage.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for gallery data.
 * Both the admin editor and the public GallerySection import from here.
 *
 * Storage strategy:
 *   • IndexedDB  — image blobs (no size limit, handles full-size photos)
 *   • localStorage — metadata only (ids, titles, categories, timestamps)
 *
 * IndexedDB DB name : jgt_gallery
 * IndexedDB store   : images          (key: id, value: Blob)
 * localStorage key  : jgt_gallery_meta
 *
 * Migration: any old base64 data URLs stored in jgt_gallery_items or
 * jgt_custom_gallery_v1 are silently dropped (they bloated localStorage).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DB_NAME      = 'jgt_gallery';
const DB_VERSION   = 1;
const STORE_NAME   = 'images';
const META_KEY     = 'jgt_gallery_meta';  // localStorage key for metadata array

// ─────────────────────────────────────────────────────────────────────────────
// Category types
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

/** Metadata stored in localStorage (small, serialisable). */
export interface GalleryMeta {
  id:         string;
  title:      string;
  categories: GalleryCategory[];
  createdAt:  number;
  updatedAt:  number;
}

/** Full item = metadata + an object URL ready for <img src>. */
export interface GalleryItem extends GalleryMeta {
  /** Object URL created from the blob — revoke when done, or reuse. */
  objectUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// IndexedDB helpers
// ─────────────────────────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function idbPut(id: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.put(blob, id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
    tx.oncomplete  = () => db.close();
  });
}

async function idbGet(id: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.get(id);
    req.onsuccess = () => { db.close(); resolve(req.result as Blob | undefined); };
    req.onerror   = () => { db.close(); reject(req.error); };
  });
}

async function idbDelete(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
    tx.oncomplete  = () => db.close();
  });
}

async function idbGetAllKeys(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.getAllKeys();
    req.onsuccess = () => { db.close(); resolve(req.result as string[]); };
    req.onerror   = () => { db.close(); reject(req.error); };
  });
}

async function idbClear(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
    tx.oncomplete  = () => db.close();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata helpers (localStorage — only the small fields)
// ─────────────────────────────────────────────────────────────────────────────

function loadMeta(): GalleryMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMeta).map(normalizeMeta);
  } catch {
    return [];
  }
}

function saveMeta(items: GalleryMeta[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(META_KEY, JSON.stringify(items));
  } catch {
    // Metadata is tiny; this almost never fails.
    // If it does, the image is still in IndexedDB.
  }
}

function clearMeta(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(META_KEY); } catch { /* noop */ }
  // Also remove old localStorage blob keys so we don't accumulate junk
  try { localStorage.removeItem('jgt_gallery_items'); } catch { /* noop */ }
  try { localStorage.removeItem('jgt_custom_gallery_v1'); } catch { /* noop */ }
}

function isValidMeta(x: unknown): boolean {
  if (typeof x !== 'object' || x === null) return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.id    === 'string' && m.id !== '' &&
    typeof m.title === 'string' &&
    Array.isArray(m.categories)
  );
}

function normalizeMeta(x: Record<string, unknown>): GalleryMeta {
  const cats = (Array.isArray(x.categories) ? [...x.categories] : []) as GalleryCategory[];
  // Do NOT auto-inject 'All Projects' — user controls that category manually
  return {
    id:         String(x.id),
    title:      String(x.title ?? ''),
    categories: cats,
    createdAt:  typeof x.createdAt === 'number' ? x.createdAt
               : typeof x.addedAt  === 'number' ? x.addedAt : Date.now(),
    updatedAt:  typeof x.updatedAt === 'number' ? x.updatedAt : Date.now(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all gallery items.
 * Returns GalleryItem[] where each item has an objectUrl ready to use in <img>.
 * Call URL.revokeObjectURL(item.objectUrl) when the component unmounts.
 */
export async function loadGallery(): Promise<GalleryItem[]> {
  if (typeof window === 'undefined') return [];
  const metas = loadMeta();
  if (metas.length === 0) return [];

  // Load blobs from IndexedDB in parallel
  const items = await Promise.all(
    metas.map(async (meta): Promise<GalleryItem | null> => {
      try {
        const blob = await idbGet(meta.id);
        if (!blob) return null; // blob missing — orphaned metadata
        return { ...meta, objectUrl: URL.createObjectURL(blob) };
      } catch {
        return null;
      }
    }),
  );
  return items.filter((item): item is GalleryItem => item !== null);
}

/**
 * Add a new image to the gallery.
 * Accepts a File or Blob (already compressed by processImageForGallery).
 */
export async function addGalleryImage(
  blob:       Blob,
  title:      string,
  categories: GalleryCategory[],
): Promise<{ ok: boolean; item?: GalleryItem; error?: string }> {
  if (typeof window === 'undefined') return { ok: false, error: 'Not in browser.' };
  const id = `gci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  // Use exactly the categories the user selected — do NOT auto-add 'All Projects'
  const cats: GalleryCategory[] = [...categories];

  try {
    await idbPut(id, blob);
  } catch (err) {
    return {
      ok: false,
      error: 'Gallery storage is full. Delete older images or use smaller files.',
    };
  }

  const now  = Date.now();
  const meta: GalleryMeta = { id, title, categories: cats, createdAt: now, updatedAt: now };
  const metas = [meta, ...loadMeta()];
  saveMeta(metas);

  return {
    ok:   true,
    item: { ...meta, objectUrl: URL.createObjectURL(blob) },
  };
}

/**
 * Replace the image blob for an existing gallery item.
 */
export async function replaceGalleryImage(
  id:   string,
  blob: Blob,
): Promise<{ ok: boolean; objectUrl?: string; error?: string }> {
  if (typeof window === 'undefined') return { ok: false, error: 'Not in browser.' };
  try {
    await idbPut(id, blob);
    // Update updatedAt in metadata
    const metas = loadMeta().map((m) =>
      m.id === id ? { ...m, updatedAt: Date.now() } : m,
    );
    saveMeta(metas);
    return { ok: true, objectUrl: URL.createObjectURL(blob) };
  } catch {
    return {
      ok: false,
      error: 'Gallery storage is full. Delete older images or use smaller files.',
    };
  }
}

/**
 * Update only metadata fields (title, categories) for an existing item.
 * Does not touch the blob.
 */
export function updateGalleryMeta(
  id:    string,
  patch: Partial<Pick<GalleryMeta, 'title' | 'categories'>>,
): void {
  if (typeof window === 'undefined') return;
  const metas = loadMeta().map((m) => {
    if (m.id !== id) return m;
    // Use exactly what the user chose — no auto-injection of 'All Projects'
    const cats = patch.categories ?? m.categories;
    return {
      ...m,
      title:      patch.title ?? m.title,
      categories: cats,
      updatedAt:  Date.now(),
    };
  });
  saveMeta(metas);
}

/**
 * Delete an image (blob + metadata).
 */
export async function deleteGalleryImage(id: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try { await idbDelete(id); } catch { /* ignore */ }
  saveMeta(loadMeta().filter((m) => m.id !== id));
}

/**
 * Clear ALL gallery data (blobs + metadata).
 */
export async function clearGallery(): Promise<void> {
  if (typeof window === 'undefined') return;
  try { await idbClear(); } catch { /* ignore */ }
  clearMeta();
}

/**
 * Remove metadata entries whose blobs are missing in IndexedDB (orphan cleanup).
 * Returns number of entries removed.
 */
export async function cleanBrokenGalleryData(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  let keys: string[] = [];
  try { keys = await idbGetAllKeys(); } catch { return 0; }
  const keySet = new Set(keys);
  const metas  = loadMeta();
  const clean  = metas.filter((m) => keySet.has(m.id));
  const removed = metas.length - clean.length;
  if (removed > 0) saveMeta(clean);
  return removed;
}

/**
 * Export gallery metadata as a downloadable JSON (no blobs — just structure).
 * Images can be re-imported later from JSON, but blobs must be re-uploaded.
 */
export function exportGalleryMetaJSON(metas: GalleryMeta[]): string {
  return JSON.stringify(
    metas.map(({ id, title, categories, createdAt, updatedAt }) => ({
      id, title, categories, createdAt, updatedAt,
    })),
    null, 2,
  );
}

/**
 * Get current metadata list (synchronous, no blobs).
 */
export function getGalleryMeta(): GalleryMeta[] {
  return loadMeta();
}

// ─────────────────────────────────────────────────────────────────────────────
// Image compression
// ─────────────────────────────────────────────────────────────────────────────

const ACCEPTED_EXT  = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validate, compress, and return a Blob suitable for IndexedDB storage.
 * Max 1600×1600 px, WebP at 0.78 quality (PNG for transparency).
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
