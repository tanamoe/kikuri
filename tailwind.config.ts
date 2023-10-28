import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
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
        tanaamber: {
          900: "#302000",
          800: "#583C01",
          700: "#805802",
          300: "#FABF35",
          600: "#A87504",
          500: "#DA9A0A",
          400: "#F8B60B",
          200: "#FBD67D",
          100: "#FDE9B7",
          50: "#FFFBF1",
        },
      },
      fontFamily: {
        lexend: "Lexend",
        condensed: "IBM Plex Sans Condensed",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
