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

/* ─── Slider groups ─────────────────────────────────────────── */
const SIZE_SLIDERS: { key: keyof HeroConfig; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: 'gapSanClementeLogo',  label: 'San Clemente → Logo gap',    min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapLogoSince',        label: 'Logo → Since 1989 gap',      min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapSinceParagraph',   label: 'Since 1989 → Paragraph gap', min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapParagraphButtons', label: 'Paragraph → Buttons gap',    min: 0,   max: 120, step: 1,  unit: 'px' },
  { key: 'gapButtonsStats',     label: 'Buttons → Stats gap',        min: 0,   max: 160, step: 1,  unit: 'px' },
  { key: 'logoWidth',           label: 'Logo max-width',             min: 100, max: 900, step: 10, unit: 'px' },
];

const Y_SLIDERS: { key: keyof HeroConfig; label: string }[] = [
  { key: 'yOffsetSanClemente', label: 'San Clemente' },
  { key: 'yOffsetLogo',        label: 'Logo'         },
  { key: 'yOffsetSince',       label: 'Since 1989'   },
  { key: 'yOffsetParagraph',   label: 'Paragraph'    },
  { key: 'yOffsetButtons',     label: 'Button Row'   },
  { key: 'yOffsetStats',       label: 'Stats Row'    },
];
const Y_MIN = -200;
const Y_MAX =  200;

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminHeroLayout() {
  const [cfg, setCfg] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setCfg(loadHeroConfig()); }, []);

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

      {/* ── Top bar ── */}
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
            style={{ background: saved ? '#22c55e' : '#C5A056', color: '#0a0a0a' }}
          >
            {saved ? '✓ Saved' : 'Save Layout to This Browser'}
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-white/5 border-b border-white/10 px-5 py-2">
        <p className="text-[11px] text-white/40">
          💾 These layout settings are saved only on this browser. The homepage will reflect your saved values when you visit it here.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── Controls panel ── */}
        <div
          className="lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto border-r border-white/10"
          style={{ background: '#111' }}
        >

          {/* ── Section 1: Scale / Size ── */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Scale / Size</span>
              <span className="text-[9px] text-white/20 font-mono">(gap & logo width)</span>
            </div>
            <div className="space-y-6">
              {SIZE_SLIDERS.map(({ key, label, min, max, step, unit }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] text-white/70 font-sans">{label}</label>
                    <span className="font-mono text-[13px] text-yellow-400 tabular-nums">
                      {cfg[key]}{unit}
                    </span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={step} value={cfg[key]}
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
          </div>

          {/* ── Section 2: Move Up / Down ── */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Move Up / Down</span>
              <span className="text-[9px] text-white/20 font-mono">(Y position only)</span>
            </div>
            <p className="text-[10px] text-white/25 mb-5 leading-relaxed">
              Shifts each element independently. Does not affect spacing or other elements.
            </p>
            <div className="space-y-6">
              {Y_SLIDERS.map(({ key, label }) => {
                const val = cfg[key] as number;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[12px] text-white/70 font-sans">{label}</label>
                      <span
                        className="font-mono text-[13px] tabular-nums"
                        style={{ color: val === 0 ? 'rgba(255,255,255,0.3)' : val < 0 ? '#60a5fa' : '#f87171' }}
                      >
                        {val > 0 ? `+${val}` : val}px
                      </span>
                    </div>
                    <input
                      type="range" min={Y_MIN} max={Y_MAX} step={1} value={val}
                      onChange={(e) => update(key, Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: val === 0 ? '#555' : val < 0 ? '#60a5fa' : '#f87171', height: '6px' }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-blue-400/40">↑ {Math.abs(Y_MIN)}px up</span>
                      <span className="text-[10px] text-white/20">0</span>
                      <span className="text-[10px] text-red-400/40">{Y_MAX}px down ↓</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save tip */}
            <div className="mt-8 p-3 border border-yellow-400/20 rounded bg-yellow-400/5">
              <p className="text-[10px] text-yellow-400/70 leading-relaxed">
                Adjust sliders — the preview updates instantly.
                Hit <strong>Save Layout to This Browser</strong> to persist.
                The homepage in this browser will show your saved layout.
              </p>
            </div>
          </div>

        </div>

        {/* ── Live preview ── */}
        <div className="flex-1 relative" style={{ minHeight: '600px' }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">Live Preview</span>
          </div>
          <div className="w-full h-full overflow-hidden">
            <HeroSection config={cfg} />
          </div>
        </div>

      </div>
    </div>
  );
}
