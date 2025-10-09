import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Point to PostCSS configuration
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for src directory
    },
  },
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173, // Default Vite port
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // Allow all ngrok subdomains
      'fb1a-41-228-68-88.ngrok-free.app', // Specific ngrok host
    ],
    cors: true, // Enable CORS
    watch: {
      // Optimize file watching to reduce system load
      usePolling: false,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/logs/**',
        '**/.cache/**',
        '**/tmp/**',
        '**/temp/**'
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  base: '/home', // Your app base path
});
