'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   STORAGE KEYS — must match admin-hero-layout/page.tsx
───────────────────────────────────────────────────────────────────────────── */
const IMAGE_STORAGE_KEY   = 'jgt_image_overrides_v1';
const GALLERY_STORAGE_KEY = 'jgt_custom_gallery_v1';

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY CATEGORIES — must match admin-hero-layout/page.tsx
───────────────────────────────────────────────────────────────────────────── */
const GALLERY_CATEGORIES_ALL = ['All Projects', 'Automotive', 'Residential', 'Commercial', 'Marine', 'RV', 'Frost', 'Safety Film'] as const;
type GalleryCategory = typeof GALLERY_CATEGORIES_ALL[number];

/* ─────────────────────────────────────────────────────────────────────────────
   PLACEHOLDER IMAGES — shown before any custom uploads exist
   cat must be lowercase and match the filter key used below
───────────────────────────────────────────────────────────────────────────── */
const PLACEHOLDER_IMAGES_DEFAULT = [
  { id: '1',  overrideId: 'gallery-1',  src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', cat: 'Automotive',  title: 'Luxury Sedan — Ceramic Tint',       tall: true  },
  { id: '2',  overrideId: 'gallery-2',  src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', cat: 'Automotive',  title: 'Porsche 911 — Carbon Series',        tall: false },
  { id: '3',  overrideId: 'gallery-3',  src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', cat: 'Residential', title: 'Modern Home — Privacy Film',          tall: true  },
  { id: '4',  overrideId: 'gallery-4',  src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', cat: 'Automotive',  title: 'BMW — Full Ceramic Package',           tall: false },
  { id: '5',  overrideId: 'gallery-5',  src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', cat: 'Commercial',  title: 'Office Complex — Solar Control',      tall: false },
  { id: '6',  overrideId: 'gallery-6',  src: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', cat: 'Marine',      title: 'Luxury Yacht — Marine Series',        tall: true  },
  { id: '7',  overrideId: 'gallery-7',  src: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', cat: 'Automotive',  title: 'McLaren — Premium Film Install',       tall: false },
  { id: '8',  overrideId: 'gallery-8',  src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', cat: 'Residential', title: 'Talega Estate — Full Home Package',   tall: false },
  { id: '9',  overrideId: 'gallery-9',  src: 'https://images.unsplash.com/photo-1600298882525-26ffb3a3d31f?w=800&q=80', cat: 'RV',          title: 'Class A Motorhome — Full Wrap',       tall: true  },
  { id: '10', overrideId: 'gallery-10', src: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80', cat: 'Automotive',  title: 'Maserati — Ceramic Tint Package',     tall: false },
  { id: '11', overrideId: 'gallery-11', src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', cat: 'Commercial',  title: 'Retail Storefront — Privacy & Solar',  tall: false },
  { id: '12', overrideId: 'gallery-12', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', cat: 'Frost',       title: 'Office Glass — Architectural Frost',  tall: true  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOM GALLERY IMAGE (matches admin page type)
───────────────────────────────────────────────────────────────────────────── */
interface CustomGalleryImage {
  id:         string;
  title:      string;
  src:        string;
  categories: GalleryCategory[];
  addedAt:    number;
}

/* Safe load custom gallery from localStorage */
function loadCustomGallery(): CustomGalleryImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CustomGalleryImage =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.src === 'string' &&
        item.src.startsWith('data:image/') &&
        Array.isArray(item.categories),
    );
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   UNIFIED GALLERY ITEM — used for rendering
───────────────────────────────────────────────────────────────────────────── */
interface GalleryItem {
  id:         string;
  src:        string;
  title:      string;
  categories: GalleryCategory[];
  tall:       boolean;
}

export default function GallerySection() {
  const [active, setActive]       = useState<GalleryCategory>('All Projects');
  const [lightbox, setLightbox]   = useState<string | null>(null);
  const [items, setItems]         = useState<GalleryItem[]>([]);

  /* Load gallery from localStorage (client only) */
  useEffect(() => {
    /* Image overrides for placeholder images */
    let overrides: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (raw) overrides = JSON.parse(raw);
    } catch { /* ignore */ }

    /* Custom gallery images uploaded via editor */
    const customImages = loadCustomGallery();

    /* Build placeholder items (with any overrides applied) */
    const placeholders: GalleryItem[] = PLACEHOLDER_IMAGES_DEFAULT.map((img) => ({
      id:         img.id,
      src:        overrides[img.overrideId] ?? img.src,
      title:      img.title,
      categories: ['All Projects', img.cat as GalleryCategory],
      tall:       img.tall,
    }));

    /* Convert custom uploads to GalleryItem format */
    const customItems: GalleryItem[] = customImages.map((img, i) => ({
      id:         img.id,
      src:        img.src,
      title:      img.title,
      categories: img.categories,
      // Alternate tall/short for visual variety; custom images uploaded first appear first
      tall:       i % 3 === 0,
    }));

    /* Custom images appear FIRST, then placeholders */
    setItems([...customItems, ...placeholders]);
  }, []);

  /* Filter by active tab */
  const filtered = active === 'All Projects'
    ? items
    : items.filter((item) => item.categories.includes(active));

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
            <a href="/admin-hero-layout" className="btn-outline text-xs self-start lg:self-auto">
              + Manage Gallery
            </a>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {GALLERY_CATEGORIES_ALL.map((cat) => (
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

        {/* Masonry Grid */}
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
                onClick={() => setLightbox(img.src)}
              >
                <div className={`relative overflow-hidden ${img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.1'; }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="font-display text-jgt-text text-sm">{img.title}</p>
                      <span className="font-sans text-jgt-gold text-[10px] tracking-[0.18em] uppercase">
                        {img.categories.filter((c) => c !== 'All Projects').join(', ') || 'All Projects'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state for a filtered view */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-sans text-jgt-muted text-sm">No {active} images yet.</p>
          </motion.div>
        )}

        {/* CTA */}
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
