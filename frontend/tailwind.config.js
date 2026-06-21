/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  safelist: [
    'card', 'btn-primary', 'btn-outline', 'tag', 'section-label',
    'nav-link', 'gradient-text', 'glow', 'animate-fade-in', 'animate-slide-up'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          50:  '#E6F1FB',
          100: '#C0D9F5',
          200: '#96BFEE',
          300: '#6BA4E7',
          400: '#4A8EE0',
          500: '#378ADD',
          600: '#2A6CB5',
          700: '#185FA5',
          800: '#154E87',
          900: '#0E3560',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
