/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      'lagosLogo': 'url(/assets/Lekki-Ikoyi-Link-Bridge.png)',
      'k.c': 'url(/assets/K.C-Murray.webp)',
      'intelligence': 'url(/assets/Intelligence.webp)',
      'maps': 'url(/assets/Museum5.webp)',
      'landing':'url(/assets/National-Museum.webp)',
      'texture':'url(/assets/Cartographertexture.png)'
    },
    colors: {
      'background': '#FFFCF0',
      'backgroundDark': '#faf6e2',
      'footer': '#C9BEA6',
      'primary': '#003300',
      'primary-light': '#DBFFDB',
    },
    fontFamily: {
      mono: ['var(--font-monoMajor)', 'var(--font-inter)'],
      inter: ['var(--font-inter)'],
      playfair:['var(--font-playfair)'],
      old: ['var(--font-old)'],
    },
  },
};
export const plugins = [];
