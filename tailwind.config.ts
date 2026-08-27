import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
        caffeine: {
          dark: "#faf6f0",          // Luminous warm ivory/cream background
          darker: "#f4ede2",        // Soft warm beige for header topbar & secondary bands
          card: "#ffffff",          // Pure crisp white card background
          cardBorder: "#ebd7bf",    // Delicate warm champagne/gold border
          surface: "#fdf8f2",       // Soft delicate cream/peach surface for inputs & badges
          cream: "#24140e",         // Gourmet deep chocolate/espresso for primary text
          creamLight: "#3d261b",    // Warm cocoa dark text
          gold: "#c68a3c",          // Soft gourmet gold
          goldDark: "#9e6b29",      // Deep contrast gold
          goldLight: "#faeed9",     // Delicate pastel gold
          goldHover: "#d89b4b",     // Glowing gold hover
          caramel: "#cf6b22",       // Warm caramel accent
          subtle: "#685144",        // Warm taupe/cocoa for secondary text
          muted: "#8e786b",         // Muted/placeholder warm text
          border: "#ebd7bf",        // Soft border
        },
        primary: {
          DEFAULT: "#c68a3c",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ffffff",
          foreground: "#24140e",
        },
        accent: {
          DEFAULT: "#c68a3c",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#e0454f",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f4ede2",
          foreground: "#685144",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "DM Sans", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
      },
      animation: {
        "marquee": "marquee 25s linear infinite",
        "marquee-slow": "marquee 40s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        "gold-sm": "0 2px 12px rgba(198, 138, 60, 0.16)",
        "gold-md": "0 6px 22px rgba(198, 138, 60, 0.22)",
        "gold-lg": "0 10px 32px rgba(198, 138, 60, 0.28)",
        "card-soft": "0 4px 20px rgba(180, 130, 80, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 32px rgba(180, 130, 80, 0.16), 0 2px 6px rgba(0, 0, 0, 0.04)",
        "input-focus": "0 0 0 3px rgba(198, 138, 60, 0.2), 0 2px 8px rgba(198, 138, 60, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
