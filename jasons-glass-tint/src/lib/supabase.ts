import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// Supabase client
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const STORAGE_BUCKET = 'gallery';

/** True if Supabase is properly configured */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey);
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type GalleryCategory =
  | 'All Projects'
  | 'Automotive'
  | 'Residential'
  | 'Commercial'
  | 'Marine'
  | 'RV'
  | 'Frost'
  | 'Safety Film';

export interface ImageFraming {
  zoom:    number;
  offsetX: number;
  offsetY: number;
}

/**
 * Row shape for the `gallery_images` Supabase table.
 *
 * SQL to create this table (run once in Supabase SQL editor):
 *
 * create table if not exists gallery_images (
 *   id            uuid primary key default gen_random_uuid(),
 *   storage_path  text not null,
 *   public_url    text not null,
 *   filename      text not null,
 *   title         text not null default '',
 *   categories    text[] not null default '{}',
 *   framing       jsonb,
 *   display_order integer not null default 0,
 *   created_at    timestamptz not null default now(),
 *   updated_at    timestamptz not null default now()
 * );
 *
 * -- Allow public read
 * alter table gallery_images enable row level security;
 * create policy "Public read" on gallery_images for select using (true);
 * -- For anon uploads you also need insert/update/delete policies,
 * -- OR use the service-role key server-side (recommended for production).
 *
 * -- Storage bucket
 * -- Create a bucket named "gallery" with public access enabled.
 */
export interface GalleryRow {
  id:            string;
  storage_path:  string;
  public_url:    string;
  filename:      string;
  title:         string;
  categories:    GalleryCategory[];
  framing:       ImageFraming | null;
  display_order: number;
  created_at:    string;
  updated_at:    string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────────────────────────────────────

/** Load all gallery images ordered by display_order desc, created_at desc. */
export async function fetchSupabaseGallery(): Promise<GalleryRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: false })
    .order('created_at',    { ascending: false });
  if (error) {
    console.error('[gallery] fetch error:', error);
    return [];
  }
  return (data ?? []) as GalleryRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload
// ─────────────────────────────────────────────────────────────────────────────

export interface UploadResult {
  ok:     boolean;
  row?:   GalleryRow;
  error?: string;
}

/**
 * Upload a compressed blob to Supabase Storage, then insert a DB row.
 * Returns the full GalleryRow on success.
 */
export async function uploadToSupabase(
  blob:       Blob,
  filename:   string,
  title:      string,
  categories: GalleryCategory[],
  framing?:   ImageFraming,
): Promise<UploadResult> {
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured. See setup instructions.' };
  }

  // Determine mime / extension
  const isWebP  = blob.type === 'image/webp';
  const isPng   = blob.type === 'image/png';
  const mime    = isPng ? 'image/png' : 'image/webp';
  const ext     = isPng ? 'png' : 'webp';
  const safe    = filename.replace(/[^a-z0-9._-]/gi, '_').toLowerCase().replace(/\.[^.]+$/, '');
  const path    = `uploads/${Date.now()}-${safe}.${ext}`;

  // Upload blob to storage
  const { error: storageErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: mime, upsert: false });

  if (storageErr) {
    console.error('[gallery] storage upload error:', storageErr);
    return { ok: false, error: `Upload failed: ${storageErr.message}` };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Insert DB row
  const { data, error: dbErr } = await supabase
    .from('gallery_images')
    .insert({
      storage_path:  path,
      public_url:    publicUrl,
      filename:      `${safe}.${ext}`,
      title:         title.trim(),
      categories:    categories,
      framing:       framing ?? null,
      display_order: Date.now(),   // use timestamp so newest sorts first
    })
    .select()
    .single();

  if (dbErr) {
    console.error('[gallery] db insert error:', dbErr);
    // Storage upload succeeded but DB failed — try to clean up
    supabase.storage.from(STORAGE_BUCKET).remove([path]);
    return { ok: false, error: `Database error: ${dbErr.message}` };
  }

  return { ok: true, row: data as GalleryRow };
}

// ─────────────────────────────────────────────────────────────────────────────
// Update metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function updateSupabaseMeta(
  id:    string,
  patch: Partial<Pick<GalleryRow, 'title' | 'categories' | 'framing'>>,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured.' };
  const { error } = await supabase
    .from('gallery_images')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteFromSupabase(row: GalleryRow): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured.' };
  // Remove from storage
  await supabase.storage.from(STORAGE_BUCKET).remove([row.storage_path]);
  // Remove from DB
  const { error } = await supabase.from('gallery_images').delete().eq('id', row.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Replace image (keep same DB row, swap blob + public_url)
// ─────────────────────────────────────────────────────────────────────────────

export async function replaceInSupabase(
  row:  GalleryRow,
  blob: Blob,
): Promise<{ ok: boolean; publicUrl?: string; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured.' };

  const isPng  = blob.type === 'image/png';
  const mime   = isPng ? 'image/png' : 'image/webp';
  const ext    = isPng ? 'png' : 'webp';
  const safe   = row.filename.replace(/\.[^.]+$/, '');
  const newPath = `uploads/${Date.now()}-${safe}.${ext}`;

  // Upload new blob
  const { error: storageErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(newPath, blob, { contentType: mime, upsert: false });
  if (storageErr) return { ok: false, error: storageErr.message };

  // Get new public URL
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(newPath);
  const publicUrl = urlData.publicUrl;

  // Update DB row
  const { error: dbErr } = await supabase
    .from('gallery_images')
    .update({ storage_path: newPath, public_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', row.id);

  if (dbErr) {
    await supabase.storage.from(STORAGE_BUCKET).remove([newPath]);
    return { ok: false, error: dbErr.message };
  }

  // Remove old blob
  await supabase.storage.from(STORAGE_BUCKET).remove([row.storage_path]);

  return { ok: true, publicUrl };
}
