'use client';
import { trackTextJasonClick } from '@/lib/gtag';
import { motion } from 'framer-motion';

// AI-EDITABLE: film benefits data
const BENEFITS = [
  { label: 'Heat Rejection', desc: 'Reject much of the sun\'s heat for a dramatically cooler interior.' },
  { label: 'UV Protection', desc: 'Block 99.9% of harmful UV rays — the leading cause of interior fade and skin damage.' },
  { label: 'Interior Protection', desc: 'Protect leather, plastics, and upholstery from sun-related cracking and discoloration.' },
  { label: 'Glare Reduction', desc: 'Reduce eye strain and improve visibility on Southern California\'s bright coastal roads.' },
  { label: 'Privacy & Security', desc: 'Premium tint adds a discreet layer of privacy without compromising outward visibility.' },
  { label: 'Energy Efficiency', desc: 'Reduce A/C load in vehicles and reduce HVAC costs in homes and commercial buildings.' },
  { label: 'Appearance', desc: 'A clean, factory-look tint finish transforms the entire look of any vehicle or building.' },
  { label: 'Safety Film Strength', desc: 'Shatter-resistant safety film holds glass together on impact, protecting occupants.' },
];

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
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-[1px] bg-jgt-gold" />
                <span className="font-sans text-jgt-text text-sm font-500 tracking-wide">{b.label}</span>
              </div>
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
            Jason uses only premium-grade film from Madico Window Film.
            Ask about the right film for your application.
          </p>
          <a href="sms:9494968468" onClick={() => trackTextJasonClick('film_benefits')} className="btn-gold text-xs px-8 py-4">
            Ask Jason About Film Options
          </a>
        </motion.div>
      </div>
    </section>
  );
}
