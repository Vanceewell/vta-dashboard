'use client';
import { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import Link from 'next/link';
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
  loadGallery,
  addGalleryImage,
  updateGalleryMeta,
  deleteGalleryImage,
  processImageForGallery,
} from '@/lib/galleryStorage';

interface QueueItem {
  id:         string;
  file:       File;
  preview:    string;
  categories: GalleryCategory[];
  title:      string;
  status:     'pending' | 'uploading' | 'done' | 'error';
  progress:   number;
  error?:     string;
}

interface EditState {
  img:        GalleryItem;
  title:      string;
  categories: GalleryCategory[];
}

export default function AdminGalleryPage() {
  const [items,     setItems]     = useState<GalleryItem[]>([]);
  const [queue,     setQueue]     = useState<QueueItem[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [editState, setEditState] = useState<EditState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery from IndexedDB on mount
  useEffect(() => {
    loadGallery().then((loaded) => {
      setItems(loaded);
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
            id:         Math.random().toString(36).slice(2),
            file,
            preview:    e.target?.result as string,
            categories: [],   // no categories pre-selected; user picks manually
            title:      file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            status:     'pending',
            progress:   0,
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
    updateQueue(item.id, { status: 'uploading', progress: 30 });
    try {
      const compressed = await processImageForGallery(item.file);
      updateQueue(item.id, { progress: 60 });
      const result = await addGalleryImage(compressed, item.title, item.categories);
      if (result.ok && result.item) {
        updateQueue(item.id, { status: 'done', progress: 100 });
        setItems((prev) => [result.item!, ...prev]);
      } else {
        updateQueue(item.id, { status: 'error', progress: 0, error: result.error });
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Upload failed';
      updateQueue(item.id, { status: 'error', progress: 0, error });
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

  const deleteImage = async (img: GalleryItem) => {
    if (!confirm(`Delete "${img.title}"? This cannot be undone.`)) return;
    URL.revokeObjectURL(img.objectUrl);
    await deleteGalleryImage(img.id);
    setItems((prev) => prev.filter((i) => i.id !== img.id));
  };

  const openEdit = (img: GalleryItem) => {
    setEditState({ img, title: img.title, categories: [...img.categories] });
  };

  const saveEdit = () => {
    if (!editState) return;
    updateGalleryMeta(editState.img.id, {
      title:      editState.title,
      categories: editState.categories,
    });
    setItems((prev) =>
      prev.map((i) =>
        i.id === editState.img.id
          ? { ...i, title: editState.title, categories: editState.categories, updatedAt: Date.now() }
          : i,
      ),
    );
    setEditState(null);
  };

  const toggleEditCat = (cat: GalleryCategory) => {
    if (!editState) return;
    setEditState((prev) => {
      if (!prev) return prev;
      const has = prev.categories.includes(cat);
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  return (
    <div className="min-h-screen bg-jgt-bg text-jgt-text font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-jgt-border/50 px-6 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="font-display text-jgt-gold text-lg">Jason&apos;s Glass Tint</Link>
          <span className="font-sans text-jgt-muted text-xs ml-3 tracking-wider uppercase">/ Admin Gallery</span>
        </div>
        <Link href="/" className="btn-outline text-xs px-4 py-2">← Back to Site</Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Info note */}
        <div className="mb-8 p-5 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <p className="font-sans text-blue-400 text-sm font-500 mb-1">IndexedDB Storage</p>
              <p className="font-sans text-blue-400/70 text-xs leading-relaxed">
                Images are stored locally in your browser&apos;s IndexedDB. They persist across sessions and are synced with the public Gallery automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Page title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-jgt-text mb-2">Gallery Manager</h1>
          <p className="font-sans text-jgt-muted text-sm">
            Drag and drop photos to add them to your gallery. Images are automatically compressed to 1600×1600px before storage.
            Choose categories manually — including whether each image appears in <strong className="text-jgt-text">All Projects</strong>.
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
                JPG, PNG, WebP — auto-compressed to 1600px max, stored locally in IndexedDB
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
                    {/* All 8 categories including All Projects — fully manual */}
                    <div className="space-y-1.5">
                      <p className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase mb-1">Categories</p>
                      {GALLERY_CATEGORIES.map((cat) => (
                        <label key={cat} className={`flex items-center gap-2 cursor-pointer ${cat === 'All Projects' ? 'border-b border-jgt-border/30 pb-1.5 mb-1' : ''}`}>
                          <input
                            type="checkbox"
                            checked={item.categories.includes(cat)}
                            onChange={(e) => {
                              const cats = e.target.checked
                                ? [...item.categories, cat]
                                : item.categories.filter((c) => c !== cat);
                              updateQueue(item.id, { categories: cats });
                            }}
                            className="w-3 h-3 accent-jgt-gold cursor-pointer"
                          />
                          <span className={`font-sans text-xs ${cat === 'All Projects' ? 'text-jgt-gold' : 'text-jgt-text'}`}>{cat}</span>
                        </label>
                      ))}
                    </div>
                    {item.status === 'pending' && (
                      <button onClick={() => uploadItem(item)} className="w-full btn-gold text-xs py-2">
                        Upload
                      </button>
                    )}
                    {item.status === 'error' && item.error && (
                      <p className="font-sans text-xs text-red-400">{item.error}</p>
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
            Gallery Library {items.length > 0 && <span className="text-jgt-muted text-lg">({items.length})</span>}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video bg-jgt-surface animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 border border-jgt-border/30">
              <p className="font-sans text-jgt-muted text-sm">No images in gallery yet.</p>
              <p className="font-sans text-jgt-muted/50 text-xs mt-2">Drop photos above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((img) => (
                <div key={img.id} className="group relative overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.objectUrl}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <p className="font-sans text-jgt-text text-xs text-center line-clamp-2">{img.title}</p>
                    <span className="font-sans text-jgt-gold text-[10px] tracking-[0.14em] uppercase text-center">
                      {img.categories.length > 0 ? img.categories.join(', ') : 'No categories'}
                    </span>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEdit(img)}
                        className="flex items-center gap-1.5 font-sans text-xs text-jgt-gold hover:text-jgt-text border border-jgt-gold/30 px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteImage(img)}
                        className="flex items-center gap-1.5 font-sans text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        Delete
                      </button>
                    </div>
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
            Gallery data is stored locally in IndexedDB — to secure access, add a password check in <code>src/app/admin-gallery/page.tsx</code>.
          </p>
        </div>
      </div>

      {/* ── EDIT MODAL ───────────────────────────────────── */}
      {editState && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditState(null); }}
        >
          <div className="glass-light w-full max-w-sm p-6 space-y-5">
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-jgt-text">Edit Image</h3>
              <button
                onClick={() => setEditState(null)}
                className="w-7 h-7 flex items-center justify-center text-jgt-muted hover:text-jgt-text transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Thumbnail */}
            <div className="aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editState.img.objectUrl} alt={editState.img.title} className="w-full h-full object-cover" />
            </div>

            {/* Title */}
            <div>
              <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase block mb-1.5">Title</label>
              <input
                type="text"
                value={editState.title}
                onChange={(e) => setEditState((prev) => prev ? { ...prev, title: e.target.value } : prev)}
                placeholder="Image title"
                className="w-full bg-transparent border border-jgt-border px-3 py-2 font-sans text-xs text-jgt-text placeholder:text-jgt-muted/50 focus:outline-none focus:border-jgt-gold transition-colors"
              />
            </div>

            {/* Categories — all 8, including All Projects */}
            <div>
              <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase block mb-2">Categories</label>
              <div className="space-y-1.5">
                {GALLERY_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2.5 cursor-pointer py-0.5 ${cat === 'All Projects' ? 'border-b border-jgt-border/30 pb-2 mb-1' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={editState.categories.includes(cat)}
                      onChange={() => toggleEditCat(cat)}
                      className="w-3.5 h-3.5 accent-jgt-gold cursor-pointer"
                    />
                    <span className={`font-sans text-sm ${cat === 'All Projects' ? 'text-jgt-gold font-medium' : 'text-jgt-text'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setEditState(null)}
                className="flex-1 btn-outline text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 btn-gold text-xs py-2.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
