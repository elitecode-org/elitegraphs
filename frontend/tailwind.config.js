/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
  safelist: [
    "bg-yellow-500/20",
    "bg-orange-500/20",
    "bg-red-500/20",
    // Add any other severity colors you might use
  ],
};
