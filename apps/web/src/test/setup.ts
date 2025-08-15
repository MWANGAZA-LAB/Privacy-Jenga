import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// CRITICAL: Memory-optimized test setup to prevent V8 crashes
// Simplified mocks to reduce memory footprint

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

// CRITICAL: Simplified @react-three/fiber mocks to reduce memory usage
vi.doMock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children }) => children),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: { position: { set: vi.fn() } },
    scene: { add: vi.fn(), remove: vi.fn() },
    gl: { domElement: document.createElement('div') },
    raycaster: { setFromCamera: vi.fn() },
    mouse: { x: 0, y: 0 },
    viewport: { width: 800, height: 600 },
  })),
  extend: vi.fn(),
}));

// CRITICAL: Simplified three.js mocks to reduce memory usage
vi.doMock('three', () => ({
  MeshStandardMaterial: vi.fn(() => ({
    color: { set: vi.fn() },
    needsUpdate: false,
    dispose: vi.fn(),
  })),
  MeshBasicMaterial: vi.fn(() => ({
    color: { set: vi.fn() },
    needsUpdate: false,
    dispose: vi.fn(),
  })),
  BoxGeometry: vi.fn(() => ({
    dispose: vi.fn(),
  })),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn() },
    rotation: { set: vi.fn() },
    scale: { set: vi.fn() },
    add: vi.fn(),
    remove: vi.fn(),
    dispose: vi.fn(),
  })),
}));

// CRITICAL: Simplified @react-three/drei mocks
vi.doMock('@react-three/drei', () => ({
  Text: vi.fn(() => null),
  OrbitControls: vi.fn(() => null),
  PerspectiveCamera: vi.fn(() => null),
  Environment: vi.fn(() => null),
  useGLTF: vi.fn(() => ({ scene: null })),
  Html: vi.fn(() => null),
  Float: vi.fn(({ children }) => children),
  PresentationControls: vi.fn(({ children }) => children),
}));

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
