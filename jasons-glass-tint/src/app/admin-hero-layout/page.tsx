'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import {
  loadHeroConfig,
  saveHeroConfig,
  clearHeroConfig,
  DEFAULT_CONFIG,
  type HeroConfig,
} from '@/lib/heroConfig';
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
  type GalleryMeta,
  loadGallery,
  addGalleryImage,
  replaceGalleryImage,
  updateGalleryMeta,
  deleteGalleryImage,
  clearGallery,
  cleanBrokenGalleryData,
  exportGalleryMetaJSON,
  getGalleryMeta,
  processImageForGallery,
} from '@/lib/galleryStorage';
import {
  fetchSiteImages,
  uploadSiteImage,
  deleteSiteImage,
  processSiteImageFile,
  type SiteImageSlot,
  type SiteImageMap,
} from '@/lib/siteImages';
import { isSupabaseConfigured } from '@/lib/supabase';

/* ─────────────────────────────────────────────────────────────────────────────
   POSITIONING — slider config
───────────────────────────────────────────────────────────────────────────── */
const SIZE_SLIDERS: {
  key: keyof HeroConfig; label: string; min: number; max: number; step: number; unit: string;
}[] = [
  { key: 'gapSanClementeLogo',  label: 'San Clemente → Logo gap',    min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapLogoSince',        label: 'Logo → Since 1989 gap',      min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapSinceParagraph',   label: 'Since 1989 → Paragraph gap', min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapParagraphButtons', label: 'Paragraph → Buttons gap',    min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapButtonsStats',     label: 'Buttons → Stats gap',        min: 0,   max: 160, step: 1,  unit: 'px' },
  { key: 'logoWidth',           label: 'Logo max-width',             min: 100, max: 900, step: 10, unit: 'px' },
];

const Y_SLIDERS: { key: keyof HeroConfig; label: string }[] = [
  { key: 'yOffsetSanClemente', label: 'San Clemente' },
  { key: 'yOffsetLogo',        label: 'Logo'         },
  { key: 'yOffsetSince',       label: 'Since 1989'   },
  { key: 'yOffsetParagraph',   label: 'Paragraph'    },
  { key: 'yOffsetButtons',     label: 'Button Row'   },
  { key: 'yOffsetStats',       label: 'Stats Row'    },
];
const Y_MIN = -200;
const Y_MAX =  200;
const SCROLL_X_MIN = -500;
const SCROLL_X_MAX =  500;
const SCROLL_Y_MIN = -200;
const SCROLL_Y_MAX =  200;

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGES — registry (Supabase-backed slots)
───────────────────────────────────────────────────────────────────────────── */

interface ImageEntry {
  slot:     SiteImageSlot;
  label:    string;
  group:    string;
  original: string;
}

