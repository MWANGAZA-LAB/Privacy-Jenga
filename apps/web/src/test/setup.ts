import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import React from 'react';

// Simplified mocks to reduce memory usage
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Minimal WebGL mock
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => ({
    createShader: () => ({}),
    createProgram: () => ({}),
    createBuffer: () => ({}),
    getParameter: () => 4096,
  }),
});

// Minimal matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }),
});

// Minimal performance mock
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: () => Date.now(),
    memory: { usedJSHeapSize: 1000000, totalJSHeapSize: 2000000, jsHeapSizeLimit: 4000000 },
  },
});

// Simplified React Three Fiber mocks
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'three-canvas' }, children)),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ scene: {}, camera: {}, gl: {} })),
  extend: vi.fn(),
}));

// Simplified Three.js mocks
vi.mock('three', () => ({
  MeshStandardMaterial: vi.fn(() => ({ color: { set: vi.fn() } })),
  MeshBasicMaterial: vi.fn(() => ({ color: { set: vi.fn() } })),
  BoxGeometry: vi.fn(() => ({})),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn(), setScalar: vi.fn() },
    scale: { setScalar: vi.fn() },
  })),
}));

// Simplified @react-three/drei mocks
vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(() => React.createElement('div', { 'data-testid': 'orbit-controls' })),
  Box: vi.fn((props) => React.createElement('div', { 'data-testid': 'drei-box', ...props })),
  Text: vi.fn((props) => React.createElement('div', { 'data-testid': 'drei-text', ...props }, props.children)),
  ambientLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-ambient-light' })),
  directionalLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-directional-light' })),
  pointLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-point-light' })),
  planeGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-plane-geometry' })),
  ringGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-ring-geometry' })),
  sphereGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-sphere-geometry' })),
}));

// Minimal JSX declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      planeGeometry: any;
      ringGeometry: any;
      sphereGeometry: any;
    }
  }
}

// Memory-optimized test setup
beforeEach(() => {
  vi.clearAllMocks();
  
  // Limit animation frames to prevent memory buildup
  if (typeof window !== 'undefined') {
    let frameCount = 0;
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      frameCount++;
      if (frameCount > 25) { // Further reduced limit for tests
        return -1;
      }
      return originalRAF(callback);
    };
  }
  
  // Clear any stored test data
  if (typeof global !== 'undefined') {
    (global as any).testData = undefined;
  }
});

// Aggressive memory cleanup
afterEach(() => {
  // Clear all mocks to free memory
  vi.clearAllMocks();
  
  // Force cleanup if available
  if (global.gc) {
    global.gc();
  }
  
  // Clear any stored references
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame = window.requestAnimationFrame;
  }
  
  // Clear test data
  if (typeof global !== 'undefined') {
    (global as any).testData = undefined;
  }
  
  // Small delay to allow garbage collection
  return new Promise(resolve => setTimeout(resolve, 10));
});
