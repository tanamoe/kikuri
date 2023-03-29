import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      colors: {
        primary: "#89c4f4",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        lexend: "Lexend",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
