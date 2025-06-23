import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  base: "./",
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ["swiper"],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true, // Xóa dist trước khi build
  },
});
