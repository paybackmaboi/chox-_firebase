/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Chox Kitchen Theme
        "primary": "#e9b10c",
        "primary-dark": "#b38600",
        "background-light": "#f8f8f5",
        "background-dark": "#12110e", 
        "card-dark": "#1a1814",
      },
      fontFamily: {
        "display": ["Epilogue", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
        "script": ["Great Vibes", "cursive"],
        // Fallbacks
        "sans": ["Manrope", "sans-serif"], 
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #ffd700 0%, #e9b10c 50%, #b8860b 100%)',
        'text-gold': 'linear-gradient(to bottom, #ffeebb 0%, #e9b10c 60%, #b8860b 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(233, 177, 12, 0.2)',
        'glow-hover': '0 0 30px rgba(233, 177, 12, 0.5)',
        'inner-gold': 'inset 0 0 10px rgba(255, 215, 0, 0.2)',
      }
    },
  },
  plugins: [],
}