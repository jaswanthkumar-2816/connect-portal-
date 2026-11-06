import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2004,
    host: true,
    // The portal is opened over an ngrok tunnel during testing, so Vite's
    // host check has to let those hostnames through.
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.trycloudflare.com'],
    // The interview service runs on its own port. Proxying it here means a
    // tunnel for the portal carries the interview too — one public address
    // instead of two, and no cross-origin request to configure for a link
    // that only has to live long enough for someone to try it.
    proxy: {
      '/api/interview': {
        target: 'http://localhost:4010',
        changeOrigin: true,
      },
    },
  },
});
