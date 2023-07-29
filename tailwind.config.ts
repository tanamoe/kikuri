import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        tanablue: {
          900: "#031D33",
          800: "#134369",
          700: "#2D6EA3",
          600: "#4F98D3",
          500: "#6AAFE6",
          400: "#89C4F4",
          300: "#A1D3FC",
          200: "#BCE1FE",
          100: "#D5ECFF",
          50: "#E7F4FF",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        lexend: "Lexend",
        condensed: "IBM Plex Sans Condensed",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
