module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006FB9',
          hover: '#145B97',
          press: '#194B7B',
        },
        brand: {
          bancoppel: '#FFF',
          coppel: '#FFDD35',
          'coppel-max': '#753CBD',
          afore: '#006FB9',
        },
        text: {
          DEFAULT: '#1B1A16',
          soft: '#717171',
          neutral: '#BDBDBD',
        },
        border: {
          soft: '#717171',
          neutral: '#D9E3F2',
        },
        background: {
          DEFAULT: '#F1F4FA',
          soft: '#FAFBFC',
          office: '#D9E3F2',
          box: '#FFFFFF',
        },
        semantic: {
          error: '#BA4B44',
          'error-bg': '#FFF0EF',
          success: '#2E8241',
          'success-bg': '#E5FFEB',
          warning: '#AB5C00',
          'warning-bg': '#FFF4E8',
          info: '#0076A9',
          'info-bg': '#E4F7FF',
          sales: '#D3273E',
        }
      },
      borderRadius: {
        'none': '0px',
        'sm': '8px',
        'md': '16px',
        'full': '999px',
      },
      boxShadow: {
        'default': '0px 6px 24px 0px rgba(25, 75, 123, 0.04)',
        'hover': '0px 6px 24px 0px rgba(25, 75, 123, 0.12)',
        'primary': '0px 6px 24px 0px rgba(25, 75, 123, 0.18)',
        'floating': '0px 4px 16px rgba(25, 75, 123, 0.24), 0px 6px 24px rgba(25, 75, 123, 0.16)',
      },
      fontSize: {
        'display': '48px',
        'h1': '36px',
        'h2': '28px',
        'h3': '24px',
        'h4': '20px',
        'body': '16px',
        'small': '14px',
        'caption': '12px',
      },
      spacing: {
        'unit': '8px',
        'unit-2': '16px',
        'unit-3': '24px',
        'unit-4': '32px',
        'unit-5': '40px',
      }
    },
  },
  plugins: [],
}