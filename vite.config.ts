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
  },
});
