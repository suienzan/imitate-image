/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: './extension',
    rollupOptions: {
      input: ['src/content-script.ts'],
      output: { entryFileNames: '[name].js', format: 'iife' },
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
