import { text } from 'stream/consumers';

// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#4CAF50', // Green
        lightLink: '#D2FFA5', // Light Green
        darkLink: '#087f23', // Dark Green
        text: '#333', // Dark Gray
        textBold : '#000', // Black
        secondary: '#FF9800', // Orange
        darkOrange: '#FF5722', // Dark Orange
        accent: '#3F51B5', // Indigo
        error: '#F44336', // Red
        info: '#2196F3', // Blue
        success: '#4CAF50', // Green
        warning: '#FFEB3B', // Yellow
      },
    },
  },
  plugins: [],
};
