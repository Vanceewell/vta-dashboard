/**
 * heroConfig.ts — Hero layout configuration.
 *
 * DEFAULT_CONFIG is the fallback baked into the build.
 * The /admin-hero-layout editor saves overrides to localStorage under STORAGE_KEY.
 * HeroSection reads from localStorage on mount — so your browser sees your saved layout.
 * Other visitors (different browsers) always see DEFAULT_CONFIG.
 *
 * Two independent control groups:
 *   gap*     — spacing between elements (marginBottom). Affects layout flow.
 *   yOffset* — per-element translateY in px. Moves element up/down only,
 *              does NOT affect spacing or size of any other element.
 */

export const STORAGE_KEY = 'jgt_hero_layout_v1';

export interface HeroConfig {
  // ── Scale / Size (gap = marginBottom between elements) ───────
  gapSanClementeLogo:  number;
  gapLogoSince:        number;
  gapSinceParagraph:   number;
  gapParagraphButtons: number;
  gapButtonsStats:     number;
  logoWidth:           number;

  // ── Move Up / Down (translateY per element, px) ──────────────
  yOffsetSanClemente: number;
  yOffsetLogo:        number;
  yOffsetSince:       number;
  yOffsetParagraph:   number;
  yOffsetButtons:     number;
  yOffsetStats:       number;
}

export const DEFAULT_CONFIG: HeroConfig = {
  // spacing
  gapSanClementeLogo:  32,
  gapLogoSince:        28,
  gapSinceParagraph:   36,
  gapParagraphButtons: 28,
  gapButtonsStats:     60,
  logoWidth:           640,

  // y-offsets (0 = natural position)
  yOffsetSanClemente: 0,
  yOffsetLogo:        0,
  yOffsetSince:       0,
  yOffsetParagraph:   0,
  yOffsetButtons:     0,
  yOffsetStats:       0,
};

/** Load saved layout from localStorage, falling back to DEFAULT_CONFIG. */
export function loadHeroConfig(): HeroConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    // Merge with DEFAULT_CONFIG so new keys are always present
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Persist layout to localStorage. */
export function saveHeroConfig(cfg: HeroConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

/** Clear saved layout (reverts to DEFAULT_CONFIG on next load). */
export function clearHeroConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
