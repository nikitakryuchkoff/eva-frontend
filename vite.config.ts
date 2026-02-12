import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VERSION__: JSON.stringify(process.env.VITE_VERSION || '2.0.0'),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.ts'),
      name: 'EvaChat',
      fileName: 'eva-chat',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'eva-chat.[ext]',
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
