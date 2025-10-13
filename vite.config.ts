import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split React and React DOM into separate chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Split React Router into separate chunk
          if (id.includes('node_modules/react-router-dom')) {
            return 'router-vendor'
          }
          // Split Supabase into separate chunk
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor'
          }
          // Split Radix UI components into separate chunk
          if (id.includes('node_modules/radix-ui') || id.includes('node_modules/@radix-ui')) {
            return 'radix-vendor'
          }
          // Split Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
          // Split other UI libraries
          if (
            id.includes('node_modules/class-variance-authority') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge')
          ) {
            return 'ui-vendor'
          }
        },
      },
    },
    // Increase chunk size warning limit to 1000 kB
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging (optional, can remove in production)
    sourcemap: false,
  },
})
