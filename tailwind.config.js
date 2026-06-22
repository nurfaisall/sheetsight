/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--border)',
        cyan: 'var(--cyan)',
        ok: 'var(--green)',
        warn: 'var(--amber)',
        bad: 'var(--red)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '20px',
      },
      boxShadow: {
        soft: '0 36px 80px -36px var(--shadow)',
        glow: '0 10px 24px -12px var(--accent2)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .4s cubic-bezier(.22,.61,.36,1) both',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};
