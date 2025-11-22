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
          'dark': '#2563EB',        // Blue-600 (More vibrant)
          'light-1': '#60A5FA',     // Blue-400
          'light-2': '#93C5FD',     // Blue-300
          'accent': '#F59E0B',      // Amber-500 (For highlights)
          'night': '#0F172A',       // Slate-900 (Deep dark)
          'night-hover': '#1E293B', // Slate-800
          'gray': '#F1F5F9',        // Slate-100 (Backgrounds)
          'text-main': '#334155',   // Slate-700
          'text-light': '#64748B',  // Slate-500
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}