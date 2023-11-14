import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3001,
  },
  server: {
    proxy: {
      // set proxy for api path to server
      "/api": {
        target: `http://localhost:${
          // process.env.VITE_PBL_BACKEND_PORT || "8080" || "3000"
          "3000"
        }`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
