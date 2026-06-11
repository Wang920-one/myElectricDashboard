import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/myElectricDashboard/', // 注意：前後都要有斜槓！例如 '/my-vue-project/'
  server: {
    proxy:{
      '/api': {
        target:'http://159.75.169.224:1235',
        changeOrigin:true,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})