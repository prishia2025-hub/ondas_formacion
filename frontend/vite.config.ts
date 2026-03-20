import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    allowedHosts: ["dev-ondas.prishia.es", "ondas.prishia.es"],
    proxy: {
      "/api": {
        target: "http://web:5000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envDir: '../', // Load .env from root if present, or we can just keep it local
});
