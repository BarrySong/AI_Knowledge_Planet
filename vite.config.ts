
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保 process.env 在浏览器中不会导致未定义错误
    'process.env': process.env
  }
});
