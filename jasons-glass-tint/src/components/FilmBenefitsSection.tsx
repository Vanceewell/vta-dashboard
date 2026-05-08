'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// AI-EDITABLE: film benefits data
const BENEFITS = [
  { label: 'Heat Rejection',       pct: 96, desc: 'Block up to 96% of solar heat for a dramatically cooler interior.' },
  { label: 'UV Protection',        pct: 99, desc: 'Block 99.9% of harmful UV rays — the leading cause of interior fade and skin damage.' },
  { label: 'Interior Protection',  pct: 87, desc: 'Protect leather, plastics, and upholstery from sun-related cracking and discoloration.' },
  { label: 'Glare Reduction',      pct: 90, desc: 'Reduce eye strain and improve visibility on Southern California\'s bright coastal roads.' },
  { label: 'Privacy & Security',   pct: 80, desc: 'Premium tint adds a discreet layer of privacy without compromising outward visibility.' },
  { label: 'Energy Efficiency',    pct: 75, desc: 'Reduce A/C load in vehicles and reduce HVAC costs in homes and commercial buildings.' },
  { label: 'Appearance',           pct: 95, desc: 'A clean, factory-look tint finish transforms the entire look of any vehicle or building.' },
  { label: 'Safety Film Strength', pct: 88, desc: 'Shatter-resistant safety film holds glass together on impact, protecting occupants.' },
];

function BarMeter({ pct, delay }: { pct: number; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="h-[3px] bg-jgt-border relative overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-jgt-gold to-jgt-gold-light"
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : { width: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0, 1] }}
      />
    </div>
  );
}

export default function FilmBenefitsSection() {
  return (
    <section id="film-benefits" className="py-24 lg:py-32 bg-jgt-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,86,0.04)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-label">Why Premium Film Matters</span>
          <h2 className="font-display text-jgt-text mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            The Difference Quality Film Makes
          </h2>
          <p className="font-sans font-light text-jgt-muted max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            Not all window film is the same. Jason only installs professional-grade film from proven
            manufacturers — because the difference in performance is substantial.
          </p>
          <div className="w-12 h-[1px] bg-jgt-gold mx-auto mt-6" />
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.12 }}
              className="glass-light p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-jgt-text text-sm font-500 tracking-wide">{b.label}</span>
                <span className="font-display text-jgt-gold text-xl">{b.pct}%</span>
              </div>
              <BarMeter pct={b.pct} delay={0.2 + (i % 2) * 0.1} />
              <p className="font-sans text-jgt-muted text-xs leading-relaxed mt-3">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="font-sans text-jgt-muted text-sm mb-6">
            Jason uses only premium-grade film from manufacturers like 3M, Llumar, and Huper Optik.
            Ask about the right film for your application.
          </p>
          <a href="sms:9494968468" className="btn-gold text-xs px-8 py-4">
            Ask Jason About Film Options
          </a>
        </motion.div>
      </div>
    </section>
  );
}
