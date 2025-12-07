/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vino: {
          800: '#581c1c', // Color oscuro barra lateral
          900: '#3a0d0d', // Color más oscuro
        },
        mesa: {
          libre: '#4ade80', // Verde
          ocupada: '#ef4444', // Rojo
          reservada: '#eab308', // Amarillo
        }
      },
    },
  },
  plugins: [],
}