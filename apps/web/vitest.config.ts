import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Memory optimization settings
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        maxForks: 1,
        minForks: 1,
      },
    },
    // Reduce memory usage
    maxConcurrency: 1,
    isolate: false,
    // Test timeout and retry settings
    testTimeout: 10000,
    hookTimeout: 10000,
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
      ],
    },
    // Reporter settings
    reporters: ['verbose'],
    // Environment variables
    env: {
      NODE_ENV: 'test',
    },
  },
  // Vite configuration for tests
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Build optimization
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
  },
});
