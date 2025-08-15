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
        // Prevent worker crashes
        isolate: false,
        // Reduce memory pressure (CI-compatible)
        execArgv: [
          '--max-old-space-size=256', // CRITICAL: Reduced from 512MB to 256MB
          '--optimize-for-size',
          '--gc-interval=50' // CRITICAL: More aggressive garbage collection
        ]
      },
    },
    // Aggressive memory management
    maxConcurrency: 1,
    // Test timeout and retry settings
    testTimeout: 10000, // CRITICAL: Reduced from 15000 to 10000
    hookTimeout: 10000, // CRITICAL: Reduced from 15000 to 10000
    // Prevent memory leaks
    teardownTimeout: 3000, // CRITICAL: Reduced from 5000 to 3000
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
    // Environment variables (CI-compatible)
    env: {
      NODE_ENV: 'test',
      // CI-compatible memory options (no --expose-gc)
      NODE_OPTIONS: '--max-old-space-size=256' // CRITICAL: Reduced from 512MB to 256MB
    },
    // Prevent test file caching issues
    cache: false,
    // Reduce transform overhead
    testTransformMode: {
      web: ['.*\\.(js|ts|jsx|tsx)$']
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
