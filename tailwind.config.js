/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'port-bg': '#151d35',
        'port-surface': '#202a46',
        'port-surface-alt': '#263452',
        'port-grid': '#536486',
        'port-teal': '#c8ef76',
        'port-violet': '#ff917d',
        'port-text-primary': '#f6efd9',
        'port-text-muted': '#aebbd6',
        'port-text-dim': '#c4cde0',
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
