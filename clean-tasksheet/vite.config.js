/* ======================================================================
   METRA – vite.config.js (Clean TaskSheet Root Lock)
   Phase 4.6B.13 Step 6C – Personnel Overlay Activation
   ----------------------------------------------------------------------
   Forces Vite to serve from /clean-tasksheet only
   ====================================================================== */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: __dirname, // 👈 locks Vite to this folder only
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src`,
    },
  },
});

