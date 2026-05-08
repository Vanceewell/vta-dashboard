import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AI-EDITABLE: brand colors
        jgt: {
          black:   '#080808',
          bg:      '#0F0F0F',
          surface: '#1A1A1A',
          border:  '#2A2A2A',
          text:    '#F0EDE8',
          muted:   '#8A8880',
          gold: {
            light:   '#D4B470',
            DEFAULT: '#C5A056',
            dark:    '#A88038',
          },
          silver:  '#B0B0C0',
          navy:    '#1E3A5F',
        },
      },
      fontFamily: {
        // AI-EDITABLE: typography
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'spin-slow':   'spin 20s linear infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
