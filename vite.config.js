import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Inline all assets to avoid separate files
    assetsInlineLimit: 100000,
    rollupOptions: {
      output: {
        // Single JS bundle for easier encryption
        manualChunks: undefined,
      },
    },
  },
  // Ensure relative paths work with GitHub Pages
  base: './',
});
