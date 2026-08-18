/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#0B1E3D',
          surface: '#13294B',
          raised: '#1C355E',
        },
        gold: {
          DEFAULT: '#D4AF37',
          muted: '#C9A227',
        },
        cream: '#F5F1E6',
        muted: '#AFB9CC',
        success: '#3E8E6D',
        expense: '#C0605C',
        transfer: '#7C93B3',
      },
      borderColor: {
        hairline: 'rgba(212,175,55,0.18)',
        'hairline-strong': 'rgba(212,175,55,0.34)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.28), 0 12px 32px -18px rgba(0,0,0,0.65)',
        'gold-glow': '0 1px 2px rgba(0,0,0,0.28), 0 14px 36px -16px rgba(212,175,55,0.28)',
        inset: 'inset 0 1px 0 rgba(245,241,230,0.04)',
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      maxWidth: {
        statement: '76rem',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
