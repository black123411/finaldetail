import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss()
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.SQUARE_ENVIRONMENT': JSON.stringify(env.SQUARE_ENVIRONMENT),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-motion': ['motion', 'motion/react'],
            'vendor-lucide': ['lucide-react'],
            'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage'],
            'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
            'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          }
        }
      }
    }
  };
});
