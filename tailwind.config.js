/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum': {
          900: '#0a0a1a',
          800: '#151530',
          700: '#20204d',
        },
        'neon': {
          blue: '#00f2fe',
          cyan: '#4facfe',
          purple: '#a18cd1',
          pink: '#fbc2eb'
        }
      }
    },
  },
  plugins: [],
}
