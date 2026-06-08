import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#111111",
        bone: "#F6F3EE",
        roxred: "#B11226",
        roxgold: "#C8A46A",
        steel: "#6F6F6F",
        ink: "#080808"
      },
      fontFamily: {
        display: ["var(--font-display)", "Oswald", "Impact", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      backgroundImage: {
        "rox-radial": "radial-gradient(circle at 20% 20%, rgba(200,164,106,0.16), transparent 28%), radial-gradient(circle at 80% 30%, rgba(177,18,38,0.16), transparent 24%)",
        "steel-line": "linear-gradient(135deg, rgba(246,243,238,0.10), transparent 42%, rgba(200,164,106,0.08))"
      },
      boxShadow: {
        "hard-red": "0 0 0 1px rgba(177,18,38,0.45), 0 22px 60px rgba(0,0,0,0.48)",
        "gold-soft": "0 0 0 1px rgba(200,164,106,0.25), 0 18px 50px rgba(0,0,0,0.42)"
      },
      letterSpacing: {
        rox: "0.18em"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        grit: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.38" }
        }
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        grit: "grit 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
