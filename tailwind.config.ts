import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#05030a",
        rosegold: "#f5b7a9",
        aureate: "#f7d58a",
        orchid: "#bf7bff"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"]
      },
      boxShadow: {
        glow: "0 0 55px rgba(247, 213, 138, 0.22)",
        rose: "0 0 45px rgba(245, 183, 169, 0.24)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-18px) rotate(1deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-120px, -90px, 0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        drift: "drift 18s linear infinite alternate",
        pulseSoft: "pulseSoft 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
