/**
 * heroConfig.ts — Single source of truth for hero layout spacing.
 *
 * DEFAULT_CONFIG is baked into the build at deploy time.
 * The /api/save-hero-layout route patches this file and git-pushes,
 * triggering a Vercel redeploy so ALL visitors get the updated values.
 *
 * localStorage is used ONLY for temporary live-preview in the admin editor.
 */

export const STORAGE_KEY = 'jgt_hero_layout_preview_v1';

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

/**
 * !! EDIT THIS BLOCK to change the live public layout !!
 * The /admin-hero-layout editor updates these values automatically
 * by committing and pushing to GitHub, which triggers a Vercel redeploy.
 */
export const DEFAULT_CONFIG: HeroConfig = {
  gapSanClementeLogo:  32,
  gapLogoSince:        28,
  gapSinceParagraph:   36,
  gapParagraphButtons: 28,
  gapButtonsStats:     60,
  logoWidth:           640,
};

/** Load temporary preview config from localStorage (admin editor only). */
export function loadPreviewConfig(): HeroConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Save temporary preview config to localStorage (admin editor only). */
export function savePreviewConfig(cfg: HeroConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

/** Clear preview config from localStorage. */
export function clearPreviewConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
