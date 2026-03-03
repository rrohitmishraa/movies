/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui"],
      },

      colors: {
        brand: {
          pink: "#db2777", // deeper pink
          blue: "#2563eb", // deeper blue
          softPink: "#fce7f3",
          softBlue: "#dbeafe",
          text: "#111827",
          muted: "#4b5563",
          background: "#ffffff",
          soft: "#f9fafb",
        },
      },

      backgroundImage: {
        "brand-gradient":
          "linear-gradient(120deg, #db2777 0%, #7c3aed 50%, #2563eb 100%)",
      },
    },
  },
  plugins: [],
};
