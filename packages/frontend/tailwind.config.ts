import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pumpkin: {
          50: "#FFF4ED",
          100: "#FFE4CC",
          200: "#FFC599",
          300: "#FFA066",
          400: "#FE8840",
          DEFAULT: "#FE7F2D",
          600: "#E56510",
          700: "#BC4F0C",
          800: "#8F3D0D",
          900: "#62290A",
        },
        charcoal: {
          50: "#E8EEF2",
          100: "#C8D8E1",
          200: "#9DBACE",
          300: "#6F98B0",
          400: "#4A7592",
          DEFAULT: "#233D4D",
          600: "#1C3140",
          700: "#162531",
          800: "#0F1921",
          900: "#080C10",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
