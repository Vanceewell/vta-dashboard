/**
 * galleryStorage.ts
 * ─────────────────
 * Single source of truth for gallery data.
 * Both the admin editor and the public GallerySection MUST import from here.
 *
 * localStorage key: jgt_gallery_items
 */

// ── Canonical storage key ────────────────────────────────────────────────────
export const GALLERY_KEY = 'jgt_gallery_items';

// ── Category types ───────────────────────────────────────────────────────────
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

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];

// ── Data model ───────────────────────────────────────────────────────────────
export interface GalleryItem {
  id:         string;   // unique, never changes after creation
  title:      string;
  src:        string;   // compressed base64 data URL (data:image/...)
  categories: GalleryCategory[];  // always contains 'All Projects'
  createdAt:  number;  // ms timestamp
}

// ── Validate a single item ───────────────────────────────────────────────────
function isValidItem(x: unknown): x is GalleryItem {
  if (typeof x !== 'object' || x === null) return false;
  const item = x as Record<string, unknown>;
  return (
    typeof item.id         === 'string' && item.id !== '' &&
    typeof item.title      === 'string' &&
    typeof item.src        === 'string' && (item.src as string).startsWith('data:image/') &&
    Array.isArray(item.categories) &&
    (typeof item.createdAt === 'number' || typeof item.addedAt === 'number')
  );
}

// ── Normalize item from any stored shape ─────────────────────────────────────
function normalizeItem(x: Record<string, unknown>): GalleryItem {
  const cats = (Array.isArray(x.categories) ? x.categories : []) as GalleryCategory[];
  if (!cats.includes('All Projects')) cats.unshift('All Projects');
  return {
    id:         String(x.id),
    title:      String(x.title ?? ''),
    src:        String(x.src),
    categories: cats,
    createdAt:  typeof x.createdAt === 'number'
      ? x.createdAt
      : typeof x.addedAt === 'number'
        ? x.addedAt
        : Date.now(),
  };
}

// ── Load ─────────────────────────────────────────────────────────────────────
export function loadGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    // Also migrate from old key if new key is absent
    let raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) {
      raw = localStorage.getItem('jgt_custom_gallery_v1');
      if (raw) {
        // migrate: write to new key, leave old key alone (remove later if needed)
        try { localStorage.setItem(GALLERY_KEY, raw); } catch { /* ignore */ }
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isValidItem)
      .map((item) => normalizeItem(item as unknown as Record<string, unknown>));
  } catch {
    return [];
  }
}

// ── Save — returns true on success, false on quota error ─────────────────────
export function saveGallery(items: GalleryItem[]): { ok: boolean; error?: string } {
  if (typeof window === 'undefined') return { ok: false, error: 'Not in browser.' };
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    return { ok: true };
  } catch (err) {
    const msg =
      err instanceof DOMException && err.name === 'QuotaExceededError'
        ? 'Browser storage is full. Try fewer/smaller images or export your gallery backup.'
        : 'Failed to save gallery.';
    return { ok: false, error: msg };
  }
}

// ── Clear ────────────────────────────────────────────────────────────────────
export function clearGallery(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(GALLERY_KEY); } catch { /* noop */ }
}

// ── Export to JSON string (for download) ─────────────────────────────────────
export function exportGalleryJSON(items: GalleryItem[]): string {
  return JSON.stringify(items, null, 2);
}

// ── Import from JSON string — validates each item ────────────────────────────
export function importGalleryJSON(json: string): { items: GalleryItem[]; errors: string[] } {
  const errors: string[] = [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { items: [], errors: ['Invalid JSON file.'] };
  }
  if (!Array.isArray(parsed)) {
    return { items: [], errors: ['Expected a JSON array of gallery items.'] };
  }
  const items: GalleryItem[] = [];
  for (let i = 0; i < parsed.length; i++) {
    if (isValidItem(parsed[i])) {
      items.push(normalizeItem(parsed[i] as Record<string, unknown>));
    } else {
      errors.push(`Item ${i + 1} skipped: invalid format.`);
    }
  }
  return { items, errors };
}

// ── Image compression helpers (shared) ───────────────────────────────────────

const MAX_STORED_BYTES = 4 * 1024 * 1024; // 4 MB safety cap per image

const ACCEPTED_EXT  = ['.jpg', '.jpeg', '.png', '.webp'];
const ACCEPTED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function compressImageFile(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  hasAlpha: boolean,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img  = new Image();
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
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      } catch (e) { reject(e); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image.')); };
    img.src = url;
  });
}

export async function processImageForGallery(file: File): Promise<string> {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const extOk  = ACCEPTED_EXT.some((e)  => name.endsWith(e));
  const mimeOk = ACCEPTED_MIME.includes(mime);
  if (!extOk && !mimeOk) {
    if (name.endsWith('.heic') || name.endsWith('.heif')) throw new Error('HEIC files are not supported. Convert to JPG/PNG first.');
    if (name.endsWith('.tiff') || name.endsWith('.tif'))  throw new Error('TIFF files are not supported. Use JPG, PNG, or WebP.');
    if (['.raw', '.cr2', '.nef', '.arw', '.dng'].some((e) => name.endsWith(e))) throw new Error('RAW files are not supported. Export as JPG/PNG first.');
    throw new Error('Unsupported file type. Upload JPG, PNG, or WebP.');
  }
  const hasAlpha = mime === 'image/png' || name.endsWith('.png');
  const dataUrl  = await compressImageFile(file, 1800, 1800, 0.82, hasAlpha);
  if (dataUrl.length > MAX_STORED_BYTES) {
    throw new Error('Image is too large after compression. Try a smaller/lower-res image.');
  }
  return dataUrl;
}
