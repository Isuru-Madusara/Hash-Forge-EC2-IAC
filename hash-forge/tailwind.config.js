/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0F14',
          900: '#121923',
          800: '#1A2432',
          700: '#263345',
          600: '#34465D',
        },
        signal: {
          DEFAULT: '#F2A93C',
          soft: '#F6C372',
          dim: '#8A6327',
        },
        mint: {
          DEFAULT: '#4ADE9B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
