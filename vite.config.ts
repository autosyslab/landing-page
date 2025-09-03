import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance: Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          spline: ['@splinetool/react-spline', '@splinetool/runtime'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          animations: ['framer-motion']
        }
      }
    },
    // Performance: Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Performance: Source maps for production debugging
    sourcemap: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', '@splinetool/react-spline']
  },
  server: {
    // Security: Disable server header
    headers: {
      'X-Powered-By': '',
    },
  },
});
