import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const target = 'http://localhost:3000'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:target,
        secure:false,
      },
    },
  },
  plugins: [react()],
})
