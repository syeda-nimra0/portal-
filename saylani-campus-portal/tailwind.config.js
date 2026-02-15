/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saylani: {
          green: '#66b032',
          blue: '#0057a8',
          'green-light': '#7bc043',
          'blue-light': '#1a6bc4',
          'green-dark': '#558c29',
          'blue-dark': '#004589',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        content: ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'gradient-wave': 'gradient-wave 15s ease infinite',
        'float': 'float 8s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-wave': {
          '0%, 100%': { 
            'background-position': '0% 50%',
            'background-size': '200% 200%' 
          },
          '50%': { 
            'background-position': '100% 50%',
            'background-size': '200% 200%' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        }
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
        'neumorphic-inset': 'inset 4px 4px 8px rgba(163, 177, 198, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        'neumorphic-dark': '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}