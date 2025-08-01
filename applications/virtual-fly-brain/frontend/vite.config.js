import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { env } from 'process'

// https://vite.dev/config/
export default defineConfig(() => {
  // Use VFB_DOMAIN if available (production), otherwise fallback to dev URL
  const apiUrl = env.VFB_DOMAIN || 'https://vfb.dev.metacell.us';
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    }
  }
})
