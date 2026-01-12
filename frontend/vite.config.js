import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // এই লাইনটি যোগ করুন

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // এখানে প্লাগইনটি কল করুন
  ],
  server: { port: 5173 }
})