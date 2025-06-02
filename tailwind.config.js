/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E7A3',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
        },
        charcoal: {
          light: '#505050',
          DEFAULT: '#333333',
          dark: '#1A1A1A',
        },
        cream: '#F8F5E6',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'gold': '0 4px 12px rgba(212, 175, 55, 0.15)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      }
    },
  },
  plugins: [],
};