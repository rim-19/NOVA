import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                burgundy: {
                    DEFAULT: "#7D1736",
                    deep: "#5a0e26",
                    light: "#9a1f44",
                },
                dark: {
                    base: "#2B0303",
                    accent: "#390A16",
                    card: "#1a0202",
                },
                cream: {
                    DEFAULT: "#F5E9E2",
                    muted: "#d4c4bc",
                    soft: "#ede0d9",
                },
                gold: {
                    DEFAULT: "#b8956a",
                    light: "#d4b48a",
                    muted: "#8a6a4a",
                },
            },
            fontFamily: {
                montecarlo: ["MonteCarlo", "cursive"],
                cormorant: ["Cormorant Garamond", "Georgia", "serif"],
                playfair: ["Playfair Display", "Georgia", "serif"],
                inter: ["Inter", "sans-serif"],
            },
            backgroundImage: {
                "luxury-gradient": "linear-gradient(180deg, #2B0303 0%, #390A16 100%)",
                "card-gradient":
                    "linear-gradient(180deg, rgba(43,3,3,0.3) 0%, rgba(43,3,3,0.95) 100%)",
                "hero-gradient":
                    "linear-gradient(180deg, #2B0303 0%, #390A16 50%, #2B0303 100%)",
                "gold-shimmer":
                    "linear-gradient(90deg, transparent 0%, rgba(184,149,106,0.15) 50%, transparent 100%)",
            },
            animation: {
                "slow-zoom": "slowZoom 20s ease-in-out infinite alternate",
                "float": "float 6s ease-in-out infinite",
                "pulse-glow": "pulseGlow 3s ease-in-out infinite",
                "shimmer": "shimmer 3s ease-in-out infinite",
                "fade-up": "fadeUp 1s ease-out forwards",
            },
            keyframes: {
                slowZoom: {
                    "0%": { transform: "scale(1)" },
                    "100%": { transform: "scale(1.08)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                pulseGlow: {
                    "0%, 100%": {
                        boxShadow: "0 0 20px rgba(125, 23, 54, 0.3)",
                    },
                    "50%": {
                        boxShadow:
                            "0 0 40px rgba(125, 23, 54, 0.6), 0 0 80px rgba(125, 23, 54, 0.2)",
                    },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            transitionTimingFunction: {
                luxury: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                velvet: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
            letterSpacing: {
                luxury: "0.2em",
                wide: "0.15em",
                ultra: "0.35em",
            },
            borderRadius: {
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            backdropBlur: {
                xs: "2px",
                luxury: "20px",
            },
        },
    },
    plugins: [],
};

export default config;
