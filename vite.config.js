import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // force the port you want
    strictPort: true // fail if port is taken, don't auto-increment
  }
});
