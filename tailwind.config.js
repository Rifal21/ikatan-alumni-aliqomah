/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#222831',
        secondary: '#393E46',
        tertiary: '#FFD369',
        quaternary: '#EEEEEE',
      }
    },
  },
  plugins: [],
}

