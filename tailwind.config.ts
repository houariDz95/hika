import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["var(--font-noto-naskh)", "Tahoma", "serif"],
      },
      colors: {
        primary: {
          50: "#fdf4ed",
          100: "#fae6d4",
          200: "#f4cba8",
          300: "#ecab74",
          400: "#e2843f",
          500: "#d96820",
          600: "#c25318",
          700: "#a13f17",
          800: "#82341a",
          900: "#6b2c18",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            "h1, h2, h3, h4": {
              fontFamily: "var(--font-noto-naskh)",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
