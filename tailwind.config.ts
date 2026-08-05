import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hearten: {
          bg: "#0a0a0f",
          card: "#141418",
          "card-hover": "#1a1a22",
          border: "#1f1f24",
          "border-hover": "#3a3a48",
          text: "#e4e4e7",
          muted: "#6b6b7b",
          dim: "#52525b",
          rose: "#e11d48",
          "rose-light": "#fb7185",
          amber: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
