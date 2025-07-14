// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true, // or false to disable source maps
    lib: {
      entry: 'main.js',
      name: 'CameraBundle',
      fileName: () => 'bundle.js',
      formats: ['iife']
    }
  }
})
