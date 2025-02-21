/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGreenDark: '#5B913B',
        customYellow:'#FFE8B6',
        customGreen: '#77B254',
        customBrown:'#D99D81',
        customBrownDark: '#B3785E',
        customOrangeDark:'#C14600',
        customOrange:'#FF9D23',
        customWarm:'#FEF9E1',
      },
    },
  },
  plugins: [],
};
