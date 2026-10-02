/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./lab2/**/*.html'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f5ed',
        paper: '#ffffff',
        ink: '#17352e',
        muted: '#596860',
        brand: { light: '#e7f1dc', DEFAULT: '#2c6149', dark: '#1d4633' },
        line: '#dfe5db',
      },
      fontFamily: { sans: ['Segoe UI', 'Arial', 'sans-serif'] },
      screens: { wide: '1440px' },
      spacing: { 18: '4.5rem' },
      borderRadius: { card: '1.5rem' },
    },
  },
  plugins: [],
};
