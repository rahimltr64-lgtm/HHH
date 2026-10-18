/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#4d6bfe',
          600: '#3b57e8',
          700: '#2f47c2',
          800: '#243a9e',
          900: '#1d2f7d',
        },
        ink: '#0d0d0d',
        surface: '#f7f8fb',
      },
      fontFamily: {
        sans: ['Tajawal', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(13,13,13,0.12)',
        card: '0 1px 2px rgba(13,13,13,0.04), 0 8px 24px -16px rgba(13,13,13,0.18)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { 'fade-in': 'fade-in 0.25s ease-out both' },
    },
  },
  plugins: [],
};
