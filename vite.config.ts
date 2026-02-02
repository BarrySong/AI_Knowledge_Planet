
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 将 Node.js 环境中的 process.env 映射到前端
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
