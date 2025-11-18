/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sybrin-blue': {
          50: '#E6EEF7',
          100: '#CCE0FF',
          200: '#8FA3C4',
          300: '#4d6b9f',
          400: '#003d7a',
          500: '#002664',
          600: '#002664',
          700: '#001a42',
          800: '#001333',
          900: '#000d24',
        }
      }
    },
  },
  plugins: [],
}