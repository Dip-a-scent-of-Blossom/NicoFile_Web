import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: 'localhost',
    port: 8080,  //没被占用，可以使用的端口
    open: true,
    proxy: {
      '/apis': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      },
      '/vditor': {
        target: 'https://unpkg.com/vditor@3.10.9', // 或 Vditor 使用的 CDN 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vditor/, '')
      }
    }
  }
})
