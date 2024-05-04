/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'brand-blue': '#2D9CDB',
        'brand-red': '#EB5757',
        'brand-green': '#27AE60'
      }
    }
  },
  plugins: []
}
