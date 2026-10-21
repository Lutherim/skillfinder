import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF9F5", linen: "#F4EFEA",
        sage: { DEFAULT: "#78866B", dark: "#5F6F53" },
        clay: "#3B2F2F", earth: "#5A4E4D", muted: "#7A6B69",
        ochre: { DEFAULT: "#D97736", dark: "#C86D3B" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
