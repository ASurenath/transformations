/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-[#1783b8]',
    'bg-[#4dc0ae]',
    'text-[#1783b8]',
    'text-[#4dc0ae]',
    'border-[#1783b8]',
    'border-[#4dc0ae]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

