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
          50: "#f0fdd7",
          100: "#d5f4bb",
          200: "#b6ef98",
          300: "#81dc75",
          400: "#49b056",
          500: "#328c49",
          600: "#236a38",
          700: "#184d29",
          800: "#0d371d",
          900: "#032211",
        },
        brown: {
          50: "#f5ebd9",
          100: "#ecdac2",
          200: "#e1c4a5",
          300: "#d4b091",
          400: "#c79877",
          500: "#af7f61",
          600: "#8d5e49",
          700: "#6d4737",
          800: "#553629",
          900: "#3e261b",
        },
      },
    },
  },
  plugins: [],
};
