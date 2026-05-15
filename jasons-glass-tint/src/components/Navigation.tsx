'use client';
import { trackTextJasonClick, trackPhoneCallClick } from '@/lib/gtag';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Services',   href: '#services'   },
  { label: 'About',      href: '#about'       },
  { label: 'Gallery',    href: '#gallery'     },
  { label: 'Reviews',    href: '#reviews'     },
  { label: 'Service Areas', href: '#service-areas' },
];

export default function Navigation() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-[0_4px_32px_rgba(0,0,0,0.5)]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group">
              <span className="font-display text-jgt-text text-lg lg:text-xl tracking-wide transition-colors group-hover:text-jgt-gold">
                Jason's Glass Tint
              </span>
              <span className="font-sans text-jgt-gold text-[10px] tracking-[0.22em] uppercase">
                Trusted Since 1989
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-sans text-xs tracking-[0.14em] uppercase text-jgt-muted hover:text-jgt-text transition-colors duration-200 cursor-pointer"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:9494968468" onClick={() => trackPhoneCallClick('navigation')} className="font-sans text-xs tracking-wider text-jgt-muted hover:text-jgt-text transition-colors">
                (949) 496-8468
              </a>
              <a href="sms:9494968468" onClick={() => trackTextJasonClick('navigation')} className="btn-gold text-xs px-6 py-3">
                <PhoneIcon />
                Text Jason
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-[1.5px] bg-jgt-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-jgt-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[1.5px] bg-jgt-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 glass flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="font-display text-3xl text-jgt-text hover:text-jgt-gold transition-colors cursor-pointer"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="sms:9494968468"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="btn-gold mt-4"
              onClick={() => { setMenuOpen(false); trackTextJasonClick('mobile_menu'); }}
            >
              Text Jason Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
