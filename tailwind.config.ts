import type { Config } from "tailwindcss";


export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": {
            transform: "translateX(-50%) translateY(0px)",
          },
          "50%": {
            transform: "translateX(50%) translateY(-20px)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(0px)",
          },
        },
        float: {
          "0%": { 
            transform: "translate(-20vw, -20vh) scale(1) rotate(0deg)",
            opacity: "0.4" 
          },
          "33%": { 
            transform: "translate(30vw, 10vh) scale(1.3) rotate(120deg)",
            opacity: "0.7" 
          },
          "66%": { 
            transform: "translate(10vw, 40vh) scale(0.8) rotate(240deg)",
            opacity: "0.5" 
          },
          "100%": { 
            transform: "translate(-20vw, -20vh) scale(1) rotate(360deg)",
            opacity: "0.4" 
          },
        },
  "float-reverse": {
        "0%": { 
          transform: "translate(20vw, 20vh) scale(1) rotate(0deg)",
          opacity: "0.5" 
        },
        "33%": { 
          transform: "translate(-10vw, -20vh) scale(0.9) rotate(-120deg)",
          opacity: "0.3" 
        },
        "66%": { 
          transform: "translate(-30vw, 10vh) scale(1.2) rotate(-240deg)",
          opacity: "0.6" 
        },
        "100%": { 
          transform: "translate(20vw, 20vh) scale(1) rotate(-360deg)",
          opacity: "0.5" 
        },
      },
      },
      animation: {
        float: "float 20s ease-in-out infinite",
        "float-reverse": "float-reverse 25s ease-in-out infinite",
        shimmer: "shimmer 30s ease-in-out infinite",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
