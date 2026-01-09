/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["NunitoSans-Regular"],
        'nunito-bold': ["NunitoSans-Bold"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      colors: {
        primary: "#008080",       // --primary-color
        text: "#f8f9fa",          // --text-color
        secondary: "#6c757d",     // --secondary-color
        success: "#28a745",       // --success-color
        danger: "#dc3545",        // --danger-color
        warning: "#ffc107",       // --warning-color
        info: "#17a2b8",          // --info-color
        light: "#f8f9fa",         // --light-color
        dark: "#222222",          // --dark-color
      },
    },
  },
  plugins: [],
}