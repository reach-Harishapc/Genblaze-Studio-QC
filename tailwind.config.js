/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        backblaze: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc8c2',
          300: '#ffa195',
          400: '#ff6d5b',
          500: '#FF3600', // Core Backblaze Flame
          600: '#e62a00',
          700: '#c21e00',
          800: '#9e1c05',
          900: '#821d0b',
          950: '#470b02',
        },
        studio: {
          bg: '#090A0F',
          card: '#12141D',
          border: '#222634',
          subtle: '#1A1D2B',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
        qc: {
          pass: '#10B981',
          retry: '#F59E0B',
          fail: '#EF4444',
          accent: '#8B5CF6',
        }
      },
      backgroundImage: {
        'flame-gradient': 'linear-gradient(135deg, #FF5500 0%, #FF1A00 100%)',
        'glow-radial': 'radial-gradient(circle at 50% 0%, rgba(255, 54, 0, 0.15) 0%, transparent 75%)',
        'card-gradient': 'linear-gradient(180deg, rgba(26, 29, 43, 0.8) 0%, rgba(18, 20, 29, 0.9) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255,54,0,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255,54,0,0.8))' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
