import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true
        // NO rewrite: the backend has spring.mvc.servlet.path=/api
        // so it expects /api/v1/auth/... paths as-is
      }
    }
  }
})
