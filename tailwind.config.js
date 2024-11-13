/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        ipad: { min: "768px", max: "1024px" }, // Adjust this range as needed
      },
      fontFamily: {
        arabic: ["'Noto Sans Arabic'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
