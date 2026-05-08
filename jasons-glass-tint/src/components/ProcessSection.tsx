'use client';
import { motion } from 'framer-motion';

// AI-EDITABLE: process steps
const STEPS = [
  {
    num:  '01',
    title: 'Text Jason',
    desc:  'Send a quick text to (949) 496-8468. Describe your project — car, home, boat, or commercial — and Jason will respond personally.',
    icon:  <PhoneIcon />,
  },
  {
    num:  '02',
    title: 'Expert Recommendation',
    desc:  "Jason will recommend the right film for your specific situation — goals, budget, and California regulations all considered. No one-size-fits-all upsells.",
    icon:  <ChatIcon />,
  },
  {
    num:  '03',
    title: 'Schedule Installation',
    desc:  "Pick a time that works for you. Jason arrives on time, prepared. Most automotive installs complete in 2–4 hours; residential and commercial vary.",
    icon:  <CalendarIcon />,
  },
  {
    num:  '04',
    title: 'Enjoy the Results',
    desc:  'Your install is backed by a manufacturer warranty and Jason\'s personal guarantee. If anything isn\'t right, he makes it right. Simple as that.',
    icon:  <CheckIcon />,
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 lg:py-32 bg-jgt-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-label">How It Works</span>
          <h2 className="font-display text-jgt-text mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Simple, Personal, Direct
          </h2>
          <p className="font-sans font-light text-jgt-muted max-w-xl mx-auto mt-4 text-sm leading-relaxed">
            No online forms, no call centers, no waiting. Text Jason and get a real response from
            the person who will install your film.
          </p>
          <div className="w-12 h-[1px] bg-jgt-gold mx-auto mt-6" />
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-jgt-border to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.14 }}
              className="text-center px-4"
            >
              {/* Number + Icon */}
              <div className="relative inline-flex flex-col items-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center glass-light mb-1 relative z-10">
                  <div className="text-jgt-gold">{step.icon}</div>
                </div>
                <span className="font-display text-jgt-gold/30 text-5xl absolute -top-3 right-0 leading-none pointer-events-none select-none">
                  {step.num}
                </span>
              </div>

              <h3 className="font-display text-jgt-text text-xl mb-3">{step.title}</h3>
              <p className="font-sans font-light text-jgt-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-14"
        >
          <a href="sms:9494968468" className="btn-gold text-xs px-10 py-4">
            Start with a Text
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function PhoneIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.95-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9A16 16 0 0 0 15.1 16.1l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function ChatIcon()     { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function CalendarIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function CheckIcon()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
