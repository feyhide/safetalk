/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        main:["DM Sans","sans-serif"],
        sub:["Inter","sans-serif"]
      }
    },
  },
  plugins: [],
}