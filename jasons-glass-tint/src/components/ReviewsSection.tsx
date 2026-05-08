'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AI-EDITABLE: reviews
const REVIEWS = [
  {
    name:     'Mark T.',
    location: 'San Clemente, CA',
    stars:    5,
    date:     'November 2024',
    text:     "I've had my cars tinted at a few different places over the years, but Jason is on a completely different level. He took his time, explained exactly what film he was using and why, and the install came out absolutely perfect — no bubbles, no edges lifting, factory-clean look. This is the only place I'll go from now on.",
    service:  'Automotive Tint',
  },
  {
    name:     'Sarah K.',
    location: 'Talega, CA',
    stars:    5,
    date:     'September 2024',
    text:     "We had Jason tint the west-facing windows throughout our home in Talega. The difference is remarkable — the living room stays so much cooler in the afternoon and our floors have stopped fading. He was incredibly easy to work with, the pricing was honest, and the results look beautiful. Highly recommend.",
    service:  'Residential Tint',
  },
  {
    name:     'David M.',
    location: 'Dana Point, CA',
    stars:    5,
    date:     'July 2024',
    text:     "Jason did the tint on my Porsche 911 and I couldn't be happier. He spent extra time making sure the rear window came out perfectly — which I know isn't easy. Zero shortcuts. He clearly cares about his work in a way that most service people just don't anymore. Worth every dollar.",
    service:  'Automotive Tint',
  },
  {
    name:     'Jennifer L.',
    location: 'San Juan Capistrano, CA',
    stars:    5,
    date:     'May 2024',
    text:     "We've used Jason for two homes now — our previous house in San Clemente and now our place in SJC. Every time, it's the same experience: he shows up on time, he's professional, the work is pristine, and he doesn't try to oversell you. Honest, skilled, and local. That's all you really want.",
    service:  'Residential Tint',
  },
  {
    name:     'Robert C.',
    location: 'San Clemente, CA',
    stars:    5,
    date:     'February 2024',
    text:     "Had Jason do the commercial tint on our new office building on El Camino Real. He handled every window himself — no rushing, no shortcuts. The solar control film has genuinely cut our cooling costs and the building looks more polished. Several neighboring businesses have already asked who did the work.",
    service:  'Commercial Tint',
  },
  {
    name:     'Mike P.',
    location: 'Dana Point, CA',
    stars:    5,
    date:     'March 2024',
    text:     "Jason tinted the cabin windows on my 34-foot sport fisher and the results are exceptional. Marine installations are tricky — curved glass, irregular shapes — but you'd never know it looking at his work. Smooth, clean, and holding up perfectly after months of sun and salt spray.",
    service:  'Marine Tint',
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C5A056" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((p) => (p + 1) % REVIEWS.length), []);
  const prev = useCallback(() => setIdx((p) => (p - 1 + REVIEWS.length) % REVIEWS.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const r = REVIEWS[idx];

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-jgt-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(197,160,86,0.04),transparent)]" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-label">What Customers Say</span>
          <h2 className="font-display text-jgt-text mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Trusted by San Clemente
          </h2>
          <div className="w-12 h-[1px] bg-jgt-gold mx-auto mt-6" />
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="glass p-8 lg:p-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <Stars n={r.stars} />
                <span className="font-sans text-jgt-muted text-xs">Verified Customer</span>
              </div>

              <blockquote className="font-display italic text-jgt-text leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
                "{r.text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-sans text-jgt-text text-sm font-500">{r.name}</div>
                  <div className="font-sans text-jgt-muted text-xs">{r.location} · {r.date}</div>
                </div>
                <div className="font-sans text-jgt-gold text-xs tracking-[0.14em] uppercase border border-jgt-gold/30 px-3 py-1">
                  {r.service}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 flex items-center justify-center glass-light hover:border-jgt-gold/50 transition-colors cursor-pointer" aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`transition-all duration-300 cursor-pointer ${i === idx ? 'w-6 h-1.5 bg-jgt-gold' : 'w-1.5 h-1.5 bg-jgt-border hover:bg-jgt-muted'}`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button onClick={next} className="w-10 h-10 flex items-center justify-center glass-light hover:border-jgt-gold/50 transition-colors cursor-pointer" aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
