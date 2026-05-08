'use client';

/**
 * HeroLogo — SVG stacked typographic logo
 *
 * Layout (reference-faithful):
 *   ┌─────────────────────┐
 *   │  JASON'S            │  ← large, bold, condensed, upright
 *   │    GLASS            │  ← smaller, ultra-wide tracking, italic/slant
 *   │ TINT                │  ← massive, dominant, condensed
 *   └─────────────────────┘
 *
 * White text / fully transparent background.
 * SVG scales via viewBox — crisp on any DPI.
 */

interface HeroLogoProps {
  className?: string;
  'aria-label'?: string;
}

export default function HeroLogo({ className = '', 'aria-label': ariaLabel = "Jason's Glass Tint" }: HeroLogoProps) {
  /*
   * ViewBox: 600 × 340
   *   JASON'S  → y≈110  font-size≈108
   *   GLASS    → y≈185  font-size≈66   (italic, expanded tracking)
   *   TINT     → y≈320  font-size≈195  (dominant baseline anchor)
   *
   * All text is `text-anchor="middle"` centered on x=300.
   * "GLASS" uses a skewX transform for the italic/slant effect.
   */
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 340"
      aria-label={ariaLabel}
      role="img"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/*
         * Bebas Neue is already loaded globally.
         * We declare it here as a fallback reference too.
         */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          .jgt-logo-word {
            font-family: 'Bebas Neue', 'Arial Narrow', Impact, sans-serif;
            fill: #ffffff;
            paint-order: stroke fill;
          }
        `}</style>
      </defs>

      {/* ── JASON'S ── large, bold, upright, compressed */}
      <text
        className="jgt-logo-word"
        x="300"
        y="112"
        fontSize="110"
        fontWeight="400"
        letterSpacing="8"
        textAnchor="middle"
        dominantBaseline="auto"
      >
        JASON&apos;S
      </text>

      {/* ── GLASS ── smaller, italic/slanted, wide tracking, overlaps both */}
      <g transform="skewX(-10) translate(30, 0)">
        <text
          className="jgt-logo-word"
          x="270"
          y="182"
          fontSize="68"
          fontWeight="400"
          letterSpacing="22"
          textAnchor="middle"
          dominantBaseline="auto"
          style={{ opacity: 0.92 }}
        >
          GLASS
        </text>
      </g>

      {/* ── TINT ── massive, dominant, fills the width */}
      <text
        className="jgt-logo-word"
        x="300"
        y="322"
        fontSize="198"
        fontWeight="400"
        letterSpacing="-2"
        textAnchor="middle"
        dominantBaseline="auto"
      >
        TINT
      </text>
    </svg>
  );
}
