'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
  loadGallery,
} from '@/lib/galleryStorage';

/* ─────────────────────────────────────────────────────────────────────────────
   PUBLIC GALLERY SECTION
   Reads from IndexedDB via galleryStorage.ts.
   • If no items saved → premium empty state (no broken placeholders ever).
   • Revokes object URLs on unmount to avoid memory leaks.
───────────────────────────────────────────────────────────────────────────── */

/* Premium SVG icons — one per category, luxury/minimal style */
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'All Projects': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  'Automotive': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3v-5l2-5h14l2 5v5h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="16.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  'Residential': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  'Commercial': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="17"/>
      <line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
    </svg>
  ),
  'Marine': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-9 6 4 6-4 3 9"/>
      <path d="M2 20h20"/>
    </svg>
  ),
  'RV': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="11" rx="1"/>
      <path d="M19 10h3l1 4v2h-4"/>
      <circle cx="6" cy="19" r="2"/>
      <circle cx="16" cy="19" r="2"/>
    </svg>
  ),
  'Frost': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="M7 7l5 5 5-5"/>
      <path d="M7 17l5-5 5 5"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M7 7L2 12l5 5"/>
      <path d="M17 7l5 5-5 5"/>
    </svg>
  ),
  'Safety Film': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

interface RenderItem extends GalleryItem {
  tall: boolean;
}

export default function GallerySection() {
  const [active,   setActive]   = useState<GalleryCategory>('All Projects');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [items,    setItems]    = useState<RenderItem[]>([]);
  const [loaded,   setLoaded]   = useState(false);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    loadGallery().then((saved) => {
      if (cancelled) {
        saved.forEach((i) => URL.revokeObjectURL(i.objectUrl));
        return;
      }
      // Track URLs so we can revoke on unmount
      objectUrls.current = saved.map((i) => i.objectUrl);
      setItems(
        saved.map((item, i) => ({ ...item, tall: i % 3 === 0 })),
      );
      setLoaded(true);
    }).catch(() => {
      if (!cancelled) setLoaded(true);
    });

    return () => {
      cancelled = true;
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Each filter tab shows only items that have that category selected.
  // 'All Projects' is no longer a catch-all — it shows only images explicitly tagged with it.
  const filtered = items.filter((item) => item.categories.includes(active));

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-jgt-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          {/* Eyebrow label — upper-left, above the heading */}
          <span className="section-label">40+ years of craftsmanship</span>
          <div className="mt-3">
            <h2 className="font-display text-jgt-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              40+ Years of Craftsmanship
            </h2>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />
        </motion.div>

        {/* Filter Tiles */}
        <div className="gallery-filter-row mb-10">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`gallery-filter-tile ${
                active === cat ? 'gallery-filter-tile--active' : 'gallery-filter-tile--inactive'
              }`}
            >
              {CATEGORY_ICONS[cat] && (
                <span className="gallery-filter-tile__icon">
                  {CATEGORY_ICONS[cat]}
                </span>
              )}
              <span className="gallery-filter-tile__label">{cat}</span>
            </button>
          ))}
        </div>

        {/* No items saved — premium empty state */}
        {loaded && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24 border border-jgt-border/30"
          >
            <div className="w-12 h-[1px] bg-jgt-gold mx-auto mb-8" />
            <p className="font-display italic text-jgt-text text-xl lg:text-2xl mb-3">
              Gallery coming soon.
            </p>
            <p className="font-sans text-jgt-muted text-sm max-w-sm mx-auto">
              Jason&apos;s project photos are on the way. In the meantime, text him directly for examples of past work.
            </p>
            <a href="sms:9494968468" className="btn-gold inline-flex mt-8 text-xs px-8 py-4">
              Text Jason for Examples
            </a>
            <div className="w-12 h-[1px] bg-jgt-gold mx-auto mt-8" />
          </motion.div>
        )}

        {/* Has items but none in this category */}
        {loaded && items.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-sans text-jgt-muted text-sm">No {active} projects yet.</p>
          </motion.div>
        )}

        {/* Masonry Grid */}
        {filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="masonry-grid"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="masonry-item group relative overflow-hidden cursor-pointer"
                  onClick={() => setLightbox(img.objectUrl)}
                >
                  <div className={`relative overflow-hidden ${img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.objectUrl}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.1'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        <p className="font-display text-jgt-text text-sm">{img.title}</p>
                        <span className="font-sans text-jgt-gold text-[10px] tracking-[0.18em] uppercase">
                          {img.categories.length > 0 ? img.categories.join(', ') : 'No categories'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA */}
        {loaded && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="font-sans text-jgt-muted text-sm mb-4">Want results like these for your vehicle, home, or business?</p>
            <a href="sms:9494968468" className="btn-gold text-xs px-8 py-4">
              Text Jason for a Quote
            </a>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[90vh] relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={lightbox} alt="Gallery" className="max-h-[85vh] max-w-full object-contain" />
              <button
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center glass text-jgt-text hover:text-jgt-gold transition-colors cursor-pointer"
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
