import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Real palette, chosen for the "creative developer" duality
        // concept — see design-notes.md.
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        accent: "hsl(var(--accent))",
        "accent-design": "hsl(var(--accent-design))",
        "accent-dev": "hsl(var(--accent-dev))",
        muted: "hsl(var(--muted))",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
