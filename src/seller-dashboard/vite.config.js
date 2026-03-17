import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to backend in development so CORS is avoided.
    // Change target to your backend URL.
    proxy: {
      "/api": {
        target:      "http://localhost:5000",
        changeOrigin: true,
        secure:       false,
      },
    },
  },
  build: {
    outDir:       "dist",
    sourcemap:    true,
    chunkSizeWarningLimit: 600,
  },
});
