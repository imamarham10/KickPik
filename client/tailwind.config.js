/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#092e20',
        amber: '#eab308',
      },
    },
    fontFamily: {
      primary: ['Nunito'],
    },
  },
  plugins: [],
};
