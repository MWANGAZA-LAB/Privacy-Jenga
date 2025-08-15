import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // CRITICAL: Memory optimization to prevent V8 crashes
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        maxForks: 1,
        minForks: 1,
        // Memory limits for worker processes
        memoryLimit: '512MB',
        // Prevent worker crashes
        isolate: false,
        // Reduce memory pressure
        execArgv: [
          '--max-old-space-size=512',
          '--expose-gc',
          '--optimize-for-size',
          '--gc-interval=100'
        ]
      },
    },
    // Aggressive memory management
    maxConcurrency: 1,
    // Test timeout and retry settings
    testTimeout: 15000,
    hookTimeout: 15000,
    // Prevent memory leaks
    teardownTimeout: 5000,
    // Coverage settings (disabled to reduce memory usage)
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      // Reduce coverage overhead
      all: false,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}'
      ]
    },
    // Reporter settings
    reporters: ['verbose'],
    // Environment variables
    env: {
      NODE_ENV: 'test',
      // Reduce memory usage
      NODE_OPTIONS: '--max-old-space-size=512 --expose-gc'
    },
    // Prevent test file caching issues
    cache: false,
    // Reduce transform overhead
    transformMode: {
      web: [/\.[jt]sx?$/]
    }
  },
  // Vite configuration for tests
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three']
  },
  // Build optimization
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: false, // Disable sourcemaps to reduce memory
    rollupOptions: {
      output: {
        manualChunks: undefined // Disable chunking to reduce complexity
      }
    }
  },
  // Test-specific optimizations
  define: {
    'process.env.NODE_ENV': '"test"',
    'global': 'globalThis'
  }
});
