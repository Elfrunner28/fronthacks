import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  console.log(env.VITE_GOOGLE_MAPS_API_KEY);
  console.log(env.VITE_BACKEND_URL);

  return {
    plugins: [react()], // Ensures React plugin is loaded
    define: {
      'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
    },
    server: {
      port: 3000, // Dev server port
      open: true, // Automatically open browser
    },
    resolve: {
      alias: {
        '@': '/src', // Optional alias for cleaner imports
      },
    },
  };
});