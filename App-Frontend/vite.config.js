import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview:{
    port: 3001,
  },
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PBL_BACKEND_PORT || '3000'}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
