// vite.config.ts
import { defineConfig } from 'vite';
import react      from '@vitejs/plugin-react';
import path       from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react:     path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:        'http://localhost:3000',
        changeOrigin:  true,
        
      },
    },
  },
});
