/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        kapital: {
          'dark': '#2B66FF',        
          'light-1': '#61A3FF',     
          'light-2': '#00FFFF',    
          'white': '#FFFFFF',      
          'gray': '#C9C9C9',       
          
          
          'night': '#111827',     
          'night-hover': '#374151', 
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}