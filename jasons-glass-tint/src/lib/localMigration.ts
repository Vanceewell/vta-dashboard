/**
 * localMigration.ts — Migrate old browser-local gallery to Supabase
 * ─────────────────────────────────────────────────────────────────────────────
 * Covers every storage layer the app ever used:
 *
 *  Era 1 — localStorage blobs (v1 + v2 key)
 *    localStorage key: "jgt_gallery_items"   (canonical v1 key)
 *    localStorage key: "jgt_custom_gallery_v1" (even older alias)
 *    Shape: Array<{ id, title, src: "data:image/…base64…", categories, createdAt }>
 *
 *  Era 2 — IndexedDB blobs + localStorage metadata (v2)
 *    IndexedDB DB: "jgt_gallery", store: "images", key = id (string), value = Blob
 *    localStorage key: "jgt_gallery_meta"
 *    Shape: meta = Array<{ id, title, categories, createdAt, updatedAt }>
 *
 * The migrator reads all three sources, deduplicates by id, then uploads each
 * blob to Supabase via the normal addGalleryImage() path (compression included).
 */

import {
  addGalleryImage,
  type GalleryCategory,
  type GalleryItem,
} from './galleryStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Types for old storage shapes
// ─────────────────────────────────────────────────────────────────────────────

interface LegacyLSItem {
  id:         string;
  title:      string;
  /** base64 data URL  e.g. "data:image/webp;base64,…" */
  src:        string;
  categories: string[];
  createdAt?: number;
  addedAt?:   number;
}

interface LegacyMeta {
  id:         string;
  title:      string;
  categories: string[];
  createdAt?: number;
  updatedAt?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Result type — one entry per discovered local image
// ─────────────────────────────────────────────────────────────────────────────

export type MigrationItemStatus = 'pending' | 'uploading' | 'done' | 'error' | 'skipped';

export interface MigrationItem {
  localId:    string;
  title:      string;
  categories: GalleryCategory[];
  /** object URL for preview (revoke when done) */
  previewUrl: string;
  status:     MigrationItemStatus;
  error?:     string;
  /** Set after successful upload */
  supabaseItem?: GalleryItem;
}

// ─────────────────────────────────────────────────────────────────────────────
// IndexedDB helpers (read-only — we never write to the old DB here)
// ─────────────────────────────────────────────────────────────────────────────

const IDB_NAME    = 'jgt_gallery';
const IDB_STORE   = 'images';
const IDB_VERSION = 1;

function openLegacyIDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(null); return; }

    // Check if the DB exists by attempting to open it without upgrading
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);

    req.onupgradeneeded = (e) => {
      // If we had to upgrade, this is a fresh DB — no legacy data
      const db = (e.target as IDBOpenDBRequest).result;
      db.close();
      resolve(null);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => resolve(null);   // DB doesn't exist or is inaccessible
  });
}

async function idbGetAllKeys(db: IDBDatabase): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(IDB_STORE)) { resolve([]); return; }
    const tx    = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req   = store.getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror   = () => reject(req.error);
  });
}

async function idbGetBlob(db: IDBDatabase, key: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(IDB_STORE)) { resolve(null); return; }
    const tx    = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req   = store.get(key);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror   = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEYS_BLOB = ['jgt_gallery_items', 'jgt_custom_gallery_v1'] as const;
const LS_KEY_META  = 'jgt_gallery_meta';

function parseLSBlobItems(): LegacyLSItem[] {
  if (typeof localStorage === 'undefined') return [];
  const seen = new Set<string>();
  const out: LegacyLSItem[] = [];

  for (const key of LS_KEYS_BLOB) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) continue;
      for (const x of arr) {
        if (
          typeof x?.id  === 'string' && x.id &&
          typeof x?.src === 'string' && x.src.startsWith('data:image/') &&
          !seen.has(x.id)
        ) {
          seen.add(x.id);
          out.push(x as LegacyLSItem);
        }
      }
    } catch { /* malformed JSON — skip */ }
  }
  return out;
}

function parseLSMeta(): LegacyMeta[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY_META);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (x) => typeof x?.id === 'string' && x.id,
    ) as LegacyMeta[];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Convert a base64 data URL → Blob
// ─────────────────────────────────────────────────────────────────────────────

