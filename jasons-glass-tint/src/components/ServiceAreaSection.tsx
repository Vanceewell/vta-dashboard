'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

// AI-EDITABLE: service areas — 6 boxes, clean 3×2 grid
const AREAS = [
  {
    name:    'San Clemente',
    slug:    '/san-clemente-window-tint',
    desc:    "Home base. Jason has served San Clemente\u2019s residential, commercial, and automotive tinting needs since 1989. Local knowledge, community trust.",
    note:    'Primary Service Area',
  },
  {
    name:    'Talega',
    slug:    '/talega-window-tint',
    desc:    "Talega\u2019s hillside homes and coastal views deserve premium protection. Jason regularly serves Talega homeowners seeking energy efficiency and UV protection.",
    note:    'Residential Focus',
  },
  {
    name:    'Dana Point',
    slug:    '/dana-point-window-tint',
    desc:    "From the harbor to the bluffs, Dana Point presents unique coastal sun challenges. Jason covers automotive, residential, and marine tinting for Dana Point clients.",
    note:    'Marine & Automotive',
  },
  {
    name:    'San Juan Capistrano',
    slug:    '/san-juan-capistrano-window-tint',
    desc:    "San Juan Capistrano\u2019s mix of historic properties and modern homes benefit from professional tint. Jason serves both residential and commercial clients here.",
    note:    'Residential & Commercial',
  },
  {
    name:    'Ladera Ranch',
    slug:    '/ladera-ranch-window-tint',
    desc:    "Ladera Ranch\u2019s newer communities and well-maintained homes are a natural fit for premium residential and automotive window film. Jason serves the area directly.",
    note:    'Residential & Automotive',
  },
  {
    name:    'Camp Pendleton',
    slug:    '/camp-pendleton-window-tint',
    desc:    "Jason proudly serves the Marines and military families at Camp Pendleton. Straightforward pricing, no runaround, and quality work done right \u2014 every time.",
    note:    'Military Welcome',
  },
];

export default function ServiceAreaSection() {
  return (
    <section id="service-areas" className="py-24 lg:py-32 bg-jgt-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="section-label">Where We Serve</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mt-4 gap-4">
            <h2 className="font-display text-jgt-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Window Tinting in San Clemente
              <br />
              <em className="text-jgt-gold">& South Orange County</em>
            </h2>
          </div>
          <div className="w-12 h-[1px] bg-jgt-gold mt-6" />

          <p className="font-sans font-light text-jgt-muted max-w-2xl mt-6 text-sm leading-relaxed">
            Jason's Glass Tint is based in San Clemente and serves the surrounding South Orange
            County communities. Because Jason works alone, he keeps his service area focused —
            which means every client gets the same level of personal attention and care.
          </p>
        </motion.div>

        {/* Area Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {AREAS.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            >
              <Link
                href={area.slug}
                className="block glass-light p-6 group hover:border-jgt-gold/30 transition-all duration-300 h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-jgt-text text-xl group-hover:text-jgt-gold transition-colors">
                    {area.name}
                  </h3>
                  <MapPinIcon />
                </div>
                <span className="inline-block font-sans text-[10px] tracking-[0.18em] uppercase text-jgt-gold border border-jgt-gold/30 px-2 py-0.5 mb-3">
                  {area.note}
                </span>
                <p className="font-sans text-jgt-muted text-xs leading-relaxed">{area.desc}</p>
                <div className="mt-4 flex items-center gap-2 font-sans text-xs tracking-[0.14em] uppercase text-jgt-gold group-hover:gap-3 transition-all">
                  Learn More
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* SEO text block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid lg:grid-cols-2 gap-12"
        >
          <div>
            <h3 className="font-display text-jgt-text text-2xl mb-4">San Clemente's Window Tinting Expert</h3>
            <p className="font-sans font-light text-jgt-muted text-sm leading-relaxed">
              For over 40 years, Jason's Glass Tint has been San Clemente's go-to source for
              professional window film installation. Whether you need automotive tint for your
              daily driver, residential film for your ocean-view home, or commercial tinting
              for a business on El Camino Real, Jason delivers results that last.
            </p>
          </div>
          <div>
            <h3 className="font-display text-jgt-text text-2xl mb-4">South Orange County's Coastal Window Tinting</h3>
            <p className="font-sans font-light text-jgt-muted text-sm leading-relaxed">
              Living near the ocean means intense UV exposure, glare off the water, and salt-air
              conditions that demand quality film. Jason understands the specific challenges of
              coastal Southern California living and brings the right solution to every project
              in Talega, Dana Point, San Juan Capistrano, and beyond.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-jgt-gold flex-shrink-0">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
