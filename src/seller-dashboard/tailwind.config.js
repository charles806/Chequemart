/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ChequeMart brand palette
        primary:   "#ff5252",
        "primary-hover": "#e04444",
        dark:      "#1a0a0a",
        "dark-2":  "#2d0d0d",
        surface:   "#f5f0f0",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "slide-up": "slideUp 0.22s ease-out",
        "fade-in":  "fadeIn 0.15s ease-out",
        "pop-in":   "popIn 0.3s ease-out",
        "toast-in": "toastIn 0.2s ease-out",
        "spin-slow":"spin 0.8s linear infinite",
      },
      keyframes: {
        slideUp:  { from: { opacity: 0, transform: "translateY(20px)" },             to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: 0, transform: "translateY(-4px)" },             to: { opacity: 1, transform: "translateY(0)" } },
        popIn:    { from: { opacity: 0, transform: "scale(0.85)" },                  to: { opacity: 1, transform: "scale(1)" } },
        toastIn:  { from: { opacity: 0, transform: "translateY(8px) translateX(-50%)" }, to: { opacity: 1, transform: "translateY(0) translateX(-50%)" } },
      },
    },
  },
  plugins: [],
};
