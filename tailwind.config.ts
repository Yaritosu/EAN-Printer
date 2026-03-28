import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        paper: "#f8fafc",
        accent: "#0f766e",
        warm: "#d97706"
      },
      boxShadow: {
        panel: "0 18px 44px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
