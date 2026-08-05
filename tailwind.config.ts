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
          border: "#1f1f24",
          muted: "#6b6b7b",
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
