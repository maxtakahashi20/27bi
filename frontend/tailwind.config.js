/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          deep: "#2D3A1E",
          muted: "#3d4d28",
          50: "#f4f6ec",
          200: "#c8d0a3",
          400: "#8a9554",
          600: "#5b6a2e",
          700: "#46531f",
          800: "#2f3a14",
          900: "#1a2008",
        },
        tactical: "#0A0A0A",
        gold: "#C9A227",
        ice: "#F0EDE6",
        bravery: "#8B1A1A",
        ink: { 900: "#0A0A0A", 800: "#121212", 700: "#1a1a1a" },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        subtitle: ["var(--font-cinzel)", "Georgia", "serif"],
        body: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        tactical: "0 24px 48px rgba(0,0,0,0.55)",
        gold: "0 0 32px rgba(201, 162, 39, 0.18)",
        lift: "0 12px 40px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(240,237,230,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(240,237,230,0.06) 1px, transparent 1px)",
        "hero-olive":
          "linear-gradient(165deg, rgba(45,58,30,0.78) 0%, rgba(45,58,30,0.72) 45%, rgba(10,10,10,0.88) 100%)",
      },
      transitionDuration: { tactical: "280ms" },
      keyframes: {
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
      },
      animation: {
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
