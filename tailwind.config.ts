import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Troves & Coves high-contrast brand colors
        "troves-turquoise": "hsl(var(--troves-turquoise))",
        "coves-blue": "hsl(var(--coves-cursive-blue))",
        "wood-grain": "hsl(var(--wood-grain))",
        "skull-turquoise": "hsl(var(--skull-turquoise))",
        "ornate-gold": "hsl(var(--ornate-frame-gold))",
        "obsidian-black": "hsl(var(--obsidian-black))",
        "leather-black": "hsl(var(--leather-black))",
        "readable": "hsl(25 30% 8%)",
        "readable-muted": "hsl(25 25% 20%)",
        "max-contrast": "hsl(0 0% 0%)",
        // Enhanced jewelry colors
        gold: {
          50: '#fffbe6',
          100: '#fff3bf',
          200: '#ffe066',
          300: '#ffd700', // Main gold
          400: '#ffc300',
          500: '#bfa200',
          600: '#a68a00',
          700: '#8c7300',
          800: '#665400',
          900: '#4d4000',
        },
        silver: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#868e96', // Main silver
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        turquoise: {
          50: '#e0fcf9',
          100: '#bef8fd',
          200: '#87eaf2',
          300: '#54d1db',
          400: '#38bec9',
          500: '#2cb1bc', // Main turquoise
          600: '#14919b',
          700: '#0e7c86',
          800: '#0a6c74',
          900: '#044e54',
        },
        teal: {
          50: '#e6fffa',
          100: '#b2f5ea',
          200: '#81e6d9',
          300: '#4fd1c5',
          400: '#38b2ac',
          500: '#319795', // Main teal
          600: '#2c7a7b',
          700: '#285e61',
          800: '#234e52',
          900: '#1d4044',
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        'cursive': ['Dancing Script', 'cursive'],
        'display': ['Playfair Display', 'serif'],
        'sans': ['Source Sans Pro', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
