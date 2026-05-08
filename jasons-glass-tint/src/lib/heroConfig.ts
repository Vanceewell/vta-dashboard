/**
 * heroConfig.ts
 * Shared hero layout configuration.
 * Values are gap sizes (marginBottom) in px between each stacked element.
 * The admin editor writes to localStorage under STORAGE_KEY.
 * HeroSection reads from localStorage on mount (client-side) and falls back
 * to DEFAULT_CONFIG so public visitors always get a valid layout.
 */

export const STORAGE_KEY = 'jgt_hero_layout_v1';

export interface HeroConfig {
  /** marginBottom below San Clemente label (px) */
  gapSanClementeLogo: number;
  /** marginBottom below logo (px) */
  gapLogoSince: number;
  /** marginBottom below "Since 1989" (px) */
  gapSinceParagraph: number;
  /** marginBottom below paragraph (px) */
  gapParagraphButtons: number;
  /** marginBottom below buttons (px) */
  gapButtonsStats: number;
  /** Logo max-width (px) */
  logoWidth: number;
}

export const DEFAULT_CONFIG: HeroConfig = {
  gapSanClementeLogo:  32,
  gapLogoSince:        28,
  gapSinceParagraph:   36,
  gapParagraphButtons: 28,
  gapButtonsStats:     60,
  logoWidth:           640,
};

/** Load saved config from localStorage, merging with defaults for safety. */
export function loadHeroConfig(): HeroConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Persist config to localStorage. */
export function saveHeroConfig(cfg: HeroConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}
