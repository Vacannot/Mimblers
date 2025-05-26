/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "azure-radiance": {
          50: "#F5FCFF",
          100: "#EBF8FF",
          200: "#CCEAFC",
          300: "#AFD9FA",
          400: "#74B4F7",
          500: "#3b82f6",
          600: "#306FDB",
          700: "#2153B8",
          800: "#153B94",
          900: "#0C286E",
          950: "#051647",
        },
      },
    },
  },
  plugins: [],
};
