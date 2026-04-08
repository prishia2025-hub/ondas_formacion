import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');
  const port = parseInt(process.env.PORT || env.HOST_PORT_FRONTEND || '3000');
  const backendPort = process.env.BACKEND_PORT || env.HOST_PORT_BACKEND || '5000';

  return {
    server: {
      host: true,
      port: port,
      allowedHosts: ["dev-ondas.prishia.es", "ondas.prishia.es"],
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || `http://web:${backendPort}`,
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
  };
});
