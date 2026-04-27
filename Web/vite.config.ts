import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

type ViteConfigWithVitest = UserConfig & { test?: unknown }

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@models': fileURLToPath(new URL('./models', import.meta.url)),
      '@svg': fileURLToPath(new URL('./src/assets/images/svg', import.meta.url)),
      '@jpg': fileURLToPath(new URL('./src/assets/images/jpg', import.meta.url)),
      '@png': fileURLToPath(new URL('./src/assets/images/png', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'tests/**',
        'src/assets/**',
        '**/*.css',
        '**/*.md',
      ],
    },
  },
} satisfies ViteConfigWithVitest)
