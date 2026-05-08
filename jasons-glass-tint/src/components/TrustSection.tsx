'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// AI-EDITABLE: trust stats
const STATS = [
  { value: 35,       suffix: '+',  label: 'Years Experience',          sub: 'Hands-on since 1989'               },
  { value: 100000,   suffix: '+',  label: 'Windows Tinted',            sub: 'Across San Clemente & OC'          },
  { value: 0,        suffix: '',   label: 'Subcontractors',            sub: 'Jason installs every job himself'   },
  { value: 100,      suffix: '%',  label: 'Premium Film',              sub: 'No cheap film, ever'                },
  { value: 1989,     suffix: '',   label: 'Serving Since',             sub: "San Clemente's trusted choice"      },
  { value: 1,        suffix: '',   label: 'Installer',                 sub: 'No rotating crews, no surprises'   },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref               = useRef<HTMLSpanElement>(null);
  const inView            = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps    = 60;
    const step     = target / steps;
    let current    = 0;
    let frame      = 0;
    const timer = setInterval(() => {
      frame++;
      current = Math.min(target, Math.round(step * frame));
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target === 0
    ? 'Zero'
    : target >= 1000
      ? (count >= 1000 ? (count / 1000).toFixed(0) + 'K' : count.toString())
      : count.toString();

  return <span ref={ref}>{display}{target > 0 ? suffix : ''}</span>;
}

export default function TrustSection() {
  return (
    <section id="trust" className="py-24 lg:py-32 bg-jgt-surface relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,160,86,0.06),transparent)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-label">Why Jason's Glass Tint</span>
          <h2 className="font-display text-jgt-text mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            The Numbers Speak for Themselves
          </h2>
          <div className="w-12 h-[1px] bg-jgt-gold mx-auto mt-6" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-light p-8 text-center group hover:border-jgt-gold/30 transition-all duration-300"
            >
              <div
                className="font-display font-light text-jgt-gold leading-none mb-3"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-sans text-jgt-text text-sm tracking-wider uppercase font-500 mb-1">
                {stat.label}
              </div>
              <div className="font-sans text-jgt-muted text-xs leading-relaxed">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="font-display italic text-jgt-muted text-xl lg:text-2xl max-w-2xl mx-auto">
            "Premium film. Honest service. One town, one tint."
          </p>
          <div className="w-8 h-[1px] bg-jgt-gold mx-auto mt-6" />
        </motion.div>
      </div>
    </section>
  );
}
