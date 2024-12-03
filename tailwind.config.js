/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{html,ts}"],
  theme: {
    screens: {
      xs: "320px", // Extra small devices (phones)
      sm: "640px", // Small devices (phones)
      md: "768px", // Medium devices (tablets)
      lg: "1024px", // Large devices (desktops)
      xl: "1280px", // Extra large devices (large desktops)
      "2xl": "1536px", // 2K displays
      "3xl": "1920px", // Full HD displays
      "4xl": "2560px", // 4K displays
    },
    extend: {
      colors: {
        "sunshine-yellow": "#ffcb05",
        dark: "#1A1A1A",
      },
      fontFamily: {
        "mtn-brighter": [
          "MTNBrighterSans-Regular",
          "MTNBrighterSans-Bold",
          "MTNBrighterSans-ExtraLight",
          "MTNBrighterSans-Medium",
          "MTNBrighterSans-BoldItalic",
          "MTNBrighterSans-ExtraLightItalic",
          "MTNBrighterSans-MediumItalic",
          "MTNBrighterSans-ExtraBold",
          "MTNBrighterSans-Light",
          "MTNBrighterSans-RegularItalic",
          "MTNBrighterSans-ExtraBoldItalic",
          "MTNBrighterSans-LightItalic",
        ],
      },
      keyframes:{
        moveUp:{
          
              '0%': {transform:'translateY(150px)'},  
              '100%': { transform:'translateY(0)' },
          },
          
          moveDown:{
           
              '0%': {  transform:'translateY(0px)'},
             ' 100%': { transform:'translateY(150px)',display:'hidden' }
            }
         
         
          
      
      }
    },
  },
  plugins: [],
};
