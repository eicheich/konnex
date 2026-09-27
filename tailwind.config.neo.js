/** @type {import('tailwindcss').Config} */
// tailwind.config.js - Konnex Neo-Brutalist Pastel Pop Theme Configuration
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bubblegum: "#FFB7D5", // Bubblegum Pink
        lavender: "#D6C7FF",  // Pastel Lavender
        butter: "#FFEFA6",    // Butter Yellow
        peach: "#FFD3B6",     // Peach
        matcha: "#C1F2B0",    // Matcha Green
        sky: "#AEE2FF",       // Sky Pastel
        chalk: "#FFFDF9",     // Clean off-white canvas
        dark: "#000000",      // Solid brutalist black
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo': '4px 4px 0px 0px #000000',
        'neo-md': '5px 5px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-hover': '2px 2px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      fontFamily: {
        display: ['Fredoka', 'cursive', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
