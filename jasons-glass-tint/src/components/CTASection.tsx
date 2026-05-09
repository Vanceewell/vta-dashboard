'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSiteImages } from '@/lib/siteImages';

const CTA_BG_DEFAULT = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80';

export default function CTASection() {
  const [bgUrl, setBgUrl] = useState(CTA_BG_DEFAULT);

  useEffect(() => {
    fetchSiteImages().then(({ urls }) => {
      if (urls.ctaBackground) setBgUrl(urls.ctaBackground);
    }).catch(() => {});
  }, []);

  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden bg-jgt-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-jgt-navy/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,86,0.08),transparent_70%)]" />

      {/* Gold line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-jgt-gold" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Ready to Start?</span>

          <h2
            className="font-display text-jgt-text mt-6 mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Premium Tint. Installed Right.
            <br />
            <em className="text-jgt-gold">The First Time.</em>
          </h2>

          <p className="font-sans font-light text-jgt-muted max-w-xl mx-auto mb-10 text-[0.95rem] leading-relaxed">
            Honest pricing. Premium film. Installed personally by Jason — no subcontractors,
            no surprises, no shortcuts. San Clemente's most trusted tint installer since 1989.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="sms:9494968468" className="btn-gold text-xs px-10 py-4 w-full sm:w-auto justify-center">
              <PhoneIcon />
              Text Jason Now
            </a>
            <a href="tel:9494968468" className="btn-outline text-xs px-10 py-4 w-full sm:w-auto justify-center">
              Call (949) 496-8468
            </a>
          </div>

          {/* Micro-commitments */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-10 border-t border-white/10">
            {['No Subcontractors', 'Free Consultation', 'Manufacturer Warranty', 'Serving Since 1989'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A056" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="font-sans text-jgt-muted text-xs">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
