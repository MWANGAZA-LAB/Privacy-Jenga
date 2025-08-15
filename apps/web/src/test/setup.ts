import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// CRITICAL: Memory-optimized test setup using __mocks__ directory
// This approach uses Vitest's automatic mock discovery

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock WebGL context
global.WebGLRenderingContext = vi.fn() as any;
global.WebGL2RenderingContext = vi.fn() as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
    clearMarks: vi.fn(),
    clearMeasures: vi.fn(),
  },
});

// CRITICAL: Memory cleanup hooks
beforeEach(() => {
  // Limit requestAnimationFrame calls to prevent memory buildup
  let rafCount = 0;
  const originalRAF = global.requestAnimationFrame;
  global.requestAnimationFrame = vi.fn((callback) => {
    if (rafCount < 5) { // Limit to 5 RAF calls per test
      rafCount++;
      return originalRAF(callback);
    }
    return 0;
  });
});

afterEach(() => {
  // Aggressive memory cleanup
  vi.clearAllMocks();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Clear any test data
  (global as any).testData = undefined;
  
  // Reset RAF counter
  (global as any).rafCount = 0;
  
  // Small delay to allow cleanup
  return new Promise(resolve => setTimeout(resolve, 2));
});
