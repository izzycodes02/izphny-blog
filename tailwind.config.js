/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/comps/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{scss,css}',
  ],
  theme: {
    extend: {
      cursor: {
        'my-pointer':
          "url('http://www.rw-designer.com/cursor-extern.php?id=243490'), auto",
      },
    },
  },
  plugins: [],
};
