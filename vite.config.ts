import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')

  const API_URL = JSON.stringify(env.VITE_API_URL);

  return {
    plugins: [react()],
    define: {
      API_URL: API_URL,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
      },
    },
  }
});