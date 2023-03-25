/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,tsx,jsx}",
    "./src/pages/**/*.{html,js,ts,tsx,jsx}",
    "./src/components/**/*.{html,js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [ "light", "dark"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
