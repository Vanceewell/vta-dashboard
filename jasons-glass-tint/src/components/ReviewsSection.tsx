'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AI-EDITABLE: reviews
const REVIEWS = [
  {
    name:     'Brandon C.',
    location: 'San Clemente, CA',
    stars:    5,
    text:     "We have had 3 of our cars' tint done by Jason, and every single one has been perfectly done. Jason is a true professional and we won't go anywhere else for our tint!",
  },
  {
    name:     'Zack J.',
    location: 'San Clemente, CA',
    stars:    5,
    text:     'Amazing in every way! Thank you, Jason for the communication and quality work! I will never go anywhere else',
  },
  {
    name:     'Rob M.',
    location: 'Glendale, CA',
    stars:    5,
    text:     "Never had any tinting done before but I'm happy with the UV protection and looks. Jason is a solid self made, positive guy, and a good communicator.",
  },
  {
    name:     'Kevin S.',
    location: 'San Clemente, CA',
    stars:    5,
    text:     'Jason tinted front 2 windows on my Tesla. Super clean job, quick. Jason is also a great person, I enjoyed talking to him whilst he was installing the window tints. Thanks',
  },
  {
    name:     'Marla C.',
    location: 'Mission Viejo, CA',
    stars:    5,
    text:     'Jason did a great job! Super fast response and turnaround. My sister has brought several cars to him and recommended to me. Highly recommend!!',
  },
  {
    name:     'Jessica G.',
    location: 'Laguna Beach, CA',
    stars:    5,
    text:     'Highly recommend. Jason tinted our corporate conference room that gets a lot of sun. These are exterior facing, floor-to-ceiling windows. He had great attention to detail, no visible seams, and the product he used was top of the line. We noticed an immediate difference in the temperature of the conference room. It was important because it\'s the space in our office that our business partners use and see the most. I have recommended him to friends after seeing his work. Very pleased!',
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
                  <div className="font-sans text-jgt-muted text-xs">{r.location}</div>
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
