'use client';
import { useState, useEffect, useCallback } from 'react';
import HeroSection from '@/components/HeroSection';
import {
  loadHeroConfig,
  saveHeroConfig,
  DEFAULT_CONFIG,
  type HeroConfig,
} from '@/lib/heroConfig';

/* ─── Slider config ─────────────────────────────────────────── */
interface SliderDef {
  key: keyof HeroConfig;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const SLIDERS: SliderDef[] = [
  { key: 'gapSanClementeLogo',  label: 'San Clemente → Logo gap',     min: 0, max: 120, step: 1, unit: 'px' },
  { key: 'gapLogoSince',        label: 'Logo → Since 1989 gap',        min: 0, max: 120, step: 1, unit: 'px' },
  { key: 'gapSinceParagraph',   label: 'Since 1989 → Paragraph gap',   min: 0, max: 120, step: 1, unit: 'px' },
  { key: 'gapParagraphButtons', label: 'Paragraph → Buttons gap',      min: 0, max: 120, step: 1, unit: 'px' },
  { key: 'gapButtonsStats',     label: 'Buttons → Stats gap',          min: 0, max: 160, step: 1, unit: 'px' },
  { key: 'logoWidth',           label: 'Logo max-width',               min: 100, max: 900, step: 10, unit: 'px' },
];

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminHeroLayout() {
  const [cfg, setCfg] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  // Load persisted config on mount
  useEffect(() => {
    setCfg(loadHeroConfig());
  }, []);

  const update = useCallback((key: keyof HeroConfig, value: number) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const handleSave = () => {
    saveHeroConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setCfg(DEFAULT_CONFIG);
    saveHeroConfig(DEFAULT_CONFIG);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b border-white/10"
        style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(8px)' }}
      >
        <div>
          <span className="font-mono text-[11px] tracking-widest uppercase text-yellow-400">
            Admin
          </span>
          <span className="ml-2 font-sans text-sm text-white/70">Hero Layout Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-[11px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            ← View Live Site
          </a>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[11px] tracking-widest uppercase rounded transition-all"
            style={{
              background: saved ? '#22c55e' : '#C5A056',
              color: saved ? 'white' : '#0a0a0a',
              fontWeight: 600,
            }}
          >
            {saved ? '✓ Saved' : 'Save Layout'}
          </button>
        </div>
      </div>

      {/* ── Body: controls + preview ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* Controls panel */}
        <div
          className="lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto p-6 border-r border-white/10"
          style={{ background: '#111' }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-6">
            Spacing Controls
          </p>

          <div className="space-y-7">
            {SLIDERS.map(({ key, label, min, max, step, unit }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] text-white/70 font-sans">{label}</label>
                  <span className="font-mono text-[13px] text-yellow-400 tabular-nums">
                    {cfg[key]}{unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={cfg[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                  style={{ height: '6px' }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-white/20">{min}{unit}</span>
                  <span className="text-[10px] text-white/20">{max}{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Config dump for reference */}
          <div className="mt-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">
              Current Config
            </p>
            <pre className="text-[10px] font-mono text-white/40 bg-white/5 rounded p-3 overflow-x-auto leading-relaxed">
              {JSON.stringify(cfg, null, 2)}
            </pre>
          </div>

          {/* Save reminder */}
          <div className="mt-6 p-3 border border-yellow-400/20 rounded bg-yellow-400/5">
            <p className="text-[10px] text-yellow-400/80 leading-relaxed">
              <strong>Remember:</strong> Changes only persist after clicking{' '}
              <strong>Save Layout</strong>. Saved values are stored in your browser and
              shown to all visitors on this device. Deploy the code to lock in defaults.
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/60 border border-white/10">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
              Live Preview
            </span>
          </div>
          {/* Scale the hero preview to fit the panel */}
          <div
            className="w-full h-full overflow-hidden"
            style={{ minHeight: '600px' }}
          >
            <HeroSection config={cfg} />
          </div>
        </div>

      </div>
    </div>
  );
}
