import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
              return 'vendor-three';
            }
            if (id.includes('reactflow')) {
              return 'react-flow';
            }
            if (id.includes('face-api.js')) {
              return 'face-api';
            }
            if (id.includes('framer-motion') || id.includes('motion')) {
              return 'framer-motion';
            }
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.match(/\/react\//)) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
