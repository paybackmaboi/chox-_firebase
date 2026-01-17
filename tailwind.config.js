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
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        slideInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        shimmerGlow: {
          '0%, 100%': { boxShadow: '0 4px 15px rgba(255, 215, 0, 0.6)' },
          '50%': { boxShadow: '0 4px 25px rgba(255, 215, 0, 0.9)' },
        },
        slideUp: {
          'from': { transform: 'translate(-50%, 100%)', opacity: '0' },
          'to': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        modalSlideUp: {
          'from': { transform: 'translateY(30px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) scale(0.5) rotate(0deg)', opacity: '0' },
          '15%': { opacity: '1' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-120vh) scale(1.5) rotate(360deg)', opacity: '0' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        shimmer: 'shimmer 4s ease-in-out infinite',
        slideInUp: 'slideInUp 1s ease-out',
        fadeInUp: 'fadeInUp 1s ease-out 0.2s both',
        bounce: 'bounce 2s ease-in-out infinite',
        shimmerGlow: 'shimmerGlow 2s ease-in-out infinite',
        slideUp: 'slideUp 0.3s ease',
        fadeIn: 'fadeIn 0.3s ease',
        modalSlideUp: 'modalSlideUp 0.3s ease',
        floatUp: 'floatUp linear infinite',
        rotate: 'rotate 20s linear infinite',
      }
    },
  },
  plugins: [],
}