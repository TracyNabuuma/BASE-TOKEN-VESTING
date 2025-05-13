/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: {
          blue: '#0052FF',
          'blue-dark': '#0043CC',
          'blue-light': '#4C8BFF',
          navy: '#121217',
          'navy-light': '#2D2D39',
          gray: '#EAECEF',
          'gray-dark': '#8F8F9F',
        },
        success: {
          DEFAULT: '#0AC18E',
          light: '#D7F8EF',
          dark: '#058A66',
        },
        warning: {
          DEFAULT: '#F4B740',
          light: '#FEF2D6',
          dark: '#B3872E',
        },
        error: {
          DEFAULT: '#EA3943',
          light: '#FDDADC',
          dark: '#BE2D35',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};