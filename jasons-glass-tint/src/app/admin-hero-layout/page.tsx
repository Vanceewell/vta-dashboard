'use client';
import { useState, useEffect, useCallback } from 'react';
import HeroSection from '@/components/HeroSection';
import {
  loadPreviewConfig,
  savePreviewConfig,
  clearPreviewConfig,
  DEFAULT_CONFIG,
  type HeroConfig,
} from '@/lib/heroConfig';

/* ─── Slider definitions ────────────────────────────────────── */
interface SliderDef {
  key: keyof HeroConfig;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const SLIDERS: SliderDef[] = [
  { key: 'gapSanClementeLogo',  label: 'San Clemente → Logo',     min: 0, max: 120, step: 1,  unit: 'px' },
  { key: 'gapLogoSince',        label: 'Logo → Since 1989',        min: 0, max: 120, step: 1,  unit: 'px' },
  { key: 'gapSinceParagraph',   label: 'Since 1989 → Paragraph',   min: 0, max: 120, step: 1,  unit: 'px' },
  { key: 'gapParagraphButtons', label: 'Paragraph → Buttons',      min: 0, max: 120, step: 1,  unit: 'px' },
  { key: 'gapButtonsStats',     label: 'Buttons → Stats',          min: 0, max: 160, step: 1,  unit: 'px' },
  { key: 'logoWidth',           label: 'Logo max-width',           min: 100, max: 900, step: 10, unit: 'px' },
];

type SaveState = 'idle' | 'saving' | 'success' | 'error';

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminHeroLayout() {
  const [cfg, setCfg] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [publishedCfg, setPublishedCfg] = useState<HeroConfig>(DEFAULT_CONFIG);
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // On mount: load any saved preview from localStorage, and record what's
  // currently published (= DEFAULT_CONFIG baked into the build)
  useEffect(() => {
    const preview = loadPreviewConfig();
    setCfg(preview);
    setPublishedCfg(DEFAULT_CONFIG);
    // If preview differs from published, mark dirty
    setIsDirty(JSON.stringify(preview) !== JSON.stringify(DEFAULT_CONFIG));
  }, []);

  const update = useCallback((key: keyof HeroConfig, value: number) => {
    setCfg((prev) => {
      const next = { ...prev, [key]: value };
      savePreviewConfig(next); // temp preview only
      return next;
    });
    setIsDirty(true);
    setSaveState('idle');
  }, []);

  // Permanently publish: call API → patches heroConfig.ts → git push → Vercel rebuild
  const handlePublish = async () => {
    setSaveState('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/api/save-hero-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setPublishedCfg(cfg);
      clearPreviewConfig();
      setIsDirty(false);
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 4000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setSaveState('error');
    }
  };

  const handleReset = () => {
    setCfg(DEFAULT_CONFIG);
    savePreviewConfig(DEFAULT_CONFIG);
    setIsDirty(JSON.stringify(DEFAULT_CONFIG) !== JSON.stringify(publishedCfg));
    setSaveState('idle');
  };

  const handleDiscardPreview = () => {
    setCfg(publishedCfg);
    clearPreviewConfig();
    setIsDirty(false);
    setSaveState('idle');
  };

  const saveLabel = () => {
    if (saveState === 'saving') return '⏳ Saving & Deploying…';
    if (saveState === 'success') return '✓ Deployed Live';
    if (saveState === 'error') return '✗ Failed — see below';
    return '🚀 Save & Deploy Live';
  };

  const saveBg = () => {
    if (saveState === 'saving') return '#555';
    if (saveState === 'success') return '#22c55e';
    if (saveState === 'error') return '#ef4444';
    return '#C5A056';
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
          {isDirty && (
            <span className="text-[10px] font-mono text-orange-400 bg-orange-400/10 px-2 py-1 rounded">
              UNSAVED PREVIEW
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/"
            target="_blank"
            className="text-[11px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors px-3 py-2"
          >
            ↗ View Live
          </a>
          {isDirty && (
            <button
              onClick={handleDiscardPreview}
              className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/50 hover:border-white/40 hover:text-white/80 transition-colors rounded"
            >
              Discard Preview
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-2 text-[11px] tracking-widest uppercase border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-colors rounded"
          >
            Reset Default
          </button>
          <button
            onClick={handlePublish}
            disabled={saveState === 'saving'}
            className="px-5 py-2 text-[11px] tracking-widest uppercase rounded font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: saveBg(), color: saveState === 'idle' ? '#0a0a0a' : 'white' }}
          >
            {saveLabel()}
          </button>
        </div>
      </div>

      {/* ── Status banners ── */}
      {saveState === 'success' && (
        <div className="bg-green-900/40 border-b border-green-500/30 px-5 py-3 text-[12px] text-green-400">
          ✅ <strong>Permanently deployed.</strong> heroConfig.ts was updated, committed, and pushed to GitHub.
          Vercel is rebuilding now — the live site will update in ~1 minute for all visitors.
        </div>
      )}
      {saveState === 'error' && (
        <div className="bg-red-900/40 border-b border-red-500/30 px-5 py-3 text-[12px] text-red-400">
          ❌ <strong>Deploy failed:</strong> {errorMsg}
          <span className="ml-2 text-red-300/60">
            (This usually means the API route is running on Vercel where git isn&apos;t available.
            Run the dev server locally: <code className="bg-black/30 px-1 rounded">npm run dev</code> then retry.)
          </span>
        </div>
      )}
      {isDirty && saveState === 'idle' && (
        <div className="bg-orange-900/30 border-b border-orange-500/20 px-5 py-3 text-[12px] text-orange-300">
          👁 <strong>Preview only</strong> — you are seeing temporary adjustments in your browser.
          Public visitors still see the last deployed layout.
          Press <strong>&quot;Save &amp; Deploy Live&quot;</strong> to make it permanent for everyone.
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── Controls panel ── */}
        <div
          className="lg:w-80 xl:w-96 flex-shrink-0 overflow-y-auto p-6 border-r border-white/10"
          style={{ background: '#111' }}
        >
          {/* Currently published values */}
          <div className="mb-7 p-3 border border-white/10 rounded bg-white/5">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Currently Live (for all visitors)</p>
            <div className="space-y-1">
              {SLIDERS.map(({ key, label, unit }) => (
                <div key={key} className="flex justify-between text-[11px]">
                  <span className="text-white/40">{label}</span>
                  <span className="font-mono text-green-400">{publishedCfg[key]}{unit}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-5">
            Adjust Spacing
          </p>

          <div className="space-y-7">
            {SLIDERS.map(({ key, label, min, max, step, unit }) => {
              const changed = cfg[key] !== publishedCfg[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-sans" style={{ color: changed ? '#fbbf24' : 'rgba(255,255,255,0.7)' }}>
                      {label}
                      {changed && <span className="ml-1 text-[9px] text-orange-400">●</span>}
                    </label>
                    <span className="font-mono text-[13px] tabular-nums" style={{ color: changed ? '#fbbf24' : 'rgba(255,255,255,0.5)' }}>
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
                    style={{ accentColor: changed ? '#fbbf24' : '#C5A056', height: '6px' }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-white/20">{min}{unit}</span>
                    <span className="text-[10px] text-white/20">{max}{unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Config JSON */}
          <div className="mt-10">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">Config JSON</p>
            <pre className="text-[10px] font-mono text-white/40 bg-white/5 rounded p-3 overflow-x-auto leading-relaxed">
              {JSON.stringify(cfg, null, 2)}
            </pre>
          </div>

          {/* How it works */}
          <div className="mt-6 p-3 border border-white/10 rounded bg-white/5 space-y-2">
            <p className="text-[10px] text-white/50 font-semibold uppercase tracking-widest">How it works</p>
            <p className="text-[10px] text-white/40 leading-relaxed">
              <span className="text-orange-300">Sliders</span> = browser-only preview. Only you see these changes.
            </p>
            <p className="text-[10px] text-white/40 leading-relaxed">
              <span className="text-green-400">Save &amp; Deploy Live</span> = writes values to <code className="bg-black/30 px-1 rounded">heroConfig.ts</code>, commits to GitHub, and triggers a Vercel redeploy. All visitors get the new layout in ~1 min.
            </p>
            <p className="text-[10px] text-orange-400/70 leading-relaxed mt-1">
              ⚠️ Must be run from your local dev server (<code className="bg-black/30 px-1 rounded">npm run dev</code>) — git is not available on Vercel.
            </p>
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="flex-1 relative" style={{ minHeight: '600px' }}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">
              {isDirty ? '👁 Temporary Preview' : '✓ Matches Live Site'}
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
