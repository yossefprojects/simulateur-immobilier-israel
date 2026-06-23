/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette « Méditerranée » — gold = sea (vert), plus de doré.
        primary:  { DEFAULT: '#0E1B2A', light: '#1C3049', dark: '#0E1B2A' },
        gold:     { DEFAULT: '#0F7B6C', light: '#37B3A1', dark: '#0B5C50' },
        success:  '#0F6E56',
        danger:   '#993C1D',
        warning:  '#E2761A',
        neutral:  { 50: '#F7F5F0', 100: '#EDEDEA', 200: '#D8D7D3', 500: '#6B7280', 900: '#111827' },
      },
      fontFamily: {
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
