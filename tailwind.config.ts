import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        // 極淡卡片陰影：深色模式睇唔到（黑底上黑影），日間模式先有立體感
        card: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
      },
      fontSize: {
        '2xs': '0.6875rem',   // 11.7px @ html 17px — badge／細標籤專用
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hearten: {
          bg: "rgb(var(--hearten-bg) / <alpha-value>)",
          card: "rgb(var(--hearten-card) / <alpha-value>)",
          header: "rgb(var(--hearten-header) / <alpha-value>)",
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
