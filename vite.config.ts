import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  // 確保 base 屬性正確，且在 defineConfig 的頂層。
  base: "/",
  build: {
    outDir: 'dist',  // 輸出目錄
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 8080,
  },

  plugins: [react(), componentTagger()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});