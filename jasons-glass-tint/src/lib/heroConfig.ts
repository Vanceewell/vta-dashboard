/**
 * heroConfig.ts — Hero layout configuration.
 *
 * DEFAULT_CONFIG is the fallback baked into the build.
 * The /admin-hero-layout editor saves overrides to localStorage under STORAGE_KEY.
 * HeroSection reads from localStorage on mount — so your browser sees your saved layout.
 * Other visitors (different browsers) always see DEFAULT_CONFIG.
 */

export const STORAGE_KEY = 'jgt_hero_layout_v1';

export interface HeroConfig {
  /** Gap below San Clemente label (px) */
  gapSanClementeLogo: number;
  /** Gap below logo (px) */
  gapLogoSince: number;
  /** Gap below "Since 1989" (px) */
  gapSinceParagraph: number;
  /** Gap below paragraph (px) */
  gapParagraphButtons: number;
  /** Gap below buttons (px) */
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

/** Load saved layout from localStorage, falling back to DEFAULT_CONFIG. */
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

/** Persist layout to localStorage. */
export function saveHeroConfig(cfg: HeroConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

/** Clear saved layout (reverts to DEFAULT_CONFIG). */
export function clearHeroConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
