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
   IMAGES — registry & safe localStorage helpers
───────────────────────────────────────────────────────────────────────────── */
const IMAGE_STORAGE_KEY = 'jgt_image_overrides_v1';

/** Absolute maximum size (bytes) we allow in localStorage per key. ~4 MB */
const MAX_STORED_BYTES = 4 * 1024 * 1024;

/** Accepted MIME types (others are rejected before any processing). */
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_EXT   = ['.jpg', '.jpeg', '.png', '.webp'];

interface ImageEntry {
  id: string;
  label: string;
  group: string;
  original: string;
}

const IMAGE_REGISTRY: ImageEntry[] = [
  // ── Hero ──────────────────────────────────────────────────────────────────
  { id: 'hero-bg',           label: 'Hero Background',            group: 'Hero',     original: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80' },
  { id: 'hero-logo',         label: 'Hero Logo',                  group: 'Hero',     original: '/images/ChatGPT%20Image%20May%207%2C%202026%2C%2009_16_16%20PM.png' },

  // ── Services ──────────────────────────────────────────────────────────────
  { id: 'service-automotive', label: 'Service — Automotive Tint', group: 'Services', original: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
  { id: 'service-residential',label: 'Service — Residential Tint',group: 'Services', original: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
  { id: 'service-commercial', label: 'Service — Commercial Tint', group: 'Services', original: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' },
  { id: 'service-marine',     label: 'Service — Marine Tint',     group: 'Services', original: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80' },
  { id: 'service-frost',      label: 'Service — Frost Film',      group: 'Services', original: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
  { id: 'service-safety',     label: 'Service — Safety Film',     group: 'Services', original: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },

  // ── About ─────────────────────────────────────────────────────────────────
  { id: 'about-portrait',    label: 'About — Jason Portrait',     group: 'About',    original: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80' },

  // ── Gallery ───────────────────────────────────────────────────────────────
  { id: 'gallery-1',  label: 'Gallery 1 — Luxury Sedan',    group: 'Gallery', original: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80' },
  { id: 'gallery-2',  label: 'Gallery 2 — Porsche 911',     group: 'Gallery', original: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
  { id: 'gallery-3',  label: 'Gallery 3 — Modern Home',     group: 'Gallery', original: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
  { id: 'gallery-4',  label: 'Gallery 4 — BMW Ceramic',     group: 'Gallery', original: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80' },
  { id: 'gallery-5',  label: 'Gallery 5 — Office Complex',  group: 'Gallery', original: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' },
  { id: 'gallery-6',  label: 'Gallery 6 — Luxury Yacht',    group: 'Gallery', original: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80' },
  { id: 'gallery-7',  label: 'Gallery 7 — McLaren',         group: 'Gallery', original: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80' },
  { id: 'gallery-8',  label: 'Gallery 8 — Talega Estate',   group: 'Gallery', original: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
  { id: 'gallery-9',  label: 'Gallery 9 — Motorhome',       group: 'Gallery', original: 'https://images.unsplash.com/photo-1600298882525-26ffb3a3d31f?w=800&q=80' },
  { id: 'gallery-10', label: 'Gallery 10 — Maserati',       group: 'Gallery', original: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80' },
  { id: 'gallery-11', label: 'Gallery 11 — Retail Storefront', group: 'Gallery', original: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { id: 'gallery-12', label: 'Gallery 12 — Office Frost',   group: 'Gallery', original: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
];

/* ─── Safe localStorage helpers ─────────────────────────────────────────── */

/**
 * Load image overrides from localStorage.
 * - Validates JSON is a plain object.
 * - Skips any individual value that isn't a string or looks corrupted.
 * - Skips any value that is over MAX_STORED_BYTES (stored as base64).
 * - Never throws; always returns a safe subset.
 */
function loadImageOverrides(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};

    const safe: Record<string, string> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val !== 'string') continue;
      // Must start with data: and be a plausible data URL
      if (!val.startsWith('data:image/')) continue;
      // Skip if too large (corrupted / raw uncompressed upload)
      if (val.length > MAX_STORED_BYTES) {
        console.warn(`[ImageOverrides] Skipping "${key}": stored value too large (${val.length} bytes). Falling back to original.`);
        continue;
      }
      safe[key] = val;
    }
    return safe;
  } catch (err) {
    console.warn('[ImageOverrides] Failed to load from localStorage:', err);
    return {};
  }
}

/**
 * Save image overrides to localStorage.
 * Catches QuotaExceededError and other write failures gracefully.
 * Returns true on success, false on failure.
 */
function saveImageOverrides(overrides: Record<string, string>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(overrides));
    return true;
  } catch (err) {
    console.error('[ImageOverrides] Failed to save to localStorage:', err);
    return false;
  }
}

function clearImageOverrides(): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(IMAGE_STORAGE_KEY); } catch { /* noop */ }
}

/* ─── Image compression helper ──────────────────────────────────────────── */

interface CompressOptions {
  maxWidth:  number;
  maxHeight: number;
  quality:   number;
  hasAlpha:  boolean;
}

/**
 * Compress/resize an image File using a canvas.
 * Preserves transparency when hasAlpha=true (outputs WebP with alpha; falls back to PNG).
 * Returns a data URL or throws on failure.
 */
function compressImage(file: File, opts: CompressOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img  = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        let { width, height } = img;

        // Scale down if needed, maintaining aspect ratio
        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Could not get canvas 2D context.')); return; }

        if (!opts.hasAlpha) {
          // Fill with white for JPEG output (no transparency)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Choose output format
        const mimeType = opts.hasAlpha ? 'image/webp' : 'image/webp';
        let dataUrl = canvas.toDataURL(mimeType, opts.quality);

        // If WebP with alpha is still large, try PNG as fallback
        if (opts.hasAlpha && dataUrl.length > MAX_STORED_BYTES) {
          dataUrl = canvas.toDataURL('image/png');
        }

        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression.'));
    };

    img.src = url;
  });
}

/**
 * Detect whether an image file likely has an alpha channel.
 * For PNG we assume yes; everything else assumed no.
 */
function fileHasAlpha(file: File): boolean {
  return file.type === 'image/png';
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR NAV
───────────────────────────────────────────────────────────────────────────── */
type Tab = 'positioning' | 'images';

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
];

const IMAGE_GROUPS = Array.from(new Set(IMAGE_REGISTRY.map((e) => e.group)));

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminHeroLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('positioning');

  /* ── Positioning state ── */
  const [cfg, setCfg]             = useState<HeroConfig>(DEFAULT_CONFIG);
  const [layoutSaved, setLayoutSaved] = useState(false);

  /* ── Images state ── */
  const [imgOverrides, setImgOverrides] = useState<Record<string, string>>({});
  const [imgSaved, setImgSaved]         = useState(false);

  /* ── Load on mount (safe) ── */
  useEffect(() => {
    try { setCfg(loadHeroConfig()); } catch { /* fall back to DEFAULT_CONFIG */ }
    setImgOverrides(loadImageOverrides()); // already safe
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

  /* ── Image handlers ── */
  const handleReplaceImage = useCallback(
    (id: string, dataUrl: string) => {
      setImgOverrides((prev) => {
        const next = { ...prev, [id]: dataUrl };
        saveImageOverrides(next);
        return next;
      });
      setImgSaved(false);
    },
    [],
  );

  const handleResetImage = useCallback((id: string) => {
    setImgOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      saveImageOverrides(next);
      return next;
    });
  }, []);

  const handleResetAllImages = () => {
    clearImageOverrides();
    setImgOverrides({});
  };

  const handleSaveImages = () => {
    const ok = saveImageOverrides(imgOverrides);
    if (ok) {
      setImgSaved(true);
      setTimeout(() => setImgSaved(false), 2500);
    }
  };

  /* ── Unified save ── */
  const isPositioning = activeTab === 'positioning';
  const handleSave    = isPositioning ? handleSaveLayout : handleSaveImages;
  const isSaved       = isPositioning ? layoutSaved : imgSaved;

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
            {isPositioning ? 'Positioning' : 'Images'}
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
          {isPositioning && (
            <button
              onClick={handleResetLayout}
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
            >
              Reset to Default
            </button>
          )}
          {!isPositioning && (
            <button
              onClick={handleResetAllImages}
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
            >
              Reset All Images
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[11px] tracking-widest uppercase rounded font-semibold transition-all"
            style={{ background: isSaved ? '#22c55e' : '#C5A056', color: '#0a0a0a' }}
          >
            {isSaved ? '✓ Saved' : 'Save to This Browser'}
          </button>
        </div>
      </header>

      {/* ════════════════════ INFO BANNER ════════════════════ */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2">
        <p className="text-[11px] text-white/40">
          💾 All changes are saved to this browser only. The homepage will reflect your saved values when you visit it here.
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

        {/* ── Main content + preview ── */}
        <div className="flex flex-1 min-h-0 min-w-0">

          {/* ── Controls panel (scrollable) ── */}
          <div
            className="w-80 xl:w-96 flex-shrink-0 overflow-y-auto border-r border-white/10"
            style={{ background: '#111' }}
          >
            {activeTab === 'positioning' ? (
              <PositioningPanel cfg={cfg} update={update} />
            ) : (
              <ImagesPanel
                overrides={imgOverrides}
                onReplace={handleReplaceImage}
                onReset={handleResetImage}
              />
            )}
          </div>

          {/* ── Live preview ── */}
          <div className="flex-1 relative" style={{ minHeight: '600px' }}>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 pointer-events-none">
              <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">Live Preview</span>
            </div>
            <div className="w-full h-full overflow-hidden">
              <HeroSection config={cfg} imageOverrides={imgOverrides} />
            </div>
          </div>

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
      {/* Section 1: Scale / Size */}
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

      {/* Section 2: Move Up / Down */}
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

      {/* Section 3: Scroll Indicator */}
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
  overrides,
  onReplace,
  onReset,
}: {
  overrides: Record<string, string>;
  onReplace: (id: string, dataUrl: string) => void;
  onReset:   (id: string) => void;
}) {
  return (
    <div className="p-5 space-y-8">

      <div className="p-3 border border-white/10 rounded bg-white/3">
        <p className="text-[10px] text-white/40 leading-relaxed">
          🖼 Replace images for your browser only. Original files are never deleted.
          <br />Supports JPG, PNG, WebP. HEIC, TIFF, and RAW files are not supported.
          <br />Large images are automatically resized and compressed before saving.
        </p>
      </div>

      {IMAGE_GROUPS.map((group) => (
        <div key={group}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium">{group}</span>
            <div className="flex-1 h-[1px] bg-white/8" />
          </div>

          <div className="space-y-4">
            {IMAGE_REGISTRY.filter((e) => e.group === group).map((entry) => (
              <ImageCard
                key={entry.id}
                entry={entry}
                overrideSrc={overrides[entry.id]}
                onReplace={onReplace}
                onReset={onReset}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="h-8" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CARD — with full safe upload pipeline
───────────────────────────────────────────────────────────────────────────── */
function ImageCard({
  entry,
  overrideSrc,
  onReplace,
  onReset,
}: {
  entry: ImageEntry;
  overrideSrc?: string;
  onReplace: (id: string, dataUrl: string) => void;
  onReset:   (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isCustom = !!overrideSrc;
  const displaySrc = overrideSrc ?? entry.original;

  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input immediately so the same file can be chosen again later
    e.target.value = '';
    if (!file) return;

    setError(null);
    setProcessing(true);

    try {
      /* 1. Validate file type ─────────────────────────────────────────── */
      const mime = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      const extOk = ACCEPTED_EXT.some((ext) => name.endsWith(ext));
      const mimeOk = ACCEPTED_TYPES.includes(mime);

      if (!extOk && !mimeOk) {
        // Give a user-friendly message for common unsupported types
        const isHeic = name.endsWith('.heic') || name.endsWith('.heif') || mime.includes('heic') || mime.includes('heif');
        const isTiff = name.endsWith('.tiff') || name.endsWith('.tif') || mime.includes('tiff');
        const isRaw  = name.endsWith('.raw') || name.endsWith('.cr2') || name.endsWith('.nef') ||
                       name.endsWith('.arw') || name.endsWith('.dng') || mime.includes('x-raw');

        if (isHeic || isTiff || isRaw) {
          throw new Error('Unsupported image type. Please upload JPG, PNG, or WebP.');
        }
        throw new Error('Unsupported image type. Please upload JPG, PNG, or WebP.');
      }

      /* 2. Compress / resize ───────────────────────────────────────────── */
      const hasAlpha = fileHasAlpha(file);
      const dataUrl  = await compressImage(file, {
        maxWidth:  1800,
        maxHeight: 1800,
        quality:   0.82,
        hasAlpha,
      });

      /* 3. Final size guard ────────────────────────────────────────────── */
      if (dataUrl.length > MAX_STORED_BYTES) {
        throw new Error(
          'Image is still too large after compression. Please choose a smaller image.',
        );
      }

      /* 4. Commit ─────────────────────────────────────────────────────── */
      onReplace(entry.id, dataUrl);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error processing image.';
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="rounded overflow-hidden border transition-colors"
      style={{ borderColor: isCustom ? 'rgba(197,160,86,0.4)' : 'rgba(255,255,255,0.08)', background: '#0e0e0e' }}
    >
      {/* Image preview */}
      <div className="relative w-full bg-black/30" style={{ aspectRatio: '16/7' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displaySrc}
          alt={entry.label}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0.15';
          }}
        />
        {isCustom && (
          <div className="absolute top-2 right-2 bg-yellow-400/90 text-black text-[9px] tracking-widest uppercase px-2 py-0.5 rounded font-semibold">
            Custom
          </div>
        )}
        {/* Processing overlay */}
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-[11px] tracking-widest uppercase text-yellow-400 animate-pulse">
              Processing image…
            </span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-3 mt-3 px-3 py-2 rounded border border-red-500/40 bg-red-500/10">
          <p className="text-[11px] text-red-400 leading-snug">⚠ {error}</p>
        </div>
      )}

      {/* Card footer */}
      <div className="px-3 py-3">
        <div className="mb-2">
          <p className="text-[12px] text-white/80 font-medium leading-tight">{entry.label}</p>
          <p
            className="text-[10px] font-mono mt-0.5 truncate"
            style={{ color: isCustom ? '#C5A056' : 'rgba(255,255,255,0.25)' }}
            title={isCustom ? '(custom override)' : entry.original}
          >
            {isCustom
              ? '(custom override active)'
              : entry.original
                  .replace('https://images.unsplash.com/', 'unsplash/')
                  .replace('/images/', '/')}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {/* Replace button — disabled while processing */}
          <button
            onClick={() => { setError(null); fileRef.current?.click(); }}
            disabled={processing}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase rounded transition-all border font-medium"
            style={{
              background:  processing ? 'rgba(197,160,86,0.3)' : '#C5A056',
              color:       processing ? 'rgba(0,0,0,0.4)'       : '#0a0a0a',
              borderColor: processing ? 'rgba(197,160,86,0.3)' : '#C5A056',
              cursor:      processing ? 'not-allowed'           : 'pointer',
            }}
          >
            {processing ? 'Processing…' : '↑ Replace'}
          </button>

          {/* Reset button (shown if custom) */}
          {isCustom && !processing && (
            <button
              onClick={() => { setError(null); onReset(entry.id); }}
              className="py-2 px-3 text-[10px] tracking-widest uppercase rounded transition-all border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Hidden file input — only accepted types */}
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
