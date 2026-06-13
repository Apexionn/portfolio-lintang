/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'port-bg': '#080B10',
        'port-surface': '#0E1421',
        'port-surface-alt': '#111827',
        'port-grid': '#1A2235',
        'port-teal': '#00F5C4',
        'port-violet': '#5E4AE3',
        'port-text-primary': '#E8EDF5',
        'port-text-muted': '#5A6B8A',
        'port-text-dim': '#8A9BB5',
      },
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'syne-mono': ['"Syne Mono"', 'monospace'],
        'dm-mono': ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.8)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scanline: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'scanline': 'scanline 2s ease-in-out infinite',
        'blink': 'blink 1.1s step-end infinite',
      }
    },
  },
  plugins: [],
}