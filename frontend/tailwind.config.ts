import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: { 50: "#f4f6ec", 200: "#c8d0a3", 400: "#8a9554", 600: "#5b6a2e", 700: "#46531f", 800: "#2f3a14", 900: "#1a2008" },
        ink: { 900: "#0a0c08", 800: "#11140e", 700: "#1a1e16" },
      },
      fontFamily: { display: ["var(--font-display)", "serif"], sans: ["var(--font-sans)", "system-ui"] },
      backgroundImage: {
        "grid-faint": "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
