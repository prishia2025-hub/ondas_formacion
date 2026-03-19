/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "var(--bg-app)",
        card: "var(--bg-card)",
        sidebar: "var(--bg-sidebar)",
        border: "var(--border)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        accent: {
          from: "var(--accent-from)",
          to: "var(--accent-to)",
        },
        status: {
          nuevo: {
            bg: "#EFF6FF",
            text: "#3B82F6",
          },
          contactado: {
            bg: "#ECFEFF",
            text: "#06B6D4",
          },
          ptedoc: {
            bg: "#FFFBEB",
            text: "#F59E0B",
          },
          inscrito: {
            bg: "#F0FDF4",
            text: "#10B981",
          },
          reserva: {
            bg: "#F5F3FF",
            text: "#8B5CF6",
          },
          nointeresado: {
            bg: "#F8FAFC",
            text: "#94A3B8",
          },
        }
      },
      boxShadow: {
        card: "var(--shadow-card)",
      }
    },
  },
  plugins: [],
}
