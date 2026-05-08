/**
 * POST /api/save-hero-layout
 *
 * Receives a HeroConfig JSON body, patches DEFAULT_CONFIG in heroConfig.ts,
 * commits the change, and pushes to GitHub.
 * Vercel detects the push and redeploys, so ALL visitors get the new layout.
 *
 * This route runs on the Vercel server — it will NOT run on the deployed
 * production site (no git available there). It is designed to run locally
 * (dev server or via the local OpenClaw sandbox) where git is available.
 *
 * Production flow:
 *   Admin opens /admin-hero-layout locally → adjusts sliders → Save Layout
 *   → this route runs locally → git push → Vercel redeploys → live for everyone
 */

import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import type { HeroConfig } from '@/lib/heroConfig';

// Resolve repo root relative to this file: src/app/api/save-hero-layout/route.ts
// → ../../../../  (4 levels up = repo root)
const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const CONFIG_PATH = path.join(REPO_ROOT, 'src/lib/heroConfig.ts');

/** Replace the DEFAULT_CONFIG block inside heroConfig.ts */
function patchConfigFile(cfg: HeroConfig): void {
  const source = fs.readFileSync(CONFIG_PATH, 'utf8');

  const newBlock = `export const DEFAULT_CONFIG: HeroConfig = {
  gapSanClementeLogo:  ${cfg.gapSanClementeLogo},
  gapLogoSince:        ${cfg.gapLogoSince},
  gapSinceParagraph:   ${cfg.gapSinceParagraph},
  gapParagraphButtons: ${cfg.gapParagraphButtons},
  gapButtonsStats:     ${cfg.gapButtonsStats},
  logoWidth:           ${cfg.logoWidth},
};`;

  // Replace from "export const DEFAULT_CONFIG" to closing "};
  const patched = source.replace(
    /export const DEFAULT_CONFIG: HeroConfig = \{[\s\S]*?\};/,
    newBlock,
  );

  if (patched === source) {
    throw new Error('Pattern not found in heroConfig.ts — cannot patch.');
  }

  fs.writeFileSync(CONFIG_PATH, patched, 'utf8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<HeroConfig>;

    // Validate all keys are numbers
    const keys: (keyof HeroConfig)[] = [
      'gapSanClementeLogo', 'gapLogoSince', 'gapSinceParagraph',
      'gapParagraphButtons', 'gapButtonsStats', 'logoWidth',
    ];
    for (const k of keys) {
      if (typeof body[k] !== 'number') {
        return NextResponse.json({ error: `Missing or invalid field: ${k}` }, { status: 400 });
      }
    }

    const cfg = body as HeroConfig;

    // 1. Patch the source file
    patchConfigFile(cfg);

    // 2. Git commit + push (runs in repo root)
    const gitOpts = { cwd: REPO_ROOT, stdio: 'pipe' } as const;
    execSync('git add src/lib/heroConfig.ts', gitOpts);
    execSync(
      `git commit -m "chore: update hero layout via admin editor\n\n${JSON.stringify(cfg, null, 2)}"`,
      gitOpts,
    );
    execSync('git push origin main', gitOpts);

    return NextResponse.json({ ok: true, config: cfg });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[save-hero-layout]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
