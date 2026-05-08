import { createClient } from '@supabase/supabase-js';

// AI-EDITABLE: Supabase config
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const STORAGE_BUCKET = 'gallery';

export interface GalleryImage {
  id:            string;
  storage_path:  string;
  public_url:    string;
  filename:      string;
  category:      string;
  title:         string | null;
  display_order: number;
  created_at:    string;
}

/** Fetch all gallery images from Supabase */
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) { console.error('[gallery] fetch error:', error); return []; }
  return data as GalleryImage[];
}

/** Upload a file to Supabase storage and record it in the DB */
export async function uploadGalleryImage(
  file: File,
  category: string,
  title: string,
  compressedBlob?: Blob,
): Promise<GalleryImage | null> {
  if (!supabase) return null;

  const blob     = compressedBlob ?? file;
  const ext      = 'jpg';
  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
  const path     = `${category}/${filename}`;

  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

  if (uploadErr) { console.error('[gallery] upload error:', uploadErr); return null; }

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  const { data, error: dbErr } = await supabase
    .from('gallery_images')
    .insert({ storage_path: path, public_url: publicUrl, filename, category, title })
    .select()
    .single();

  if (dbErr) { console.error('[gallery] db error:', dbErr); return null; }
  return data as GalleryImage;
}

/** Delete an image from storage and DB */
export async function deleteGalleryImage(image: GalleryImage): Promise<boolean> {
  if (!supabase) return false;
  await supabase.storage.from(STORAGE_BUCKET).remove([image.storage_path]);
  const { error } = await supabase.from('gallery_images').delete().eq('id', image.id);
  return !error;
}

/** Client-side image compression using Canvas API */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality  = 0.85,
): Promise<Blob> {
  return new Promise((resolve) => {
    const img    = new Image();
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;
    img.onload = () => {
      const ratio   = Math.min(maxWidth / img.width, 1);
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality);
    };
    img.src = URL.createObjectURL(file);
  });
}
