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
          bg: "rgb(var(--hearten-bg) / <alpha-value>)",
          card: "rgb(var(--hearten-card) / <alpha-value>)",
          "card-hover": "rgb(var(--hearten-card-hover) / <alpha-value>)",
          border: "rgb(var(--hearten-border) / <alpha-value>)",
          "border-hover": "rgb(var(--hearten-border-hover) / <alpha-value>)",
          text: "rgb(var(--hearten-text) / <alpha-value>)",
          muted: "rgb(var(--hearten-muted) / <alpha-value>)",
          dim: "rgb(var(--hearten-dim) / <alpha-value>)",
          rose: "rgb(var(--hearten-rose) / <alpha-value>)",
          "rose-light": "rgb(var(--hearten-rose-light) / <alpha-value>)",
          amber: "rgb(var(--hearten-amber) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
