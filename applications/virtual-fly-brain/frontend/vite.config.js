import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  
  // Use VFB_DOMAIN if available (production), otherwise fallback to dev URL
  // Check both loadEnv result and direct process.env for Docker builds
  // eslint-disable-next-line no-undef
  const apiUrl = env.VFB_DOMAIN || process.env.VFB_DOMAIN || 'https://vfb.dev.metacell.us';
  
  console.log('=== Vite Build Configuration ===');
  console.log('Mode:', mode);
  console.log('VFB_DOMAIN from loadEnv:', env.VFB_DOMAIN);
  // eslint-disable-next-line no-undef
  console.log('VFB_DOMAIN from process.env:', process.env.VFB_DOMAIN);
  console.log('Final API URL:', apiUrl);
  console.log('================================');
  
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
