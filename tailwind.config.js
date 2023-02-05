/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#f6f8fa",
          100: "#eceef2",
          200: "#d4d6de",
          300: "#b4b7c1",
          400: "#8d93a3",
          500: "#636979",
          600: "#3e4351",
          700: "#252833",
          800: "#151820",
          900: "#0a0c11",
        },
        green: {
          50: "#effdda",
          100: "#d4f4bf",
          200: "#a7f298",
          300: "#75de78",
          400: "#49b058",
          500: "#2c8c47",
          600: "#176b2d",
          700: "#044d1b",
          800: "#043815",
          900: "#03220d",
        },
      },
    },
  },
  plugins: [],
};
