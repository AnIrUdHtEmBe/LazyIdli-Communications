import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#1da1f2",
      },
       
      fontFamily: {
        sans: ["Sora", "sans-serif"], // Override default sans
      
  },
    },
  },
  plugins: [],
}

export default config