function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const [header, b64] = dataUrl.split(',');
    if (!header || !b64) return null;
    const mime = header.replace('data:', '').replace(';base64', '');
    const bin  = atob(b64);
    const buf  = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new Blob([buf], { type: mime });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scan — build the full list of local images to migrate
// ─────────────────────────────────────────────────────────────────────────────

export interface ScanResult {
  items:            MigrationItem[];
  /** Blobs keyed by localId — used internally during upload */
  _blobs:           Map<string, Blob>;
  hasLocalStorage:  boolean;
  hasIndexedDB:     boolean;
}

export async function scanLocalGallery(): Promise<ScanResult> {
  const result: ScanResult = {
    items:           [],
    _blobs:          new Map(),
    hasLocalStorage: false,
    hasIndexedDB:    false,
  };

  const seenIds = new Set<string>();

  // ── Era 1: localStorage blobs ──────────────────────────────────────────────
  const lsItems = parseLSBlobItems();
  if (lsItems.length > 0) result.hasLocalStorage = true;

  for (const item of lsItems) {
    if (seenIds.has(item.id)) continue;
    const blob = dataUrlToBlob(item.src);
    if (!blob) continue;

    seenIds.add(item.id);
    const previewUrl = URL.createObjectURL(blob);
    result._blobs.set(item.id, blob);
    result.items.push({
      localId:    item.id,
      title:      item.title || 'Untitled',
      categories: (item.categories ?? []) as GalleryCategory[],
      previewUrl,
      status:     'pending',
    });
  }

  // ── Era 2: IndexedDB blobs + localStorage metadata ─────────────────────────
  const meta    = parseLSMeta();
  const metaMap = new Map<string, LegacyMeta>(meta.map((m) => [m.id, m]));

  const db = await openLegacyIDB();
  if (db) {
    const keys = await idbGetAllKeys(db);
    if (keys.length > 0) result.hasIndexedDB = true;

    for (const key of keys) {
      if (seenIds.has(key)) continue;
      const blob = await idbGetBlob(db, key);
      if (!blob) continue;

      seenIds.add(key);
      const m          = metaMap.get(key);
      const previewUrl = URL.createObjectURL(blob);
      result._blobs.set(key, blob);
      result.items.push({
        localId:    key,
        title:      m?.title || 'Untitled',
        categories: (m?.categories ?? []) as GalleryCategory[],
        previewUrl,
        status:     'pending',
      });
    }
    db.close();
  }

  // ── Era 2 orphans: metadata with no IDB blob (edge case) ───────────────────
  // If meta entries have no matching IDB blob (e.g. IndexedDB was cleared),
  // they can't be migrated — skip them silently.

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload one item to Supabase
// ─────────────────────────────────────────────────────────────────────────────

export async function migrateOne(
  item:   MigrationItem,
  blobs:  Map<string, Blob>,
  onUpdate: (patch: Partial<MigrationItem>) => void,
): Promise<void> {
  const blob = blobs.get(item.localId);
  if (!blob) {
    onUpdate({ status: 'error', error: 'Blob not found in local cache.' });
    return;
  }

  onUpdate({ status: 'uploading' });

  try {
    // Re-use the same compression + upload pipeline as normal uploads
    // addGalleryImage accepts a Blob directly
    const result = await addGalleryImage(blob, item.title, item.categories);
    if (result.ok && result.item) {
      onUpdate({ status: 'done', supabaseItem: result.item });
    } else {
      onUpdate({ status: 'error', error: result.error ?? 'Upload failed.' });
    }
  } catch (err) {
    onUpdate({
      status: 'error',
      error:  err instanceof Error ? err.message : 'Unknown error during upload.',
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup — remove all old local storage after successful migration
// Call only when the user explicitly chooses to clear local data.
// ─────────────────────────────────────────────────────────────────────────────

export async function clearLegacyLocalStorage(): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    for (const key of [...LS_KEYS_BLOB, LS_KEY_META]) {
      try { localStorage.removeItem(key); } catch { /* noop */ }
    }
  }
}

export async function clearLegacyIndexedDB(): Promise<void> {
  const db = await openLegacyIDB();
  if (!db) return;
  await new Promise<void>((resolve, reject) => {
    if (!db.objectStoreNames.contains(IDB_STORE)) { resolve(); return; }
    const tx    = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req   = store.clear();
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
    tx.oncomplete  = () => db.close();
  });
}
