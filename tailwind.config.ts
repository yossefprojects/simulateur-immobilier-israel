/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#1A3A5C', light: '#2A5080', dark: '#0F2235' },
        gold:     { DEFAULT: '#C9A84C', light: '#E8C96A', dark: '#A07830' },
        success:  '#0F6E56',
        danger:   '#993C1D',
        warning:  '#BA7517',
        neutral:  { 50: '#F8F7F4', 100: '#EDEDEA', 200: '#D8D7D3', 500: '#6B7280', 900: '#111827' },
      },
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
