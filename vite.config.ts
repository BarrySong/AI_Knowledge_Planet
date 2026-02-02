import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 确保构建时能将环境变量注入到前端代码中
    'process.env': process.env
  }
});