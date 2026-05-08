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
          <span className="section-label">Project Gallery</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mt-4 gap-4">
            <h2 className="font-display text-jgt-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              40+ Years of Craftsmanship
            </h2>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-sans text-xs tracking-[0.14em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                active === cat
                  ? 'bg-jgt-gold text-[#080808] border-jgt-gold'
                  : 'border-jgt-border text-jgt-muted hover:border-jgt-gold/50 hover:text-jgt-text'
              }`}
            >
              {cat}
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