const IMAGE_REGISTRY: ImageEntry[] = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { slot: 'heroBackground', label: 'Hero Background',            group: 'Hero',     original: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80' },
  { slot: 'heroLogo',       label: 'Hero Logo',                  group: 'Hero',     original: '/images/ChatGPT%20Image%20May%207%2C%202026%2C%2009_16_16%20PM.png' },

  // ── Services ──────────────────────────────────────────────────────────────
  { slot: 'automotiveServiceImage',  label: 'Service — Automotive Tint',  group: 'Services', original: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
  { slot: 'residentialServiceImage', label: 'Service — Residential Tint', group: 'Services', original: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
  { slot: 'commercialServiceImage',  label: 'Service — Commercial Tint',  group: 'Services', original: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' },
  { slot: 'marineServiceImage',      label: 'Service — Marine Tint',      group: 'Services', original: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80' },
  { slot: 'frostServiceImage',       label: 'Service — Frost Film',       group: 'Services', original: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { slot: 'safetyServiceImage',      label: 'Service — Safety Film',      group: 'Services', original: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },

  // ── About ─────────────────────────────────────────────────────────────────
  { slot: 'aboutPortrait', label: 'About — Jason Portrait', group: 'About', original: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80' },

  // ── CTA ───────────────────────────────────────────────────────────────────
  { slot: 'ctaBackground', label: 'CTA Section Background', group: 'CTA', original: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80' },

  // ── Page Heroes ───────────────────────────────────────────────────────────
  { slot: 'automotivePageHero',  label: 'Page Hero — Automotive',          group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80' },
  { slot: 'residentialPageHero', label: 'Page Hero — Residential',         group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80' },
  { slot: 'commercialPageHero',  label: 'Page Hero — Commercial',          group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80' },
  { slot: 'marinePageHero',      label: 'Page Hero — Marine',              group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1400&q=80' },
  { slot: 'sanClementePageHero', label: 'Page Hero — San Clemente',        group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80' },
  { slot: 'sanJuanPageHero',     label: 'Page Hero — San Juan Capistrano', group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80' },
  { slot: 'talegaPageHero',      label: 'Page Hero — Talega',              group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80' },
  { slot: 'danaPointPageHero',   label: 'Page Hero — Dana Point',          group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80' },
  { slot: 'frostPageHero',        label: 'Page Hero — Frost Film',          group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80' },
  { slot: 'safetyPageHero',       label: 'Page Hero — Safety Film',         group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80' },
  { slot: 'laderaRanchPageHero',  label: 'Page Hero — Ladera Ranch',        group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80' },
  { slot: 'campPendletonPageHero',label: 'Page Hero — Camp Pendleton',      group: 'Page Heroes', original: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80' },
];

const IMAGE_GROUPS = Array.from(new Set(IMAGE_REGISTRY.map((e) => e.group)));

/** Upload status for each slot */
type SlotUploadStatus = 'idle' | 'uploading' | 'saved' | 'error';
interface SlotStatus {
  status: SlotUploadStatus;
  error?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR NAV
───────────────────────────────────────────────────────────────────────────── */
type Tab = 'positioning' | 'images' | 'gallery';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'positioning',
    label: 'Positioning',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3H3v2M3 8v3M3 16v3h2M8 21h3M16 21h3v-2M21 16v-3M21 8V5h-2M16 3h-3M8 3H5"/>
        <rect x="8" y="8" width="8" height="8" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'images',
    label: 'Images',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminHeroLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('positioning');

  /* ── Positioning state ── */
  const [cfg, setCfg]             = useState<HeroConfig>(DEFAULT_CONFIG);
  const [layoutSaved, setLayoutSaved] = useState(false);

  /* ── Images state (Supabase) ── */
  const [siteImageUrls, setSiteImageUrls] = useState<SiteImageMap>({});
  const [slotStatuses, setSlotStatuses]   = useState<Record<string, SlotStatus>>({});
  const supabaseReady = isSupabaseConfigured();

  /* ── Gallery state ── */
  const [galleryItems,  setGalleryItems]  = useState<GalleryItem[]>([]);
  const [gallerySaved,  setGallerySaved]  = useState(false);
  const [galleryError,  setGalleryError]  = useState<string | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const galleryObjectUrls = useRef<string[]>([]);

  /* ── Load on mount ── */
  useEffect(() => {
    try { setCfg(loadHeroConfig()); } catch { /* fall back to DEFAULT_CONFIG */ }
    // Load site images from Supabase
    fetchSiteImages().then(({ urls }) => setSiteImageUrls(urls)).catch(() => {});
    // Load gallery from Supabase
    setGalleryLoading(true);
    loadGallery().then((items) => {
      galleryObjectUrls.current = items.map((i) => i.objectUrl);
      setGalleryItems(items);
    }).catch(() => {
      setGalleryError('Failed to load gallery.');
    }).finally(() => setGalleryLoading(false));
  }, []);

  /* Revoke object URLs when component unmounts */
  useEffect(() => {
    return () => {
      galleryObjectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  /* ── Positioning handlers ── */
  const update = useCallback((key: keyof HeroConfig, value: number) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setLayoutSaved(false);
  }, []);

  const handleSaveLayout = () => {
    try { saveHeroConfig(cfg); } catch { /* ignore */ }
    setLayoutSaved(true);
    setTimeout(() => setLayoutSaved(false), 2500);
  };

  const handleResetLayout = () => {
    clearHeroConfig();
    setCfg(DEFAULT_CONFIG);
    setLayoutSaved(false);
  };

  /* ── Site image handlers (Supabase) ── */
  const setSlotStatus = useCallback((slot: string, s: SlotStatus) => {
    setSlotStatuses((prev) => ({ ...prev, [slot]: s }));
  }, []);

  const handleReplaceImage = useCallback(
    async (slot: SiteImageSlot, file: File) => {
      setSlotStatus(slot, { status: 'uploading' });
      try {
        const blob   = await processSiteImageFile(file);
        const result = await uploadSiteImage(slot, blob);
        if (result.ok && result.publicUrl) {
          setSiteImageUrls((prev) => ({ ...prev, [slot]: result.publicUrl! }));
          setSlotStatus(slot, { status: 'saved' });
          setTimeout(() => setSlotStatus(slot, { status: 'idle' }), 3000);
        } else {
          setSlotStatus(slot, { status: 'error', error: result.error ?? 'Upload failed.' });
        }
      } catch (err: unknown) {
        setSlotStatus(slot, { status: 'error', error: err instanceof Error ? err.message : 'Upload failed.' });
      }
    },
    [setSlotStatus],
  );

  const handleResetImage = useCallback(async (slot: SiteImageSlot) => {
    setSlotStatus(slot, { status: 'uploading' });
    await deleteSiteImage(slot);
    setSiteImageUrls((prev) => { const n = { ...prev }; delete n[slot]; return n; });
    setSlotStatus(slot, { status: 'idle' });
  }, [setSlotStatus]);

  const handleResetAllImages = async () => {
    if (!confirm('Reset ALL site images to defaults? This removes them from Supabase.')) return;
    await Promise.all(IMAGE_REGISTRY.map((e) => deleteSiteImage(e.slot)));
    setSiteImageUrls({});
    setSlotStatuses({});
  };

  /* Images tab: Supabase-backed, auto-saves on upload (no explicit save button needed) */
  const imgSaved = Object.values(slotStatuses).some((s) => s.status === 'saved');

  /* ── Gallery: show save toast helper ── */
  const showGallerySaved = useCallback(() => {
    setGalleryError(null);
    setGallerySaved(true);
    setTimeout(() => setGallerySaved(false), 2500);
  }, []);

  /* ── Gallery: add image ── */
  const handleGalleryAdd = useCallback(async (blob: Blob, title: string, categories: GalleryCategory[]) => {
    const result = await addGalleryImage(blob, title, categories);
    if (!result.ok || !result.item) {
      setGalleryError(result.error ?? 'Failed to save image.');
      return;
    }
    galleryObjectUrls.current.push(result.item.objectUrl);
    setGalleryItems((prev) => [result.item!, ...prev]);
    showGallerySaved();
  }, [showGallerySaved]);

  /* ── Gallery: replace image blob ── */
  const handleGalleryReplace = useCallback(async (id: string, blob: Blob) => {
    const result = await replaceGalleryImage(id, blob);
    if (!result.ok || !result.objectUrl) {
      setGalleryError(result.error ?? 'Failed to replace image.');
      return null;
    }
    // Revoke old object URL for this id
    setGalleryItems((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        URL.revokeObjectURL(img.objectUrl);
        return { ...img, objectUrl: result.objectUrl!, updatedAt: Date.now() };
      }),
    );
    showGallerySaved();
    return result.objectUrl;
  }, [showGallerySaved]);

  /* ── Gallery: update metadata only ── */
  const handleGalleryMeta = useCallback((id: string, patch: Partial<Pick<GalleryMeta, 'title' | 'categories'>>) => {
    updateGalleryMeta(id, patch);
    setGalleryItems((prev) =>
      prev.map((img) => {
        if (img.id !== id) return img;
        const cats = patch.categories ?? img.categories;
        return { ...img, title: patch.title ?? img.title, categories: cats, updatedAt: Date.now() };
      }),
    );
    showGallerySaved();
  }, [showGallerySaved]);

  /* ── Gallery: delete image ── */
  const handleGalleryDelete = useCallback(async (id: string) => {
    await deleteGalleryImage(id);
    setGalleryItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.objectUrl);
      return prev.filter((i) => i.id !== id);
    });
    showGallerySaved();
  }, [showGallerySaved]);

  /* ── Gallery: reset all ── */
  const handleResetGallery = useCallback(async () => {
    if (!window.confirm('Reset gallery? This will permanently delete ALL gallery images from this browser.')) return;
    await clearGallery();
    galleryObjectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    galleryObjectUrls.current = [];
    setGalleryItems([]);
    setGalleryError(null);
  }, []);

  /* ── Gallery: clean broken data ── */
  const handleCleanBroken = useCallback(async () => {
    const removed = await cleanBrokenGalleryData();
    if (removed > 0) {
      // Reload after cleanup
      const items = await loadGallery();
      setGalleryItems(items);
    }
    alert(removed > 0 ? `Removed ${removed} broken entr${removed === 1 ? 'y' : 'ies'}.` : 'No broken entries found.');
  }, []);

  /* ── Unified save button ── */
  const handleSave = () => {
    if (activeTab === 'positioning') handleSaveLayout();
    // Images and Gallery auto-save to Supabase on upload
    else showGallerySaved();
  };

  const isSaved =
    activeTab === 'positioning' ? layoutSaved :
    activeTab === 'images'      ? imgSaved :
    gallerySaved;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" style={{ fontFamily: 'sans-serif' }}>

      {/* ════════════════════ TOP BAR ════════════════════ */}
      <header
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10"
        style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest uppercase text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
            Admin
          </span>
          <span className="text-sm text-white/70">Site Editor</span>
          <span className="text-white/20">·</span>
          <span className="text-[11px] tracking-widest uppercase text-white/40">
            {activeTab === 'positioning' ? 'Positioning' : activeTab === 'images' ? 'Images' : 'Gallery'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="text-[11px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors px-3 py-2"
          >
            ↗ View Homepage
          </a>
          {activeTab === 'positioning' && (
            <button
              onClick={handleResetLayout}
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
            >
              Reset to Default
            </button>
          )}
          {activeTab === 'images' && (
            <button
              onClick={handleResetAllImages}
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
            >
              Reset All Images
            </button>
          )}
          {activeTab === 'gallery' && (
            <a
              href="/"
              target="_blank"
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/15 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors rounded"
            >
              ↗ Preview Public Gallery
            </a>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[11px] tracking-widest uppercase rounded font-semibold transition-all"
            style={{ background: isSaved ? '#22c55e' : '#C5A056', color: '#0a0a0a' }}
          >
            {isSaved
              ? '✓ Saved Live'
              : activeTab === 'positioning'
                ? 'Save Layout'
                : activeTab === 'images'
                ? 'Saves on Upload'
                : 'Gallery Auto-Saves'}
          </button>
        </div>
      </header>

      {/* ════════════════════ INFO BANNER ════════════════════ */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2">
        <p className="text-[11px] text-white/40">
          {activeTab === 'positioning'
            ? '💾 Layout positioning is saved to this browser only (localStorage).'
            : activeTab === 'images'
            ? '☁️ Images save to Supabase Storage — visible on ALL devices after upload. Click ↑ Save Image Live on any slot.'
            : '☁️ Gallery images are stored in Supabase and visible on all devices.'}
        </p>
      </div>

      {/* ════════════════════ BODY ════════════════════ */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left sidebar nav ── */}
        <nav
          className="w-16 lg:w-52 flex-shrink-0 flex flex-col border-r border-white/10 pt-4"
          style={{ background: '#0d0d0d' }}
        >
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex items-center gap-3 px-4 py-3 mx-2 mb-1 rounded transition-all text-left"
                style={{
                  background:  active ? 'rgba(197,160,86,0.12)' : 'transparent',
                  color:       active ? '#C5A056' : 'rgba(255,255,255,0.45)',
                  borderLeft:  active ? '2px solid #C5A056' : '2px solid transparent',
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="hidden lg:inline text-[12px] tracking-[0.12em] uppercase font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="mt-auto pb-4 px-4 hidden lg:block">
            <div className="border-t border-white/10 pt-4">
              <p className="text-[9px] tracking-widest uppercase text-white/20">Jason&apos;s Glass Tint</p>
              <p className="text-[9px] text-white/15 mt-0.5">Site Editor v2</p>
            </div>
          </div>
        </nav>

        {/* ── Main content ── */}
        <div className="flex flex-1 min-h-0 min-w-0">

          {/* ── Controls panel (scrollable) ── */}
          <div
            className="w-80 xl:w-96 flex-shrink-0 overflow-y-auto border-r border-white/10"
            style={{ background: '#111', display: activeTab === 'gallery' ? 'none' : 'block' }}
          >
            {activeTab === 'positioning' ? (
              <PositioningPanel cfg={cfg} update={update} />
            ) : (
              <ImagesPanel
                siteImageUrls={siteImageUrls}
                slotStatuses={slotStatuses}
                supabaseReady={supabaseReady}
                onReplace={handleReplaceImage}
                onReset={handleResetImage}
              />
            )}
          </div>

          {/* ── Gallery full-width panel ── */}
          {activeTab === 'gallery' && (
            <div className="flex-1 overflow-y-auto" style={{ background: '#0e0e0e' }}>
              <GalleryPanel
                items={galleryItems}
                loading={galleryLoading}
                storageError={galleryError}
                onAdd={handleGalleryAdd}
                onReplace={handleGalleryReplace}
                onMeta={handleGalleryMeta}
                onDelete={handleGalleryDelete}
                onReset={handleResetGallery}
                onCleanBroken={handleCleanBroken}
              />
            </div>
          )}

          {/* ── Live preview (hidden on gallery tab) ── */}
          {activeTab !== 'gallery' && (
            <div className="flex-1 relative" style={{ minHeight: '600px' }}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">Live Preview</span>
              </div>
              <div className="w-full h-full overflow-hidden">
                <HeroSection config={cfg} imageOverrides={{
                  'hero-bg':   siteImageUrls['heroBackground'] ?? '',
                  'hero-logo': siteImageUrls['heroLogo']       ?? '',
                }} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   POSITIONING PANEL
───────────────────────────────────────────────────────────────────────────── */
function PositioningPanel({
  cfg,
  update,
}: {
  cfg: HeroConfig;
  update: (key: keyof HeroConfig, value: number) => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-white/10">
        <SectionHeader title="Scale / Size" sub="gap & logo width" />
        <div className="space-y-6">
          {SIZE_SLIDERS.map(({ key, label, min, max, step, unit }) => (
            <div key={key}>
              <SliderLabel label={label} value={`${cfg[key]}${unit}`} color="#C5A056" />
              <input
                type="range" min={min} max={max} step={step} value={cfg[key]}
                onChange={(e) => update(key, Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: '#C5A056', height: '6px' }}
              />
              <SliderMinMax left={`${min}${unit}`} right={`${max}${unit}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-b border-white/10">
        <SectionHeader title="Move Up / Down" sub="Y position only" />
        <p className="text-[10px] text-white/25 mb-5 leading-relaxed">
          Shifts each element independently. Does not affect spacing or other elements.
        </p>
        <div className="space-y-6">
          {Y_SLIDERS.map(({ key, label }) => {
            const val = cfg[key] as number;
            const color = val === 0 ? 'rgba(255,255,255,0.3)' : val < 0 ? '#60a5fa' : '#f87171';
            return (
              <div key={key}>
                <SliderLabel label={label} value={`${val > 0 ? '+' : ''}${val}px`} color={color} />
                <input
                  type="range" min={Y_MIN} max={Y_MAX} step={1} value={val}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: val === 0 ? '#555' : val < 0 ? '#60a5fa' : '#f87171', height: '6px' }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-blue-400/40">↑ {Math.abs(Y_MIN)}px up</span>
                  <span className="text-[10px] text-white/20">0</span>
                  <span className="text-[10px] text-red-400/40">{Y_MAX}px down ↓</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <SectionHeader title="Scroll Indicator" sub="X / Y position" />
        <p className="text-[10px] text-white/25 mb-5 leading-relaxed">
          Moves the SCROLL indicator left/right and up/down independently.
        </p>
        <div className="space-y-6">
          {(() => {
            const val = cfg.scrollIndicatorX;
            const color = val === 0 ? 'rgba(255,255,255,0.3)' : val < 0 ? '#a78bfa' : '#34d399';
            return (
              <div>
                <SliderLabel label="Scroll X (left / right)" value={`${val > 0 ? '+' : ''}${val}px`} color={color} />
                <input
                  type="range" min={SCROLL_X_MIN} max={SCROLL_X_MAX} step={1} value={val}
                  onChange={(e) => update('scrollIndicatorX', Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: val === 0 ? '#555' : val < 0 ? '#a78bfa' : '#34d399', height: '6px' }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-purple-400/40">← {Math.abs(SCROLL_X_MIN)}px left</span>
                  <span className="text-[10px] text-white/20">0</span>
                  <span className="text-[10px] text-emerald-400/40">{SCROLL_X_MAX}px right →</span>
                </div>
              </div>
            );
          })()}
          {(() => {
            const val = cfg.scrollIndicatorY;
            const color = val === 0 ? 'rgba(255,255,255,0.3)' : val < 0 ? '#60a5fa' : '#f87171';
            return (
              <div>
                <SliderLabel label="Scroll Y (up / down)" value={`${val > 0 ? '+' : ''}${val}px`} color={color} />
                <input
                  type="range" min={SCROLL_Y_MIN} max={SCROLL_Y_MAX} step={1} value={val}
                  onChange={(e) => update('scrollIndicatorY', Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: val === 0 ? '#555' : val < 0 ? '#60a5fa' : '#f87171', height: '6px' }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-blue-400/40">↑ {Math.abs(SCROLL_Y_MIN)}px up</span>
                  <span className="text-[10px] text-white/20">0</span>
                  <span className="text-[10px] text-red-400/40">{SCROLL_Y_MAX}px down ↓</span>
                </div>
              </div>
            );
          })()}
        </div>
        <div className="mt-8 p-3 border border-yellow-400/20 rounded bg-yellow-400/5">
          <p className="text-[10px] text-yellow-400/70 leading-relaxed">
            Adjust sliders — the preview updates instantly.
            Hit <strong>Save to This Browser</strong> to persist.
          </p>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGES PANEL
───────────────────────────────────────────────────────────────────────────── */
function ImagesPanel({
  siteImageUrls,
  slotStatuses,
  supabaseReady,
  onReplace,
  onReset,
}: {
  siteImageUrls: SiteImageMap;
  slotStatuses:  Record<string, SlotStatus>;
  supabaseReady: boolean;
  onReplace: (slot: SiteImageSlot, file: File) => Promise<void>;
  onReset:   (slot: SiteImageSlot) => Promise<void>;
}) {
  const groups = Array.from(new Set(IMAGE_REGISTRY.map((e) => e.group)));
  return (
    <div className="p-5 space-y-8">
      {/* Banner */}
      {!supabaseReady ? (
        <div className="p-3 border border-amber-500/40 rounded bg-amber-500/5">
          <p className="text-[10px] text-amber-400 leading-relaxed font-semibold mb-1">⚠ Supabase Not Configured</p>
          <p className="text-[10px] text-amber-400/70 leading-relaxed">
            Images cannot be saved until Supabase environment variables are set and the site is redeployed.
          </p>
        </div>
      ) : (
        <div className="p-3 border border-emerald-500/30 rounded bg-emerald-500/5">
          <p className="text-[10px] text-emerald-400 leading-relaxed">
            ✅ Images upload to Supabase Storage — permanently visible on all devices after upload.
            <br />Supports JPG, PNG, WebP. Large images are automatically compressed.
          </p>
        </div>
      )}

      {groups.map((group) => (
        <div key={group}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium">{group}</span>
            <div className="flex-1 h-[1px] bg-white/8" />
          </div>
          <div className="space-y-4">
            {IMAGE_REGISTRY.filter((e) => e.group === group).map((entry) => (
              <ImageCard
                key={entry.slot}
                entry={entry}
                currentUrl={siteImageUrls[entry.slot]}
                slotStatus={slotStatuses[entry.slot] ?? { status: 'idle' }}
                supabaseReady={supabaseReady}
                onReplace={onReplace}
                onReset={onReset}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Coverage Check */}
      <div className="border border-jgt-border rounded p-4">
        <h3 className="font-sans text-xs tracking-[0.16em] uppercase text-jgt-gold mb-1">Coverage Check</h3>
        <p className="font-sans text-jgt-muted text-[10px] mb-3">Green ✓ = custom image saved · Gold ○ = showing default stock image</p>
        <div className="space-y-1">
          {IMAGE_REGISTRY.map((entry) => {
            const hasOverride = !!siteImageUrls[entry.slot];
            return (
              <div key={entry.slot} className="flex items-center gap-2 font-sans text-[11px]">
                <span className={hasOverride ? 'text-green-400' : 'text-jgt-gold'}>
                  {hasOverride ? '✓' : '○'}
                </span>
                <span className={hasOverride ? 'text-jgt-text' : 'text-jgt-muted'}>{entry.label}</span>
                {!hasOverride && <span className="text-jgt-muted/40 ml-auto text-[10px]">default</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-8" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CARD — Supabase upload pipeline
───────────────────────────────────────────────────────────────────────────── */
function ImageCard({
  entry,
  currentUrl,
  slotStatus,
  supabaseReady,
  onReplace,
  onReset,
}: {
  entry:         ImageEntry;
  currentUrl?:   string;
  slotStatus:    SlotStatus;
  supabaseReady: boolean;
  onReplace: (slot: SiteImageSlot, file: File) => Promise<void>;
  onReset:   (slot: SiteImageSlot) => Promise<void>;
}) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const isCustom = !!currentUrl;
  const displaySrc = currentUrl ?? entry.original;
  const busy = slotStatus.status === 'uploading';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await onReplace(entry.slot, file);
  };

  return (
    <div
      className="rounded overflow-hidden border transition-colors"
      style={{ borderColor: isCustom ? 'rgba(197,160,86,0.4)' : 'rgba(255,255,255,0.08)', background: '#0e0e0e' }}
    >
      {/* Thumbnail */}
      <div className="relative w-full bg-black/30" style={{ aspectRatio: '16/7' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={entry.label}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
        />
        {/* Status overlay */}
        {slotStatus.status === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70">
            <div className="w-5 h-5 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" />
            <span className="text-[11px] tracking-widest uppercase text-yellow-400 animate-pulse">Uploading…</span>
          </div>
        )}
        {slotStatus.status === 'saved' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[11px] tracking-widest uppercase text-emerald-400">Saved live</span>
          </div>
        )}
        {isCustom && slotStatus.status === 'idle' && (
          <div className="absolute top-2 right-2 bg-yellow-400/90 text-black text-[9px] tracking-widest uppercase px-2 py-0.5 rounded font-semibold">
            Supabase
          </div>
        )}
      </div>

      {/* Error message */}
      {slotStatus.status === 'error' && (
        <div className="mx-3 mt-3 px-3 py-2 rounded border border-red-500/40 bg-red-500/10">
          <p className="text-[11px] text-red-400 leading-snug font-semibold mb-0.5">⚠ Save failed</p>
          <p className="text-[11px] text-red-400/80 leading-snug">{slotStatus.error ?? 'Upload failed.'}</p>
        </div>
      )}

      <div className="px-3 py-3">
        <div className="mb-2">
          <p className="text-[12px] text-white/80 font-medium leading-tight">{entry.label}</p>
          <p
            className="text-[10px] font-mono mt-0.5 truncate"
            style={{ color: isCustom ? '#C5A056' : 'rgba(255,255,255,0.25)' }}
            title={isCustom ? currentUrl : entry.original}
          >
            {isCustom
              ? 'supabase.co • public URL active'
              : entry.original
                  .replace('https://images.unsplash.com/', 'unsplash/')
                  .replace('/images/', '/')}
          </p>
        </div>

        {/* Status message row */}
        {slotStatus.status === 'uploading' && (
          <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Uploading…
          </div>
        )}
        {slotStatus.status === 'saved' && (
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mb-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Saved live
          </div>
        )}
        {slotStatus.status === 'error' && (
          <div className="flex items-center gap-1.5 text-[10px] text-red-400 mb-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {(slotStatus.error ?? '').includes('site_images') ? 'Table setup needed — see error above' : 'Save failed — see error above'}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => { if (!busy && supabaseReady) fileRef.current?.click(); }}
            disabled={busy || !supabaseReady}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase rounded transition-all border font-medium"
            style={{
              background:  (busy || !supabaseReady) ? 'rgba(197,160,86,0.3)' : '#C5A056',
              color:       (busy || !supabaseReady) ? 'rgba(0,0,0,0.4)'       : '#0a0a0a',
              borderColor: (busy || !supabaseReady) ? 'rgba(197,160,86,0.3)' : '#C5A056',
              cursor:      (busy || !supabaseReady) ? 'not-allowed'           : 'pointer',
            }}
          >
            {busy ? 'Uploading…' : '↑ Save Image Live'}
          </button>
          {isCustom && !busy && (
            <button
              onClick={() => onReset(entry.slot)}
              className="py-2 px-3 text-[10px] tracking-widest uppercase rounded transition-all border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              Reset
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY PANEL — Supabase-backed gallery management
───────────────────────────────────────────────────────────────────────────── */
function GalleryPanel({
  items,
  loading,
  storageError,
  onAdd,
  onReplace,
  onMeta,
  onDelete,
  onReset,
  onCleanBroken,
}: {
  items:        GalleryItem[];
  loading:      boolean;
  storageError: string | null;
  onAdd:        (blob: Blob, title: string, categories: GalleryCategory[]) => Promise<void>;
  onReplace:    (id: string, blob: Blob) => Promise<string | null>;
  onMeta:       (id: string, patch: Partial<Pick<GalleryMeta, 'title' | 'categories'>>) => void;
  onDelete:     (id: string) => Promise<void>;
  onReset:      () => Promise<void>;
  onCleanBroken:() => Promise<void>;
}) {
  const fileRef   = useRef<HTMLInputElement>(null);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedToast,  setSavedToast]  = useState(false);

  const triggerSavedToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  /* ── Upload new image to Supabase ── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const blob  = await processImageForGallery(file);
      const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      await onAdd(blob, title, []);
      triggerSavedToast();
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error
          ? err.message
          : 'Gallery storage is full. Delete older images or use smaller files.',
      );
    } finally {
      setUploading(false);
    }
  };

  /* ── Export metadata JSON ── */
  const handleExport = () => {
    const metas  = getGalleryMeta();
    const json   = exportGalleryMetaJSON(metas);
    const blob   = new Blob([json], { type: 'application/json' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = `jgt-gallery-meta-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h2 className="text-lg font-semibold tracking-wide text-white/90">Project Gallery</h2>
          <span className="text-[10px] tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {loading ? '…' : `${items.length} image${items.length !== 1 ? 's' : ''}`}
          </span>
          {savedToast && (
            <span className="text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-0.5 rounded-full">
              ✓ Gallery saved to this browser.
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/35">
          Images upload to Supabase Storage — visible on all devices instantly after upload.
          Choose categories manually — including whether each image appears in &quot;All Projects&quot;.
        </p>
      </div>

      {/* ── Storage error ── */}
      {storageError && (
        <div className="mb-5 px-4 py-3 rounded-lg border border-red-500/50 bg-red-500/10">
          <p className="text-[12px] text-red-400 leading-relaxed">⚠ {storageError}</p>
        </div>
      )}

      {/* ── Action toolbar ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {/* Add image */}
        <button
          onClick={() => { if (!uploading) { setUploadError(null); fileRef.current?.click(); } }}
          disabled={uploading || loading}
          className="flex items-center gap-2 px-4 py-2 rounded border text-[11px] tracking-widest uppercase font-medium transition-all"
          style={{
            background:  (uploading || loading) ? 'rgba(197,160,86,0.3)' : '#C5A056',
            color:       (uploading || loading) ? 'rgba(0,0,0,0.4)' : '#0a0a0a',
            borderColor: (uploading || loading) ? 'rgba(197,160,86,0.3)' : '#C5A056',
            cursor:      (uploading || loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading
            ? <><div className="w-3.5 h-3.5 border border-black/30 border-t-black rounded-full animate-spin" /> Processing…</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Add Image</>}
        </button>
        <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />

        {/* Export metadata */}
        <button
          onClick={handleExport}
          disabled={items.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded border text-[11px] tracking-widest uppercase transition-all"
          style={{
            borderColor: items.length === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
            color:       items.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
            cursor:      items.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8" transform="rotate(180 12 10)"/></svg>
          Export Metadata
        </button>

        {/* Clean broken */}
        <button
          onClick={onCleanBroken}
          className="flex items-center gap-2 px-4 py-2 rounded border text-[11px] tracking-widest uppercase transition-all"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          Clear Broken Data
        </button>

        {/* Reset gallery */}
        <button
          onClick={onReset}
          disabled={items.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded border text-[11px] tracking-widest uppercase transition-all ml-auto"
          style={{
            borderColor: items.length === 0 ? 'rgba(220,38,38,0.15)' : 'rgba(220,38,38,0.4)',
            color:       items.length === 0 ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.85)',
            cursor:      items.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Reset Gallery
        </button>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="mb-5 px-4 py-3 rounded-lg border border-red-500/40 bg-red-500/10">
          <p className="text-[12px] text-red-400 leading-relaxed">⚠ {uploadError}</p>
        </div>
      )}

      {/* ── Category legend ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="text-[9px] tracking-widest uppercase px-2 py-1 rounded border"
            style={{
              borderColor: cat === 'All Projects' ? 'rgba(197,160,86,0.5)' : 'rgba(255,255,255,0.12)',
              color:       cat === 'All Projects' ? '#C5A056'              : 'rgba(255,255,255,0.35)',
              background:  cat === 'All Projects' ? 'rgba(197,160,86,0.08)' : 'transparent',
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-white/8" style={{ background: '#131313', aspectRatio: '4/3' }}>
              <div className="w-full h-full bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center py-20 border border-white/8 rounded-xl">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p className="text-[13px] text-white/30 tracking-wide">No gallery images yet</p>
          <p className="text-[11px] text-white/20 mt-1">Click &quot;Add Image&quot; to get started. Images are stored in Supabase and visible on all devices.</p>
        </div>
      )}

      {/* Gallery grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((img) => (
            <GalleryImageCard
              key={img.id}
              image={img}
              onMeta={(patch) => onMeta(img.id, patch)}
              onDelete={() => onDelete(img.id)}
              onReplace={(blob) => onReplace(img.id, blob)}
            />
          ))}
        </div>
      )}

      <div className="h-12" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY IMAGE CARD
───────────────────────────────────────────────────────────────────────────── */
function GalleryImageCard({
  image,
  onMeta,
  onDelete,
  onReplace,
}: {
  image:     GalleryItem;
  onMeta:    (patch: Partial<Pick<GalleryMeta, 'title' | 'categories'>>) => void;
  onDelete:  () => void;
  onReplace: (blob: Blob) => Promise<string | null>;
}) {
  const replaceRef     = useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle,   setDraftTitle]   = useState(image.title);
  const [replacing,    setReplacing]    = useState(false);
  const [replaceErr,   setReplaceErr]   = useState<string | null>(null);
  const [imgBroken,    setImgBroken]    = useState(false);
  const [localUrl,     setLocalUrl]     = useState(image.objectUrl);

  useEffect(() => { setDraftTitle(image.title); }, [image.title]);
  useEffect(() => { setLocalUrl(image.objectUrl); }, [image.objectUrl]);

  const commitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== image.title) onMeta({ title: trimmed });
    else setDraftTitle(image.title);
    setEditingTitle(false);
  };

  const toggleCategory = (cat: GalleryCategory) => {
    const has  = image.categories.includes(cat);
    const next: GalleryCategory[] = has
      ? image.categories.filter((c) => c !== cat)
      : [...image.categories, cat];
    onMeta({ categories: next });
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setReplaceErr(null);
    setReplacing(true);
    try {
      const blob   = await processImageForGallery(file);
      const newUrl = await onReplace(blob);
      if (newUrl) { setLocalUrl(newUrl); setImgBroken(false); }
      else setReplaceErr('Failed to replace image.');
    } catch (err: unknown) {
      setReplaceErr(err instanceof Error ? err.message : 'Gallery storage is full.');
    } finally {
      setReplacing(false);
    }
  };

  const confirmDelete = () => {
    if (window.confirm(`Remove "${image.title}" from the gallery?`)) onDelete();
  };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border"
      style={{ borderColor: 'rgba(255,255,255,0.09)', background: '#131313' }}
    >
      {/* Thumbnail */}
      <div className="relative bg-black/40" style={{ aspectRatio: '4/3' }}>
        {imgBroken ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
            <span className="text-[10px] text-white/25">Image unavailable</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={localUrl} alt={image.title} className="w-full h-full object-cover" onError={() => setImgBroken(true)} />
        )}
        {replacing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="w-7 h-7 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        )}
        <button
          onClick={confirmDelete}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(220,38,38,0.85)', color: 'white' }}
          title="Remove image"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {replaceErr && (
        <div className="mx-3 mt-2 px-3 py-2 rounded border border-red-500/40 bg-red-500/10">
          <p className="text-[11px] text-red-400">⚠ {replaceErr}</p>
        </div>
      )}

      <div className="flex-1 p-4 flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="text-[9px] tracking-[0.18em] uppercase text-white/30 mb-1.5 block">Project Title</label>
          {editingTitle ? (
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') { setDraftTitle(image.title); setEditingTitle(false); }
              }}
              className="w-full bg-white/8 border border-yellow-400/50 rounded px-3 py-2 text-[13px] text-white outline-none"
              maxLength={80}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="w-full text-left px-3 py-2 rounded border border-white/10 hover:border-yellow-400/40 transition-colors group"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <span className="text-[13px] text-white/80 group-hover:text-white">{image.title}</span>
              <span className="ml-2 text-[10px] text-white/25 group-hover:text-yellow-400/60">✎</span>
            </button>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="text-[9px] tracking-[0.18em] uppercase text-white/30 mb-2 block">Category</label>
          <div className="grid grid-cols-2 gap-1.5">
            {GALLERY_CATEGORIES.map((cat) => {
              const selected = image.categories.includes(cat);
              const isAll    = cat === 'All Projects';
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded border text-left text-[10px] tracking-wide transition-all"
                  style={{
                    background:  selected ? (isAll ? 'rgba(197,160,86,0.18)' : 'rgba(197,160,86,0.14)') : 'rgba(255,255,255,0.03)',
                    borderColor: selected ? (isAll ? 'rgba(197,160,86,0.6)' : 'rgba(197,160,86,0.5)') : 'rgba(255,255,255,0.1)',
                    color:       selected ? (isAll ? '#C5A056' : 'rgba(255,255,255,0.85)') : 'rgba(255,255,255,0.4)',
                    cursor:      'pointer',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{
                      background: selected ? (isAll ? '#C5A056' : 'rgba(197,160,86,0.9)') : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${selected ? (isAll ? '#C5A056' : 'rgba(197,160,86,0.8)') : 'rgba(255,255,255,0.15)'}`,
                    }}
                  >
                    {selected && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-white/20 mt-1.5">Check &quot;All Projects&quot; manually to include this image in that filter.</p>
        </div>

        {/* Replace */}
        <div className="mt-auto pt-2 border-t border-white/8">
          <button
            onClick={() => { if (!replacing) replaceRef.current?.click(); }}
            disabled={replacing}
            className="w-full py-2 text-[10px] tracking-widest uppercase rounded border transition-all"
            style={{
              borderColor: replacing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              color:       replacing ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.55)',
              cursor:      replacing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!replacing) { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(197,160,86,0.5)'; (e.currentTarget as HTMLButtonElement).style.color='#C5A056'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.55)'; }}
          >
            ↑ Replace Image
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleReplaceFileChange}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED SMALL COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">{title}</span>
      <span className="text-[9px] text-white/20 font-mono">({sub})</span>
    </div>
  );
}

function SliderLabel({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[12px] text-white/70">{label}</label>
      <span className="font-mono text-[13px] tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function SliderMinMax({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-white/20">{left}</span>
      <span className="text-[10px] text-white/20">{right}</span>
    </div>
  );
}
