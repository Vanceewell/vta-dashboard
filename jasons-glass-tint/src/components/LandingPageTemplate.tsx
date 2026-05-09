'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import { fetchSiteImages, type SiteImageSlot } from '@/lib/siteImages';

export interface FAQ     { q: string; a: string; }
export interface LPProps {
  hero: {
    label:    string;
    headline: string;
    sub:      string;
    img:      string;       // default/fallback
    slot?:    SiteImageSlot; // Supabase override slot
  };
  intro:    string;
  sections: { heading: string; body: string }[];
  benefits: string[];
  faqs:     FAQ[];
  relatedLinks: { label: string; href: string }[];
}

export default function LandingPageTemplate({ hero, intro, sections, benefits, faqs, relatedLinks }: LPProps) {
  const [heroImgUrl, setHeroImgUrl] = useState(hero.img);

  useEffect(() => {
    if (!hero.slot) return;
    fetchSiteImages().then(({ urls }) => {
      if (urls[hero.slot!]) setHeroImgUrl(urls[hero.slot!]!);
    }).catch(() => {});
  }, [hero.slot]);

  return (
    <>
      <Navigation />

      {/* ── HERO ──── */}
      <section className="relative min-h-[70vh] flex items-end pb-20 lg:pb-28 overflow-hidden bg-jgt-black">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImgUrl}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="section-label">{hero.label}</span>
            <h1 className="font-display text-jgt-text mt-4 mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              {hero.headline}
            </h1>
            <p className="font-sans font-light text-jgt-muted max-w-2xl text-[0.95rem] leading-relaxed mb-8">
              {hero.sub}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="sms:9494968468" className="btn-gold text-xs px-8 py-4">Text Jason Now</a>
              <a href="tel:9494968468"  className="btn-outline text-xs px-8 py-4">Call (949) 496-8468</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO ─── */}
      <section className="py-16 bg-jgt-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display italic text-jgt-text text-xl lg:text-2xl leading-relaxed text-center"
          >
            {intro}
          </motion.p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─── */}
      <section className="py-24 bg-jgt-bg">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Content column */}
            <div className="lg:col-span-2 space-y-12">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <h2 className="font-display text-jgt-text text-2xl lg:text-3xl mb-4">{s.heading}</h2>
                  <div className="w-8 h-[1px] bg-jgt-gold mb-5" />
                  <p className="font-sans font-light text-jgt-muted text-sm leading-relaxed">{s.body}</p>
                </motion.div>
              ))}

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-light p-8"
              >
                <h3 className="font-display text-jgt-text text-2xl mb-6">Why Choose Jason's?</h3>
                <ul className="space-y-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A056" strokeWidth="2.5" className="mt-0.5 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="font-sans text-jgt-muted text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact card */}
              <div className="glass p-6">
                <h3 className="font-display text-jgt-text text-xl mb-4">Text Jason Directly</h3>
                <p className="font-sans text-jgt-muted text-xs leading-relaxed mb-5">
                  Text Jason directly for the fastest response. He'll reply personally with a recommendation and price.
                </p>
                <a href="sms:9494968468" className="btn-gold w-full justify-center text-xs py-3 mb-3">Text Jason</a>
                <a href="tel:9494968468" className="btn-outline w-full justify-center text-xs py-3">Call (949) 496-8468</a>
                <div className="mt-4 pt-4 border-t border-jgt-border/30">
                  <p className="font-sans text-jgt-muted text-xs text-center">San Clemente, California</p>
                </div>
              </div>

              {/* Related pages */}
              <div className="glass-light p-6">
                <h4 className="font-sans text-xs tracking-[0.16em] uppercase text-jgt-gold mb-4">Related Services</h4>
                <ul className="space-y-2">
                  {relatedLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between font-sans text-xs text-jgt-muted hover:text-jgt-gold transition-colors cursor-pointer py-1">
                        {l.label}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──── */}
      <section className="py-24 bg-jgt-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-label">FAQ</span>
            <h2 className="font-display text-jgt-text mt-4 text-3xl lg:text-4xl">Frequently Asked Questions</h2>
            <div className="w-8 h-[1px] bg-jgt-gold mx-auto mt-5" />
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-light group"
              >
                <summary className="px-6 py-4 font-sans text-sm text-jgt-text font-500 cursor-pointer list-none flex items-center justify-between hover:text-jgt-gold transition-colors">
                  {faq.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"/></svg>
                </summary>
                <div className="px-6 pb-5">
                  <div className="w-full h-[1px] bg-jgt-border/40 mb-4" />
                  <p className="font-sans font-light text-jgt-muted text-sm leading-relaxed">{faq.a}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-jgt-black text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-jgt-text mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Ready to Get Started?
          </h2>
          <p className="font-sans text-jgt-muted text-sm mb-8">
            Text Jason directly — no forms, no call centers, just a real response from the person doing your install.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="sms:9494968468" className="btn-gold text-xs px-10 py-4">Text Jason Now</a>
            <Link href="/" className="btn-outline text-xs px-10 py-4">← Back to Home</Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </>
  );
}
