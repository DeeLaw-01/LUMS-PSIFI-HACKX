import { colors } from './src/styles/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        accent: colors.accent,
        gray: colors.gray,
        text: colors.text
      }
    }
  },
  plugins: []
}
