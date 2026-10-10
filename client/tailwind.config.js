/*
 * ─────────────────────────────────────────────────────────────
 *  PALETA NEXTAR SOLUTIONS — cambiá los colores acá y se actualiza todo.
 *  Sacados del posteo "Servicios técnicos destacados" y del logo NX.
 * ─────────────────────────────────────────────────────────────
 */
const palette = {
  ink: '#07040f', //     fondo más profundo
  night: '#0a0617', //   fondo principal
  panel: '#120920', //   tarjetas oscuras
  line: '#2b1849', //    bordes sutiles
  violet: {
    300: '#cfb1e6', //   lavanda (checks, textos suaves)
    400: '#ae7ddb',
    500: '#9055c8', //   violeta del logo
    600: '#7436b0',
    700: '#52209a',
    800: '#350862', //   violeta profundo del logo
  },
  paper: '#fafaf7', //   tarjeta clara del posteo
  silver: '#e9e3ea', //  brillo metálico de la "X"
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { nx: palette },
      fontFamily: {
        display: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(144, 85, 200, 0.55)',
        'glow-sm': '0 0 20px -6px rgba(144, 85, 200, 0.6)',
      },
    },
  },
  plugins: [],
};