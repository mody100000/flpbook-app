/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        ipad: { min: "768px", max: "1024px" }, // Adjust this range as needed
      },
    },
  },
  plugins: [],
};
