'use client';
import { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import Link from 'next/link';
import {
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  compressImage,
  GalleryImage,
} from '@/lib/supabase';

// AI-EDITABLE: gallery categories
const CATEGORIES = ['automotive', 'residential', 'commercial', 'marine', 'rv', 'frost', 'safety film'];

interface QueueItem {
  id:       string;
  file:     File;
  preview:  string;
  category: string;
  title:    string;
  status:   'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

export default function AdminGalleryPage() {
  const [images,    setImages]    = useState<GalleryImage[]>([]);
  const [queue,     setQueue]     = useState<QueueItem[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [connected, setConnected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check Supabase connection and load images
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    setConnected(Boolean(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'));

    fetchGalleryImages().then((imgs) => {
      setImages(imgs);
      setLoading(false);
    });
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setQueue((prev) => [
          ...prev,
          {
            id:       Math.random().toString(36).slice(2),
            file,
            preview:  e.target?.result as string,
            category: 'automotive',
            title:    file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            status:   'pending',
            progress: 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const updateQueue = (id: string, patch: Partial<QueueItem>) =>
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, ...patch } : q));

  const uploadItem = async (item: QueueItem) => {
    if (!connected) {
      alert('Supabase is not configured. See .env.local setup instructions in README.md.');
      return;
    }
    updateQueue(item.id, { status: 'uploading', progress: 30 });
    const compressed = await compressImage(item.file);
    updateQueue(item.id, { progress: 60 });
    const result = await uploadGalleryImage(item.file, item.category, item.title, compressed);
    if (result) {
      updateQueue(item.id, { status: 'done', progress: 100 });
      setImages((prev) => [result, ...prev]);
    } else {
      updateQueue(item.id, { status: 'error', progress: 0 });
    }
  };

  const uploadAll = async () => {
    const pending = queue.filter((q) => q.status === 'pending');
    for (const item of pending) await uploadItem(item);
  };

  const removeQueued = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((q) => q.id !== id);
    });
  };

  const deleteImage = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.filename}"? This cannot be undone.`)) return;
    await deleteGalleryImage(img);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  return (
    <div className="min-h-screen bg-jgt-bg text-jgt-text font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-jgt-border/50 px-6 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="font-display text-jgt-gold text-lg">Jason's Glass Tint</Link>
          <span className="font-sans text-jgt-muted text-xs ml-3 tracking-wider uppercase">/ Admin Gallery</span>
        </div>
        <Link href="/" className="btn-outline text-xs px-4 py-2">← Back to Site</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Connection status */}
        {!connected && (
          <div className="mb-8 p-5 border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <p className="font-sans text-amber-400 text-sm font-500 mb-1">Supabase Not Configured</p>
                <p className="font-sans text-amber-400/70 text-xs leading-relaxed">
                  Copy <code className="bg-white/10 px-1">.env.example</code> to <code className="bg-white/10 px-1">.env.local</code> and add your Supabase credentials to enable image uploads.
                  See <strong>README.md</strong> for full setup instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Page title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-jgt-text mb-2">Gallery Manager</h1>
          <p className="font-sans text-jgt-muted text-sm">
            Drag and drop photos to upload them to your gallery. Images are automatically compressed before upload.
          </p>
        </div>

        {/* ── UPLOAD ZONE ──────────────────────────────── */}
        <div
          className={`drop-zone border-2 border-dashed border-jgt-border rounded-none p-12 text-center cursor-pointer transition-all mb-8 ${dragging ? 'drag-active' : 'hover:border-jgt-gold/40'}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center glass-light">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C5A056" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="font-sans text-jgt-text text-sm font-500 mb-1">
                Drop photos here or click to browse
              </p>
              <p className="font-sans text-jgt-muted text-xs">
                JPG, PNG, WEBP — auto-compressed to 1200px max width, 85% quality
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* ── UPLOAD QUEUE ─────────────────────────────── */}
        {queue.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl text-jgt-text">Upload Queue ({queue.length})</h2>
              <div className="flex gap-3">
                <button onClick={() => setQueue([])} className="btn-outline text-xs px-4 py-2">Clear All</button>
                <button onClick={uploadAll} className="btn-gold text-xs px-6 py-2">Upload All</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queue.map((item) => (
                <div key={item.id} className="glass-light overflow-hidden">
                  {/* Preview */}
                  <div className="relative aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                    {/* Status overlay */}
                    {item.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-16 h-1.5 bg-jgt-border rounded-full overflow-hidden">
                          <div className="h-full bg-jgt-gold transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    )}
                    {item.status === 'done' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C5A056" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                    {item.status === 'error' && (
                      <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      </div>
                    )}
                    <button
                      onClick={() => removeQueued(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center glass text-jgt-text hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  {/* Metadata inputs */}
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateQueue(item.id, { title: e.target.value })}
                      placeholder="Image title"
                      className="w-full bg-transparent border border-jgt-border px-3 py-2 font-sans text-xs text-jgt-text placeholder:text-jgt-muted/50 focus:outline-none focus:border-jgt-gold transition-colors"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => updateQueue(item.id, { category: e.target.value })}
                      className="w-full bg-jgt-surface border border-jgt-border px-3 py-2 font-sans text-xs text-jgt-text focus:outline-none focus:border-jgt-gold transition-colors cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                    {item.status === 'pending' && (
                      <button onClick={() => uploadItem(item)} className="w-full btn-gold text-xs py-2">
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UPLOADED IMAGES LIBRARY ──────────────────── */}
        <div>
          <h2 className="font-display text-2xl text-jgt-text mb-6">
            Gallery Library {images.length > 0 && <span className="text-jgt-muted text-lg">({images.length})</span>}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-jgt-surface animate-pulse" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 border border-jgt-border/30">
              <p className="font-sans text-jgt-muted text-sm">No images uploaded yet.</p>
              <p className="font-sans text-jgt-muted/50 text-xs mt-2">Drop photos above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.public_url}
                      alt={img.title ?? img.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <p className="font-sans text-jgt-text text-xs text-center line-clamp-2">{img.title ?? img.filename}</p>
                    <span className="font-sans text-jgt-gold text-[10px] tracking-[0.14em] uppercase">{img.category}</span>
                    <button
                      onClick={() => deleteImage(img)}
                      className="mt-2 flex items-center gap-1.5 font-sans text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-5 border border-jgt-border/30">
          <p className="font-sans text-jgt-muted text-xs leading-relaxed">
            <strong className="text-jgt-text">Security note:</strong> This admin page has no authentication in the current build.
            To secure it, add a simple password check in <code>src/app/admin-gallery/page.tsx</code> or enable Supabase Row Level Security
            with an auth policy. See README.md for details.
          </p>
        </div>
      </div>
    </div>
  );
}
