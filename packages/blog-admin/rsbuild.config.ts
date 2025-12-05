import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './src/index.html',
  },
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  output: {
    distPath: {
      root: '../../dist/packages/blog-admin',
    },
  },
  tools: {
    htmlPlugin: {
      templateParameters: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api',
      },
    },
  },
});
