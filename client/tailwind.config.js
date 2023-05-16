/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f1f8e9',
        primary: '#092e20',
        amber: '#eab308',
      },
      fontFamily: {
        nunito : 'Nunito',
      }
    },
  },
  plugins: [],
}