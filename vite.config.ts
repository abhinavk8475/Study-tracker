import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { replitVitePlugin } from "@replit/vite-plugin-cartographer";

export default defineConfig({
  plugins: [react(), replitVitePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@lib": path.resolve(__dirname, "./client/src/lib"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    middlewareMode: true,
  },
});
