'use client';
import { trackTextJasonClick } from '@/lib/gtag';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSiteImages } from '@/lib/siteImages';

const IMAGE_STORAGE_KEY = 'jgt_image_overrides_v1';
const ABOUT_PORTRAIT_DEFAULT = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80';

// AI-EDITABLE: about content
const COMMITMENTS = [
  { icon: <PersonalIcon />, title: 'Personally Installed',   desc: 'Jason handles every project himself — no handoffs, no surprises, no crew turnover.'   },
  { icon: <FilmIcon />,     title: 'Premium Film Only',      desc: 'Only top-tier film brands make the cut. No budget options, no compromises.'               },
  { icon: <PriceIcon />,    title: 'Honest Pricing',         desc: 'Straightforward quotes, no upsells, no hidden fees. The number you hear is the number you pay.' },
  { icon: <LocalIcon />,    title: 'Local & Accessible',     desc: "San Clemente is where Jason lives, works, and takes pride. He's always reachable — directly." },
];

export default function AboutSection() {
  const [portraitSrc, setPortraitSrc] = useState(ABOUT_PORTRAIT_DEFAULT);
  useEffect(() => {
    // Try Supabase first
    fetchSiteImages().then(({ urls }) => {
      if (urls['aboutPortrait']) {
        setPortraitSrc(urls['aboutPortrait']);
        return;
      }
      // Fall back to legacy localStorage
      try {
        const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
        if (raw) {
          const overrides = JSON.parse(raw) as Record<string, string>;
          if (overrides['about-portrait']) setPortraitSrc(overrides['about-portrait']);
        }
      } catch { /* ignore */ }
    }).catch(() => {
      // Supabase unavailable, try localStorage
      try {
        const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
        if (raw) {
          const overrides = JSON.parse(raw) as Record<string, string>;
          if (overrides['about-portrait']) setPortraitSrc(overrides['about-portrait']);
        }
      } catch { /* ignore */ }
    });
  }, []);
  return (
    <section id="about" className="py-24 lg:py-32 bg-jgt-surface relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(197,160,86,0.04),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Portrait area */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className="relative"
          >
            {/* Portrait placeholder */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${portraitSrc}')` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Year badge */}
            <div className="absolute -top-4 -right-4 lg:-right-8 glass p-6 text-center">
              <div className="font-display text-5xl text-jgt-gold font-light">1989</div>
              <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-jgt-muted mt-1">Est.</div>
            </div>

            {/* Gold corner accent */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-jgt-gold/50" />
          </motion.div>

          {/* Right — Story */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          >
            <span className="section-label">The Story Behind the Work</span>
            <h2
              className="font-display text-jgt-text mt-4 mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
            >
              Jason Installs Every Job
              <em className="text-jgt-gold"> Himself.</em>
            </h2>

            <div className="space-y-5 font-sans font-light text-jgt-muted leading-relaxed text-[0.95rem]">
              <p>
                Jason started tinting windows in high school — not as a job, but as a craft. Over
                40 years later, he still approaches every installation with the same obsessive
                attention to detail he had on day one.
              </p>
              <p>
                Unlike larger shops with rotating crews and upsell-driven counter staff, Jason keeps
                his operation deliberately small. That means{' '}
                <span className="text-jgt-text font-400">
                  you get Jason — every time. Not a new hire. Not a subcontractor.
                </span>
                {' '}The person you talk to on the phone is the person installing your film.
              </p>
              <p>
                Over four decades, he's tinted more than 100,000 windows across
                San Clemente and South Orange County. Cars, homes, commercial buildings, boats,
                RVs — Jason has done it all, and he's done it right.
              </p>
              <p>
                San Clemente is more than just a service area. It's home. That means Jason's
                reputation lives or dies on every single job, and he treats it that way.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="mt-8 border-l-2 border-jgt-gold pl-6">
              <p className="font-display italic text-jgt-text text-lg lg:text-xl leading-relaxed">
                “Anybody can sell window tint. The difference is who’s installing it.”
              </p>
              <footer className="mt-3 font-sans text-xs tracking-[0.14em] uppercase text-jgt-gold">
                — Jason, Owner & Installer
              </footer>
            </blockquote>

            <a href="sms:9494968468" onClick={() => trackTextJasonClick('about_section')} className="btn-gold inline-flex mt-10 text-xs px-8 py-4">
              <PhoneIcon />
              Text Jason Directly
            </a>
          </motion.div>
        </div>

        {/* Commitment Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          {COMMITMENTS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-light p-6"
            >
              <div className="text-jgt-gold mb-4">{c.icon}</div>
              <h4 className="font-sans text-jgt-text text-sm font-500 tracking-wide mb-2">{c.title}</h4>
              <p className="font-sans text-jgt-muted text-xs leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonalIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function FilmIcon()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>; }
function PriceIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function LocalIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function PhoneIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
