import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Improve build performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database', 'firebase/storage'],
          'ui': ['lucide-react'],
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Inline assets smaller than 10kb
    assetsInlineLimit: 10240,
    // Generate source maps for production debugging
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
  // Server configuration for better development performance
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  },
  // Preview server configuration
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  }
})