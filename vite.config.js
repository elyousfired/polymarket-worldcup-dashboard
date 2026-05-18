import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration with active proxy to Polymarket Gamma API to solve CORS limitations
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/polymarket': {
        target: 'https://gamma-api.polymarket.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/polymarket/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Origin', 'https://polymarket.com');
            proxyReq.setHeader('Referer', 'https://polymarket.com/');
          });
        }
      }
    }
  }
});
