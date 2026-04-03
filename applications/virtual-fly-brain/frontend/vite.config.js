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
  const apiUrl = env.VFB_DOMAIN || process.env.VFB_DOMAIN || 'https://v3-cached.virtualflybrain.org';
  
  console.log('=== Vite Build Configuration ===');
  console.log('Mode:', mode);
  console.log('VFB_DOMAIN from loadEnv:', env.VFB_DOMAIN);
  // eslint-disable-next-line no-undef
  const neuroglassProtocol = env.NEUROGLASS_DATA_PROTOCOL || process.env.NEUROGLASS_DATA_PROTOCOL || 'neuroglancer-precomputed';
  // eslint-disable-next-line no-undef
  const neuroglassBaseUrl = env.NEUROGLASS_DATA_BASE_URL || process.env.NEUROGLASS_DATA_BASE_URL || 'gs://neuroglass/vfb';
  // eslint-disable-next-line no-undef
  const neuroglassUrl = env.NEUROGLASS_URL || process.env.NEUROGLASS_URL || 'https://www.research.neuroglass.dev.metacell.us';

  if (mode === 'development') {
    console.log('=== Vite Build Configuration ===');
    console.log('Mode:', mode);
    console.log('VFB_DOMAIN from loadEnv:', env.VFB_DOMAIN);
    // eslint-disable-next-line no-undef
    console.log('VFB_DOMAIN from process.env:', process.env.VFB_DOMAIN);
    console.log('NEUROGLASS_DATA_PROTOCOL:', neuroglassProtocol);
    console.log('NEUROGLASS_DATA_BASE_URL:', neuroglassBaseUrl);
    console.log('NEUROGLASS_URL:', neuroglassUrl);
    console.log('Final API URL:', apiUrl);
    console.log('================================');
  }

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
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.NEUROGLASS_DATA_PROTOCOL': JSON.stringify(neuroglassProtocol),
      'import.meta.env.NEUROGLASS_DATA_BASE_URL': JSON.stringify(neuroglassBaseUrl),
      'import.meta.env.NEUROGLASS_URL': JSON.stringify(neuroglassUrl)
    }
  }
})
