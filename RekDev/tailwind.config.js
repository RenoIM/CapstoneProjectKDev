/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rekdev: {
          bg: '#11131a',
          panel: '#191c24',
          panelSoft: '#1d202b',
          line: '#2a2d38',
          muted: '#9295a3',
          text: '#f4f3f8',
          lime: '#c7f36b',
          limeHover: '#d6fb82',
          lavender: '#aa99ff',
          darkBorder: '#30333d',
        }
      },
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
