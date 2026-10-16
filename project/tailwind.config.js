/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F3',
          100: '#F7F1E8',
          200: '#EFE4D2',
          300: '#E5D4B8',
          400: '#D4BC94',
          500: '#C2A26C',
          600: '#A88550',
          700: '#8A6A3E',
          800: '#6B5230',
          900: '#4A3920',
        },
        forest: {
          50: '#EFF5F0',
          100: '#D8E6DB',
          200: '#B3CDB8',
          300: '#86AE8E',
          400: '#5A8B66',
          500: '#3D6B49',
          600: '#2D5237',
          700: '#22402C',
          800: '#1A3022',
          900: '#11201A',
        },
        gold: {
          50: '#FBF6EC',
          100: '#F5E9CC',
          200: '#EBD399',
          300: '#E0BD66',
          400: '#D4A733',
          500: '#B8901F',
          600: '#94751A',
          700: '#705C15',
          800: '#4C3E0F',
          900: '#2A2208',
        },
        beige: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E9DFD0',
          300: '#D9C9B2',
          400: '#C4B194',
          500: '#A89472',
          600: '#8A785C',
          700: '#6B5D48',
          800: '#4D4234',
          900: '#2E2820',
        },
        ink: '#1A1A1A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(74, 57, 32, 0.06)',
        'card': '0 8px 30px rgba(74, 57, 32, 0.08)',
        'lift': '0 20px 50px rgba(74, 57, 32, 0.12)',
        'gold': '0 8px 24px rgba(180, 144, 31, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
