/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        // Primary color
        primary: {
          50: "#FCEDEF",
          100: "#F8D2DC",
          200: "#F3B5C9",
          300: "#EE95B2",
          400: "#EA6F97",
          500: "#E54376",
          600: "#D2386C",
          700: "#B8325D",
          800: "#9D2B4C",
          900: "#83233B",
        },
        // Secondary color
        secondary: {
          50: "#E3EAF9",
          100: "#C7D4F2",
          200: "#9ABBEA",
          300: "#6EA1E2",
          400: "#467FD6",
          500: "#1E57C7",
          600: "#1A4DAF",
          700: "#153F90",
          800: "#113271",
          900: "#0D2857",
        },
        // Accent color
        accent: {
          50: "#F6F7F9",
          100: "#EDF0F4",
          200: "#DDE1E9",
          300: "#C7CEDD",
          400: "#ABBAD0",
          500: "#8A9CBD",
          600: "#6E7FA5",
          700: "#526186",
          800: "#364567",
          900: "#222F4C",
        },
        // Neutral color
        neutral: {
          50: "#F8F8F8",
          100: "#ECECEC",
          200: "#D1D1D1",
          300: "#AFAFAF",
          400: "#888888",
          500: "#666666",
          600: "#444444",
          700: "#2D2D2D",
          800: "#1F1F1F",
          900: "#141414",
        },
        // Base colors
        "base-100": "#FAFAFA",
        "base-200": "#F4F4F4",
        "base-300": "#E5E5E5",
        // Info color
        info: {
          50: "#EAF4FC",
          100: "#D2E7F8",
          200: "#A6D2F1",
          300: "#79BAE9",
          400: "#4CA1E0",
          500: "#1F86D6",
          600: "#1B74BB",
          700: "#155C9A",
          800: "#114A79",
          900: "#0E3C5F",
        },
        // Success color
        success: {
          50: "#E9F7EC",
          100: "#D1F0D9",
          200: "#A5E2BD",
          300: "#79D3A0",
          400: "#4DC581",
          500: "#20B761",
          600: "#1AA351",
          700: "#157D41",
          800: "#116331",
          900: "#0D5225",
        },
        // Warning color
        warning: {
          50: "#FFFBEE",
          100: "#FFF6D8",
          200: "#FFECAE",
          300: "#FFDE7B",
          400: "#FFC84F",
          500: "#FFAB1E",
          600: "#CC8C17",
          700: "#996D11",
          800: "#664E0B",
          900: "#332F06",
        },
        // Error color
        error: {
          50: "#FCECEF",
          100: "#F8D2D5",
          200: "#F2B5B7",
          300: "#ED9595",
          400: "#EA6E72",
          500: "#E54350",
          600: "#D23848",
          700: "#B83240",
          800: "#9D2B37",
          900: "#83232D",
        },
      },
    },
  },
  daisyui: {
    themes: ["cupcake"],
  },
  plugins: [require("daisyui")],
};
