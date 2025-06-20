import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://app.zoom.us/wc/*'],
        noframes: true
      },
      server: {
        open: false,
      },
    }),
  ],
});
