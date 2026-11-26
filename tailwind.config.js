/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        nitro: {
          dark: '#111827',
          primary: '#3b82f6', 
          accent: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}