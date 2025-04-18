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
        target: 'http://152.32.133.174:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, '') // 统一使用rewrite
      },
      '/vditor': {
        target: 'http://unpkg.com/vditor@3.10.9', // 或 Vditor 使用的 CDN 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vditor/, '')
      },
      '/wy':{
        target: 'http://music.163.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wy/, '')
      }
    }
  }
})
