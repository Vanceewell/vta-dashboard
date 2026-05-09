'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchSiteImages, type SiteImageMap } from '@/lib/siteImages';

const IMAGE_STORAGE_KEY = 'jgt_image_overrides_v1';
function useImageOverrides() {
  const [legacyImgs, setLegacyImgs] = useState<Record<string, string>>({});
  const [supabaseImgs, setSupabaseImgs] = useState<SiteImageMap>({});
  useEffect(() => {
    // Legacy localStorage fallback
    try {
      const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (raw) setLegacyImgs(JSON.parse(raw));
    } catch { /* ignore */ }
    // Supabase — primary source
    fetchSiteImages().then(({ urls }) => setSupabaseImgs(urls)).catch(() => {});
  }, []);
  return { legacyImgs, supabaseImgs };
}

// Map from legacy override id to Supabase slot name
const OVERRIDE_TO_SLOT: Record<string, import('@/lib/siteImages').SiteImageSlot> = {
  'service-automotive':  'automotiveServiceImage',
  'service-residential': 'residentialServiceImage',
  'service-commercial':  'commercialServiceImage',
  'service-marine':      'marineServiceImage',
  'service-frost':       'frostServiceImage',
  'service-safety':      'safetyServiceImage',
};

// AI-EDITABLE: services list (6 cards — 3×2 grid)
const SERVICES = [
  {
    slug:       '/automotive-window-tint',
    overrideId: 'service-automotive',
    title: 'Automotive Tint',
    desc:  'Factory-precise installation on sedans, trucks, SUVs, and sports cars. Premium American-made film for heat rejection, glare reduction, and UV protection.',
    img:   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    icon:  <CarIcon />,
  },
  {
    slug:       '/residential-window-tint',
    overrideId: 'service-residential',
    title: 'Residential Tint',
    desc:  'Keep your home cooler, protect furnishings from UV fade, and add privacy — without blocking natural light or your ocean view.',
    img:   'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    icon:  <HomeIcon />,
  },
  {
    slug:       '/commercial-window-tint',
    overrideId: 'service-commercial',
    title: 'Commercial Tint',
    desc:  'Reduce energy costs, enhance storefront appearance, and protect employees and inventory with professional commercial film installation.',
    img:   'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    icon:  <BuildingIcon />,
  },
  {
    slug:       '/marine-window-tint',
    overrideId: 'service-marine',
    title: 'Marine Tint',
    desc:  'Salt air, intense UV reflection, and coastal sun require specialized marine-grade film. Protect your cabin and keep passengers comfortable.',
    img:   'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    icon:  <AnchorIcon />,
  },
  {
    slug:       '/frost-film',
    overrideId: 'service-frost',
    title: 'Frost Film',
    desc:  'Elegant frosted privacy film for bathroom windows, office partitions, and interior glass. Professional aesthetics with zero permanent commitment.',
    img:   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    icon:  <FrostIcon />,
  },
  {
    slug:       '/safety-film',
    overrideId: 'service-safety',
    title: 'Safety Film',
    desc:  'Shatter-resistant safety film holds glass together on impact — essential for homes, schools, storefronts, and vehicles. Code-compliant options available.',
    img:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    icon:  <ShieldIcon />,
  },
];

export default function ServicesSection() {
  const { legacyImgs, supabaseImgs } = useImageOverrides();
  // Apply image overrides: Supabase first, then legacy localStorage, then default
  const services = SERVICES.map((s) => ({
    ...s,
    img: supabaseImgs[OVERRIDE_TO_SLOT[s.overrideId]] ?? legacyImgs[s.overrideId] ?? s.img,
  }));
  return (
    <section id="services" className="py-24 lg:py-32 bg-jgt-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="section-label">What We Do</span>
          <div className="flex items-end justify-between mt-4">
            <h2 className="font-display text-jgt-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Premium Film for Every Application
            </h2>
            <a href="sms:9494968468" className="hidden lg:inline-flex btn-gold text-xs">
              <MessageIcon />
              Text Jason
            </a>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />
        </motion.div>

        {/* Service Cards Grid */}
        {/* 6 cards: perfectly balanced 3×2 grid on desktop, 2×3 on tablet, 1×6 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
              className="group relative overflow-hidden cursor-pointer"
            >
              <Link href={s.slug}>
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${s.img}')` }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  {/* Icon */}
                  <div className="absolute top-5 left-5 w-10 h-10 flex items-center justify-center text-jgt-gold">
                    {s.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-jgt-surface p-6 border border-jgt-border group-hover:border-jgt-gold/30 transition-colors duration-300">
                  <h3 className="font-display text-xl text-jgt-text mb-2 group-hover:text-jgt-gold transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-sans text-jgt-muted text-sm leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.14em] uppercase text-jgt-gold group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Inline SVG Icons ───────────────────────────────────────────────
function CarIcon()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2l2-3h8l2 3h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>; }
function HomeIcon()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function BuildingIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" ry="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>; }
function AnchorIcon()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>; }
function FrostIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/></svg>; }
function ShieldIcon()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function ArrowRight()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>; }
function MessageIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
