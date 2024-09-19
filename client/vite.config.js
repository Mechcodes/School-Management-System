import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// const target = 'http://localhost:3000'
const target2 = 'https://school-management-system-backend-hlqh.onrender.com'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:target2,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure:false,
      },
    },
  },
  plugins: [react()],
})
