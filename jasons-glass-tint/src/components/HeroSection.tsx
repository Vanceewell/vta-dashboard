'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroLogo from './HeroLogo';

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const fade  = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-jgt-black"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          y: bgY,
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')`,
        }}
      />

      {/* Dark overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Subtle gold vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,86,0.04)_0%,transparent_70%)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: textY, opacity: fade }}
      >
        {/* Location badge — more prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-[1px] bg-jgt-gold/60" />
            <span className="font-display font-light text-jgt-gold tracking-wide" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.5rem)' }}>San Clemente</span>
            <div className="w-8 h-[1px] bg-jgt-gold/60" />
          </div>
        </motion.div>

        {/* Main headline — stacked SVG logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0, 1] }}
          className="relative w-full mx-auto mb-2"
          style={{ maxWidth: 'clamp(260px, 62vw, 680px)' }}
          aria-label="Jason's Glass Tint"
        >
          <HeroLogo className="w-full h-auto drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="font-display italic font-light text-jgt-gold/90 mb-6"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
        >
          Since 1989
        </motion.p>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans font-light text-jgt-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)' }}
        >
          Premium window tint installation for automotive, residential, commercial, RV,
          marine, frost, and safety film projects throughout San Clemente and South Orange County.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="sms:9494968468" className="btn-gold text-xs px-8 py-4 w-full sm:w-auto justify-center">
            <PhoneIcon />
            Text Jason Now
          </a>
          <a href="#gallery" className="btn-outline text-xs px-8 py-4 w-full sm:w-auto justify-center">
            View Projects
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/10"
        >
          {[
            { value: '40+',     label: 'Years Experience' },
            { value: '100K+',   label: 'Windows Tinted'   },
            { value: 'Zero',    label: 'Subcontractors'   },
            { value: 'Premium', label: 'Film Only'         },
          ].map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="font-display text-2xl text-jgt-gold">{stat.value}</div>
              <div className="font-sans text-[10px] tracking-[0.18em] uppercase text-jgt-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-jgt-muted/60">Scroll</span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-jgt-gold/50 to-transparent"
          animate={{ scaleY: [1, 0.4, 1], transformOrigin: 'top' }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

// Chat bubble icon — modern SMS/text feel
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
