'use client';
import { useState, useEffect, useCallback } from 'react';
import HeroSection from '@/components/HeroSection';
import {
  loadHeroConfig,
  saveHeroConfig,
  clearHeroConfig,
  DEFAULT_CONFIG,
  type HeroConfig,
} from '@/lib/heroConfig';

const SLIDERS: { key: keyof HeroConfig; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: 'gapSanClementeLogo',  label: 'San Clemente → Logo',   min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapLogoSince',        label: 'Logo → Since 1989',     min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapSinceParagraph',   label: 'Since 1989 → Paragraph',min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapParagraphButtons', label: 'Paragraph → Buttons',   min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapButtonsStats',     label: 'Buttons → Stats',       min: 0,   max: 160, step: 1,  unit: 'px' },
  { key: 'logoWidth',           label: 'Logo max-width',        min: 100, max: 900, step: 10, unit: 'px' },
];

export default function AdminHeroLayout() {
  const [cfg, setCfg] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

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
    clearHeroConfig();
    setCfg(DEFAULT_CONFIG);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Top bar */}
      <div
        className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10"
        style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest uppercase text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
            Admin
          </span>
          <span className="font-sans text-sm text-white/70">Hero Layout Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="text-[11px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors px-3 py-2"
          >
            ↗ View Homepage
          </a>
          <button
            onClick={handleReset}
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-[11px] tracking-widest uppercase rounded font-semibold transition-all"
            style={{
              background: saved ? '#22c55e' : '#C5A056',
              color: '#0a0a0a',
            }}
          >
            {saved ? '✓ Saved' : 'Save Layout to This Browser'}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2">
        <p className="text-[11px] text-white/40">
          💾 These layout settings are saved only on this browser. The live homepage will reflect your saved values when you visit it here.
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* Controls */}
        <div
          className="lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto p-6 border-r border-white/10"
          style={{ background: '#111' }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-6">Spacing Controls</p>

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
                  className="w-full cursor-pointer"
                  style={{ accentColor: '#C5A056', height: '6px' }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-white/20">{min}{unit}</span>
                  <span className="text-[10px] text-white/20">{max}{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Save reminder */}
          <div className="mt-8 p-3 border border-yellow-400/20 rounded bg-yellow-400/5">
            <p className="text-[10px] text-yellow-400/70 leading-relaxed">
              Drag sliders to adjust — the preview updates instantly.
              Hit <strong>Save Layout to This Browser</strong> to persist your settings.
              Visit the homepage in this same browser to see your saved layout.
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="flex-1 relative" style={{ minHeight: '600px' }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
              Live Preview
            </span>
          </div>
          <div className="w-full h-full overflow-hidden">
            <HeroSection config={cfg} />
          </div>
        </div>

      </div>
    </div>
  );
}
