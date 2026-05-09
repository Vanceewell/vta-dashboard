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
import { isSupabaseConfigured, type GalleryRow } from '@/lib/supabase';
import {
  scanLocalGallery,
  migrateOne,
  clearLegacyLocalStorage,
  clearLegacyIndexedDB,
  type MigrationItem,
  type ScanResult,
} from '@/lib/localMigration';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type UploadStatus = 'pending' | 'uploading' | 'done' | 'error';

interface QueueItem {
  id:         string;
  file:       File;
  preview:    string;
  categories: GalleryCategory[];
  title:      string;
  status:     UploadStatus;
  progress:   number;
  error?:     string;
}

interface EditState {
  img:        GalleryItem;
  title:      string;
  categories: GalleryCategory[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge component
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status, error }: { status: UploadStatus; error?: string }) {
  if (status === 'uploading') {
    return (
      <div className="flex items-center gap-1.5 font-sans text-xs text-jgt-gold">
        <span className="inline-block w-2 h-2 rounded-full bg-jgt-gold animate-pulse" />
        Uploading…
      </div>
    );
  }
  if (status === 'done') {
    return (
      <div className="flex items-center gap-1.5 font-sans text-xs text-emerald-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Saved live
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 font-sans text-xs text-red-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Upload failed
        </div>
        {error && <p className="font-sans text-[10px] text-red-400/80 leading-relaxed">{error}</p>}
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase setup instructions banner
// ─────────────────────────────────────────────────────────────────────────────

function SetupInstructions() {
  return (
    <div className="mb-8 p-6 border border-amber-500/40 bg-amber-500/5">
      <div className="flex items-start gap-3 mb-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="mt-0.5 flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div>
          <p className="font-sans text-amber-400 text-sm font-semibold mb-2">Supabase Not Configured</p>
          <p className="font-sans text-amber-400/80 text-xs leading-relaxed mb-4">
            Images are not being saved to shared storage. To make gallery images visible on all devices, you need to connect Supabase.
          </p>
          <ol className="font-sans text-amber-400/70 text-xs leading-relaxed space-y-1.5 list-decimal list-inside">
            <li>Go to <strong className="text-amber-400">app.supabase.com</strong> and create a free project</li>
            <li>In your project, go to <strong className="text-amber-400">Settings → API</strong> and copy your URL and anon key</li>
            <li>In your Vercel project, go to <strong className="text-amber-400">Settings → Environment Variables</strong> and add:
              <code className="block mt-1 ml-4 bg-black/30 px-2 py-1 text-amber-300 text-[10px]">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</code>
              <code className="block mt-0.5 ml-4 bg-black/30 px-2 py-1 text-amber-300 text-[10px]">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</code>
            </li>
            <li>In Supabase, create a <strong className="text-amber-400">Storage bucket</strong> named <code className="bg-black/30 px-1 text-amber-300">gallery</code> with <strong className="text-amber-400">public access enabled</strong></li>
            <li>Run this SQL in the <strong className="text-amber-400">Supabase SQL Editor</strong>:
              <pre className="mt-1 ml-4 bg-black/30 px-3 py-2 text-amber-300 text-[10px] overflow-x-auto whitespace-pre">{`create table if not exists gallery_images (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,
  public_url    text not null,
  filename      text not null,
  title         text not null default '',
  categories    text[] not null default '{}',
  framing       jsonb,
  display_order bigint not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table gallery_images enable row level security;
create policy "Public read" on gallery_images for select using (true);
create policy "Anon insert" on gallery_images for insert with check (true);
create policy "Anon update" on gallery_images for update using (true);
create policy "Anon delete" on gallery_images for delete using (true);`}</pre>
            </li>
            <li>Redeploy your Vercel project</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Migration panel component
// ─────────────────────────────────────────────────────────────────────────────

type MigrationPhase = 'idle' | 'scanning' | 'preview' | 'running' | 'done' | 'empty';

function MigrationPanel({ onMigrated }: { onMigrated: (items: GalleryItem[]) => void }) {
  const [phase,   setPhase]   = useState<MigrationPhase>('idle');
  const [scan,    setScan]    = useState<ScanResult | null>(null);
  const [migItems, setMigItems] = useState<MigrationItem[]>([]);
  const [cleared,  setCleared] = useState(false);

  const updateItem = (localId: string, patch: Partial<MigrationItem>) =>
    setMigItems((prev) =>
      prev.map((m) => m.localId === localId ? { ...m, ...patch } : m),
    );

  const handleScan = async () => {
    setPhase('scanning');
    const result = await scanLocalGallery();
    setScan(result);
    if (result.items.length === 0) {
      setPhase('empty');
    } else {
      setMigItems(result.items);
      setPhase('preview');
    }
  };

  const handleMigrateAll = async () => {
    if (!scan) return;
    setPhase('running');
    const newItems: GalleryItem[] = [];
    for (const item of migItems) {
      if (item.status === 'done') continue;
      await migrateOne(item, scan._blobs, (patch) => {
        updateItem(item.localId, patch);
        if (patch.supabaseItem) newItems.push(patch.supabaseItem);
      });
    }
    if (newItems.length > 0) onMigrated(newItems);
    setPhase('done');
  };

  const handleClearLocal = async () => {
    if (!confirm('Clear all old local storage data? This removes the local copies but your Supabase images are already safe.')) return;
    await clearLegacyLocalStorage();
    await clearLegacyIndexedDB();
    setCleared(true);
  };

  const done    = migItems.filter((m) => m.status === 'done').length;
  const errors  = migItems.filter((m) => m.status === 'error').length;
  const pending = migItems.filter((m) => m.status === 'pending' || m.status === 'uploading').length;

  return (
    <div className="mb-8 border border-jgt-border/50 bg-jgt-surface/30">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-jgt-border/30">
        <div className="flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A056" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="font-sans text-sm font-semibold text-jgt-text">Migrate Local Gallery to Supabase</span>
        </div>
        {phase === 'idle' && (
          <button
            onClick={handleScan}
            className="btn-outline text-xs px-4 py-2 flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Scan Local Storage
          </button>
        )}
      </div>

      <div className="px-5 py-4">
        {/* Idle state */}
        {phase === 'idle' && (
          <p className="font-sans text-jgt-muted text-xs leading-relaxed">
            If you had gallery images before Supabase was connected, they&apos;re still stored locally in your
            browser (localStorage or IndexedDB). Click <strong className="text-jgt-text">Scan Local Storage</strong> to
            find them and migrate them into Supabase so they&apos;re permanently saved and visible on all devices.
          </p>
        )}

        {/* Scanning */}
        {phase === 'scanning' && (
          <div className="flex items-center gap-2 text-jgt-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-jgt-gold animate-pulse" />
            <span className="font-sans text-xs">Scanning localStorage and IndexedDB…</span>
          </div>
        )}

        {/* Nothing found */}
        {phase === 'empty' && (
          <div className="flex items-center gap-2 text-jgt-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="font-sans text-xs">No local gallery images found. Nothing to migrate.</span>
          </div>
        )}

        {/* Preview + controls */}
        {(phase === 'preview' || phase === 'running' || phase === 'done') && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-sans text-xs text-jgt-muted">
                Found <strong className="text-jgt-text">{migItems.length}</strong> local image{migItems.length !== 1 ? 's' : ''}
                {scan?.hasLocalStorage && ' (localStorage)'}
                {scan?.hasLocalStorage && scan?.hasIndexedDB && ' + '}
                {scan?.hasIndexedDB && ' (IndexedDB)'}
              </span>
              {phase === 'preview' && (
                <button onClick={handleMigrateAll} className="btn-gold text-xs px-5 py-2 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload All to Supabase
                </button>
              )}
              {phase === 'running' && (
                <span className="flex items-center gap-1.5 font-sans text-xs text-jgt-gold">
                  <span className="inline-block w-2 h-2 rounded-full bg-jgt-gold animate-pulse" />
                  Uploading… ({done}/{migItems.length} done{errors > 0 ? `, ${errors} failed` : ''})
                </span>
              )}
              {phase === 'done' && (
                <span className="flex items-center gap-1.5 font-sans text-xs text-emerald-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Migration complete — {done} uploaded{errors > 0 ? `, ${errors} failed` : ''}
                </span>
              )}
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {migItems.map((m) => (
                <div key={m.localId} className="relative group">
                  <div className="aspect-video overflow-hidden bg-jgt-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.previewUrl}
                      alt={m.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Status overlay */}
                    {m.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-jgt-gold animate-pulse" />
                      </div>
                    )}
                    {m.status === 'done' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                    {m.status === 'error' && (
                      <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      </div>
                    )}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-sans text-[9px] text-jgt-text truncate">{m.title}</p>
                    {m.status === 'error' && m.error && (
                      <p className="font-sans text-[8px] text-red-400 truncate">{m.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Clear local data (shown after done) */}
            {phase === 'done' && !cleared && pending === 0 && (
              <div className="pt-2 border-t border-jgt-border/30">
                <p className="font-sans text-jgt-muted text-xs mb-2">
                  Your images are now in Supabase. You can optionally clear the old local browser storage to free up space.
                </p>
                <button
                  onClick={handleClearLocal}
                  className="btn-outline text-xs px-4 py-2 text-red-400 border-red-400/30 hover:border-red-400/60"
                >
                  Clear Old Local Storage
                </button>
              </div>
            )}
            {cleared && (
              <p className="font-sans text-xs text-emerald-400 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Local storage cleared.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminGalleryPage() {
  const [items,     setItems]     = useState<GalleryItem[]>([]);
  // rawRows keeps the full Supabase row data so we can pass it to delete/replace
  const [rawRows,   setRawRows]   = useState<Map<string, GalleryRow>>(new Map());
  const [queue,     setQueue]     = useState<QueueItem[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabaseReady = isSupabaseConfigured();

  // Load gallery from Supabase on mount
  useEffect(() => {
    loadGallery().then((loaded) => {
      setItems(loaded);
      setLoading(false);
    });
  }, []);

  // Handle file selection
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
            categories: [],
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

  const onDragOver  = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const updateQueue = (id: string, patch: Partial<QueueItem>) =>
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, ...patch } : q));

  // Upload a single queue item to Supabase
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
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  // Delete an image from Supabase
  const deleteImage = async (img: GalleryItem) => {
    if (!confirm(`Delete "${img.title}"? This cannot be undone.`)) return;
    const row = rawRows.get(img.id);
    if (row) {
      await deleteGalleryImage(img.id, row);
    } else {
      // Fallback: fetch fresh list to get row data
      await deleteGalleryImage(img.id, { id: img.id } as GalleryRow);
    }
    setItems((prev) => prev.filter((i) => i.id !== img.id));
    setRawRows((prev) => { const m = new Map(prev); m.delete(img.id); return m; });
  };

  const openEdit = (img: GalleryItem) => {
    setEditState({ img, title: img.title, categories: [...img.categories] });
  };

  const saveEdit = async () => {
    if (!editState) return;
    setSavingEdit(true);
    await updateGalleryMeta(editState.img.id, {
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
    setSavingEdit(false);
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

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

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

        {/* Supabase config check */}
        {!supabaseReady && <SetupInstructions />}

        {/* Storage info banner (when configured) */}
        {supabaseReady && (
          <div className="mb-8 p-5 border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <p className="font-sans text-emerald-400 text-sm font-semibold mb-1">Supabase Connected</p>
                <p className="font-sans text-emerald-400/70 text-xs leading-relaxed">
                  Images upload to Supabase Storage and are instantly visible on all devices — phones, computers, and visitors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Migration tool — only shown when Supabase is ready */}
        {supabaseReady && (
          <MigrationPanel
            onMigrated={(newItems) =>
              setItems((prev) => [...newItems, ...prev])
            }
          />
        )}

        {/* Page title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-jgt-text mb-2">Gallery Manager</h1>
          <p className="font-sans text-jgt-muted text-sm">
            Upload photos to add them to the public gallery. Images are compressed to 1600×1600px and saved to shared storage —
            visible on every device. Choose categories manually, including whether each image appears in{' '}
            <strong className="text-jgt-text">All Projects</strong>.
          </p>
        </div>

        {/* ── UPLOAD ZONE ──────────────────────────────── */}
        <div
          className={`drop-zone border-2 border-dashed border-jgt-border rounded-none p-12 text-center cursor-pointer transition-all mb-8 ${
            dragging ? 'drag-active' : 'hover:border-jgt-gold/40'
          } ${!supabaseReady ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => supabaseReady && fileInputRef.current?.click()}
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
                {supabaseReady ? 'Drop photos here or click to browse' : 'Configure Supabase to enable uploads'}
              </p>
              <p className="font-sans text-jgt-muted text-xs">
                JPG, PNG, WebP — compressed to 1600px max, saved to Supabase (public, all devices)
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

                    {/* Uploading overlay */}
                    {item.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                        <div className="w-20 h-1.5 bg-jgt-border rounded-full overflow-hidden">
                          <div className="h-full bg-jgt-gold transition-all duration-300" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="font-sans text-[10px] text-jgt-gold tracking-wider">Uploading…</span>
                      </div>
                    )}

                    {/* Done overlay */}
                    {item.status === 'done' && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="font-sans text-[10px] text-emerald-400 tracking-wider">Saved live</span>
                      </div>
                    )}

                    {/* Error overlay */}
                    {item.status === 'error' && (
                      <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeQueued(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center glass text-jgt-text hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>

                  {/* Metadata inputs */}
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateQueue(item.id, { title: e.target.value })}
                      placeholder="Image title"
                      disabled={item.status === 'uploading' || item.status === 'done'}
                      className="w-full bg-transparent border border-jgt-border px-3 py-2 font-sans text-xs text-jgt-text placeholder:text-jgt-muted/50 focus:outline-none focus:border-jgt-gold transition-colors disabled:opacity-50"
                    />

                    {/* Categories */}
                    <div className="space-y-1.5">
                      <p className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase mb-1">Categories</p>
                      {GALLERY_CATEGORIES.map((cat) => (
                        <label
                          key={cat}
                          className={`flex items-center gap-2 cursor-pointer ${
                            cat === 'All Projects' ? 'border-b border-jgt-border/30 pb-1.5 mb-1' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.categories.includes(cat)}
                            disabled={item.status === 'uploading' || item.status === 'done'}
                            onChange={(e) => {
                              const cats = e.target.checked
                                ? [...item.categories, cat]
                                : item.categories.filter((c) => c !== cat);
                              updateQueue(item.id, { categories: cats });
                            }}
                            className="w-3 h-3 accent-jgt-gold cursor-pointer"
                          />
                          <span className={`font-sans text-xs ${cat === 'All Projects' ? 'text-jgt-gold' : 'text-jgt-text'}`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Status / action */}
                    <StatusBadge status={item.status} error={item.error} />
                    {item.status === 'pending' && (
                      <button onClick={() => uploadItem(item)} className="w-full btn-gold text-xs py-2">
                        Upload
                      </button>
                    )}
                    {item.status === 'error' && (
                      <button onClick={() => uploadItem(item)} className="w-full btn-outline text-xs py-2">
                        Retry
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
              <p className="font-sans text-jgt-muted/50 text-xs mt-2">
                {supabaseReady
                  ? 'Drop photos above to get started.'
                  : 'Configure Supabase above to enable shared gallery storage.'}
              </p>
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

                  {/* Public indicator */}
                  {img.isPublic && (
                    <div className="absolute top-2 left-2">
                      <span className="font-sans text-[9px] text-emerald-400 bg-black/60 px-1.5 py-0.5 tracking-wider uppercase">
                        Live
                      </span>
                    </div>
                  )}

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
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteImage(img)}
                        className="flex items-center gap-1.5 font-sans text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 transition-colors cursor-pointer"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
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
            <strong className="text-jgt-text">Note:</strong> This admin page has no login protection in the current build.
            To secure it, add a password check or use Supabase Auth in <code>src/app/admin-gallery/page.tsx</code>.
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
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

            {/* Categories */}
            <div>
              <label className="font-sans text-[10px] text-jgt-muted tracking-wider uppercase block mb-2">Categories</label>
              <div className="space-y-1.5">
                {GALLERY_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2.5 cursor-pointer py-0.5 ${
                      cat === 'All Projects' ? 'border-b border-jgt-border/30 pb-2 mb-1' : ''
                    }`}
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
                disabled={savingEdit}
                className="flex-1 btn-outline text-xs py-2.5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="flex-1 btn-gold text-xs py-2.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingEdit ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
                    Saving…
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
