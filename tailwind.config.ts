import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './sanity/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm white foundation — avoids the clinical feel of pure white
        bg: {
          DEFAULT: '#faf8f5',
          soft: '#f5f2ed',
          elevated: '#ffffff',
        },
        // Warm black for primary text — softer than pure black
        fg: {
          DEFAULT: '#1a1a1a',
          muted: 'rgba(26, 26, 26, 0.55)',
          subtle: 'rgba(26, 26, 26, 0.35)',
          ghost: 'rgba(26, 26, 26, 0.1)',
        },
        // Luxurious warm gold accent
        gold: {
          DEFAULT: '#c9a96e',
          light: '#d4b87e',
          dark: '#a0854a',
        },
        // Legacy aliases
        brand: {
          DEFAULT: '#1a1a1a',
          accent: '#c9a96e',
          ink: '#1a1a1a',
        },
        // Status colors — muted, sophisticated
        status: {
          available: '#5a7a5a',
          reserved: '#c9a96e',
          sold: 'rgba(26, 26, 26, 0.4)',
          coming: '#6a7a8a',
        },
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic:  ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'd-1': ['clamp(4rem, 11vw, 10rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'd-2': ['clamp(3rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'd-3': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'd-4': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
      },
      letterSpacing: {
        editorial: '0.2em',
        widest: '0.16em',
        tight: '-0.03em',
      },
      spacing: {
        'section': '8rem',
        'section-md': '6rem',
        'section-sm': '4rem',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1.5rem', md: '2rem', lg: '3rem', xl: '4rem' },
        screens: { '2xl': '1440px' },
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.55 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'line-expand': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'scale-in': 'scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'reveal-up': 'reveal-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'line-expand': 'line-expand 1.2s cubic-bezier(0.65, 0, 0.35, 1) both',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
