/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
       'snaper-red': {
          100: 'rgb(255, 153, 162)',
          200: 'rgb(246, 114, 126)',
          300: 'rgb(237, 76, 90)',
          400: 'rgb(218, 40, 55)',
          500: 'rgb(187, 4, 36)',  // original
          600: 'rgb(157, 3, 30)',
          700: 'rgb(128, 2, 25)',
          800: 'rgb(98, 1, 19)',
          900: 'rgb(69, 1, 13)',
        },
      },
    },
  },
  plugins: [],
}