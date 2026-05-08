'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroLogo from './HeroLogo';
import { DEFAULT_CONFIG, type HeroConfig } from '@/lib/heroConfig';

const LOGO_SRC = '/images/ChatGPT%20Image%20May%207%2C%202026%2C%2009_16_16%20PM.png';

/**
 * HeroSection — reads layout config from localStorage (written by /admin-hero-layout).
 * Falls back to DEFAULT_CONFIG for first-time visitors / SSR.
 * Accepts an optional `config` prop so the admin editor can pass live values
 * and render a real-time preview without touching localStorage.
 */
export default function HeroSection({ config: propConfig }: { config?: HeroConfig }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY   = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const fade  = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // DEFAULT_CONFIG is baked into the build at deploy time — same for all visitors.
  // The admin editor passes propConfig for live preview only.
  const layout = propConfig ?? DEFAULT_CONFIG;

  // Clamp helper: mobile value ≈ 60% of desktop value
  const mb = (desktop: number) => `clamp(${Math.round(desktop * 0.60)}px, ${(desktop / 10).toFixed(1)}vw, ${desktop}px)`;

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
        className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
        style={{ y: textY, opacity: fade }}
      >
        <div className="flex flex-col items-center">

          {/* 1. San Clemente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: mb(layout.gapSanClementeLogo) }}
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-[1px] bg-jgt-gold/60" />
              <span
                className="font-display font-light text-jgt-gold tracking-wide"
                style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)' }}
              >
                San Clemente
              </span>
              <div className="w-8 h-[1px] bg-jgt-gold/60" />
            </div>
          </motion.div>

          {/* 2. Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="relative w-full mx-auto"
            style={{
              maxWidth: `${layout.logoWidth}px`,
              marginBottom: mb(layout.gapLogoSince),
            }}
          >
            <HeroLogoImage />
          </motion.div>

          {/* 3. Since 1989 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="font-display italic font-light text-jgt-gold/90"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              marginBottom: mb(layout.gapSinceParagraph),
            }}
          >
            Since 1989
          </motion.p>

          {/* 4. Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-sans font-light text-jgt-muted max-w-2xl mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
              marginBottom: mb(layout.gapParagraphButtons),
            }}
          >
            Premium window tint installation for automotive, residential, commercial, RV,
            marine, frost, and safety film projects throughout San Clemente and South Orange County.
          </motion.p>

          {/* 5. CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ marginBottom: mb(layout.gapButtonsStats) }}
          >
            <a href="sms:9494968468" className="btn-gold text-xs px-8 py-4 w-full sm:w-auto justify-center">
              <PhoneIcon />
              Text Jason Now
            </a>
            <a href="#gallery" className="btn-outline text-xs px-8 py-4 w-full sm:w-auto justify-center">
              View Projects
            </a>
          </motion.div>

          {/* 6. Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-5 border-t border-white/10 w-full"
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

        </div>
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

function HeroLogoImage() {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <HeroLogo
        className="w-full h-auto drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]"
        aria-label="Jason's Glass Tint"
      />
    );
  }
  return (
    <img
      src={LOGO_SRC}
      alt="Jason's Glass Tint"
      onError={() => setImgError(true)}
      className="w-full h-auto object-contain drop-shadow-[0_4px_40px_rgba(0,0,0,0.7)]"
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
      draggable={false}
    />
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
