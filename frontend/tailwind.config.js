/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      translate: {
        "-full": "-100%",
      },
      colors: {
        danger: {
          light: "#FF7F7F", // Light red
          DEFAULT: "#FF4D4D", // Normal red
          dark: "#B30000", // Dark red
        },
        "primary-lightest": "#0F172A",
        "primary-light": "#374151",
        primary: "#1F2937",
        "primary-dark": "#4B5563",
        "primary-darkest": "#6B7280",
        accent: "#D97706", // bg-amber-900
        secondary: "#D97706", // bg-amber-900
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
