'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGE_STORAGE_KEY = 'jgt_image_overrides_v1';

// AI-EDITABLE: placeholder gallery images (replaced when Supabase is connected)
// overrideId maps to the admin image registry ids (gallery-1 … gallery-12)
const PLACEHOLDER_IMAGES_DEFAULT = [
  { id: '1',  overrideId: 'gallery-1',  src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', cat: 'automotive',  title: 'Luxury Sedan — Ceramic Tint',       tall: true  },
  { id: '2',  overrideId: 'gallery-2',  src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', cat: 'automotive',  title: 'Porsche 911 — Carbon Series',        tall: false },
  { id: '3',  overrideId: 'gallery-3',  src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', cat: 'residential', title: 'Modern Home — Privacy Film',          tall: true  },
  { id: '4',  overrideId: 'gallery-4',  src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', cat: 'automotive',  title: 'BMW — Full Ceramic Package',           tall: false },
  { id: '5',  overrideId: 'gallery-5',  src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', cat: 'commercial',  title: 'Office Complex — Solar Control',      tall: false },
  { id: '6',  overrideId: 'gallery-6',  src: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', cat: 'marine',      title: 'Luxury Yacht — Marine Series',        tall: true  },
  { id: '7',  overrideId: 'gallery-7',  src: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', cat: 'automotive',  title: 'McLaren — Premium Film Install',       tall: false },
  { id: '8',  overrideId: 'gallery-8',  src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', cat: 'residential', title: 'Talega Estate — Full Home Package',   tall: false },
  { id: '9',  overrideId: 'gallery-9',  src: 'https://images.unsplash.com/photo-1600298882525-26ffb3a3d31f?w=800&q=80', cat: 'rv',          title: 'Class A Motorhome — Full Wrap',       tall: true  },
  { id: '10', overrideId: 'gallery-10', src: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80', cat: 'automotive',  title: 'Maserati — Ceramic Tint Package',     tall: false },
  { id: '11', overrideId: 'gallery-11', src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', cat: 'commercial',  title: 'Retail Storefront — Privacy & Solar',  tall: false },
  { id: '12', overrideId: 'gallery-12', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', cat: 'frost',       title: 'Office Glass — Architectural Frost',  tall: true  },
];

const CATEGORIES = ['all', 'automotive', 'residential', 'commercial', 'marine', 'rv', 'frost', 'safety film'];

export default function GallerySection() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [imgOverrides, setImgOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (raw) setImgOverrides(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Apply saved overrides
  const PLACEHOLDER_IMAGES = PLACEHOLDER_IMAGES_DEFAULT.map((img) => ({
    ...img,
    src: imgOverrides[img.overrideId] ?? img.src,
  }));

  const filtered = active === 'all'
    ? PLACEHOLDER_IMAGES
    : PLACEHOLDER_IMAGES.filter((img) => img.cat === active);

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
            <a href="/admin-gallery" className="btn-outline text-xs self-start lg:self-auto">
              + Upload Images
            </a>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-sans text-xs tracking-[0.14em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                active === cat
                  ? 'bg-jgt-gold text-[#080808] border-jgt-gold'
                  : 'border-jgt-border text-jgt-muted hover:border-jgt-gold/50 hover:text-jgt-text'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
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
                transition={{ duration: 0.5, delay: i * 0.06 }}
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
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <p className="font-display text-jgt-text text-sm">{img.title}</p>
                      <span className="font-sans text-jgt-gold text-[10px] tracking-[0.18em] uppercase">{img.cat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

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
