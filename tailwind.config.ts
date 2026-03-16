import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#faf7fc",
        lilac: "#e8ddf3",
        iris: "#89779a",
        plum: "#5b4d68",
        gold: "#bea06b",
        ink: "#43394d",
        stone: "#6a6372",
      },
      fontFamily: {
        sans: ["Hiragino Sans", "Yu Gothic", "sans-serif"],
        serif: ["Yu Mincho", "Hiragino Mincho ProN", "serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(116, 94, 146, 0.08)",
        soft: "0 10px 30px rgba(72, 58, 89, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
