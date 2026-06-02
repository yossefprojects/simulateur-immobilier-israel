/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        israel: {
          blue:  '#185FA5',
          teal:  '#0F6E56',
          amber: '#BA7517',
          red:   '#993C1D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
