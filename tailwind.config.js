/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        "1" : "1px"
      }
    },
  },
  plugins: [
    function({addUtilities}) {
      const newUtilities = {
        ".scrollbar-thin" : {
          scrollbarWidth : "unset",
          scrollbarColor : "unset"
        },
        ".scrollbar-webkit" : {
          "&::-webkit-scrollbar" : {
            width: "8px"
          },
          "&::-webkit-scrollbar-track" : {
            background: "white"
          },
          "&::-webkit-scrollbar-thumb" : {
            backgroundColor: "rgb(236 236 236)",
            borderRadius: "20px",
            border: "1px solid white"
          }
        }
      }

      addUtilities(newUtilities, ["responsive", "hover"])
    }
  ],
}