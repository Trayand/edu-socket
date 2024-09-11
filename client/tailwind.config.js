/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#007dff",
          secondary: "#00ab00",
          accent: "#735500",
          neutral: "#2e273c",
          "base-100": "#fff7fc",
          info: "#00aeff",
          success: "#008a10",
          warning: "#ff6100",
          error: "#e90013",
        },
      },
    ],
  },
};
