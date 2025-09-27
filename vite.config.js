import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'html'],
      all: true,
      include: [
        'src/components/SpaceCard.jsx',
        'src/components/Header.jsx',
        'src/components/PrivateRoute.jsx',
        'src/components/AdminRoute.jsx',
        'src/pages/HomePage.jsx',
      ],
      exclude: ['src/__tests__/**'],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
})
