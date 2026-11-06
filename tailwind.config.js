/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FBF3EA', 2: '#F5EADB', 3: '#EBDCC8' },
        ivory: '#FFFAF3',
        wine: { DEFAULT: '#7A1220', 700: '#6A0F1C', 900: '#4A0A13', 950: '#2E0509' },
        rose: { brand: '#D4141F' },
        gold: { DEFAULT: '#B8924A', soft: '#D9C08C' },
        ink: { DEFAULT: '#2B1A17', soft: '#6B574F' },
        night: '#0F1A2B',
        /* consola */
        con: { bg: '#f8fafc', s1: '#ffffff', s2: '#f1f5f9', line: '#e2e8f0', text: '#0f172a', mute: '#64748b' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(94,13,24,.25)',
        card: '0 2px 0 rgba(184,146,74,.25), 0 18px 40px -22px rgba(74,10,19,.35)',
      },
      keyframes: {
        kb: { '0%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1.12)' } },
        rise: { '0%': { transform: 'translateY(110%)' }, '100%': { transform: 'translateY(0)' } },
        draw: { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        pulseDot: { '0%,100%': { opacity: 1 }, '50%': { opacity: .35 } },
      },
      animation: {
        kb: 'kb 22s ease-out forwards',
        rise: 'rise .9s cubic-bezier(.2,.7,.2,1) both',
        draw: 'draw 1.1s .6s cubic-bezier(.2,.7,.2,1) both',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
