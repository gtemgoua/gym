import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces in Docker
    port: 5173,
    proxy: {
      "/api": {
        target: "http://api:4000", // Docker service name
        changeOrigin: true,
      },
      "/health": {
        target: "http://api:4000", // Docker service name
        changeOrigin: true,
      }
    }
  },
  build: {
    target: "esnext",
    sourcemap: true,
  },
});
