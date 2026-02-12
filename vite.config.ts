import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

function collectCssPlugin(): Plugin {
  const collectedCss: string[] = [];
  let isServe = false;

  return {
    name: 'collect-css-for-shadow-dom',
    enforce: 'post',

    configResolved(config) {
      isServe = config.command === 'serve';
    },

    transform(code, id) {
      if (!isServe) return;
      if (!/\.css(\?|$)/.test(id) || id.includes('?inline')) return;
      if (!code.includes('updateStyle(')) return;

      const idMatch =
        code.match(/const __vite__id = "([^"]+)"/) ?? code.match(/const id = "([^"]+)"/);
      const styleId = idMatch ? idMatch[1] : id;

      const inject = `
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const __evaId = ${JSON.stringify(styleId)};
  const __evaMap = window.__EVA_CSS_MAP__ || (window.__EVA_CSS_MAP__ = {});
  const __evaStyle = document.querySelector('style[data-vite-dev-id="' + __evaId + '"]');
  if (__evaStyle) {
    __evaMap[__evaId] = __evaStyle.textContent || "";
    window.__EVA_CSS__ = Object.values(__evaMap).join("\\n");
  }
  if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
      delete __evaMap[__evaId];
      window.__EVA_CSS__ = Object.values(__evaMap).join("\\n");
    });
  }
}
`;

      return {
        code: code + inject,
        map: null,
      };
    },

    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css')) {
          collectedCss.push((chunk as { source: string }).source);
          delete bundle[fileName];
        }
      }

      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const cssString = JSON.stringify(collectedCss.join('\n'));
          chunk.code = `window.__EVA_CSS__=${cssString};\n` + chunk.code;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), collectCssPlugin()],
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
