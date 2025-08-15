import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import React from 'react';

// CRITICAL: Memory-optimized mocks to prevent V8 crashes
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Minimal WebGL mock (reduced memory footprint)
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

// CRITICAL: Simplified React Three Fiber mocks (reduced memory)
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children }) => React.createElement('div', { 'data-testid': 'three-canvas' }, children)),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ scene: {}, camera: {}, gl: {} })),
  extend: vi.fn(),
}));

// CRITICAL: Simplified Three.js mocks (reduced memory)
vi.mock('three', () => ({
  MeshStandardMaterial: vi.fn(() => ({ color: { set: vi.fn() } })),
  MeshBasicMaterial: vi.fn(() => ({ color: { set: vi.fn() } })),
  BoxGeometry: vi.fn(() => ({})),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn(), setScalar: vi.fn() },
    scale: { setScalar: vi.fn() },
  })),
}));

// CRITICAL: Simplified @react-three/drei mocks (reduced memory)
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

// Minimal JSX declarations (reduced memory)
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

// CRITICAL: Memory-optimized test setup to prevent V8 crashes
beforeEach(() => {
  vi.clearAllMocks();
  
  // CRITICAL: Limit animation frames to prevent memory buildup
  if (typeof window !== 'undefined') {
    let frameCount = 0;
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      frameCount++;
      if (frameCount > 10) { // CRITICAL: Reduced limit to prevent memory issues
        return -1;
      }
      return originalRAF(callback);
    };
  }
  
  // Clear any stored test data
  if (typeof global !== 'undefined') {
    (global as any).testData = undefined;
  }
  
  // CRITICAL: Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
});

// CRITICAL: Aggressive memory cleanup to prevent V8 crashes
afterEach(() => {
  // Clear all mocks to free memory
  vi.clearAllMocks();
  
  // CRITICAL: Force cleanup if available
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
  
  // CRITICAL: Small delay to allow garbage collection
  return new Promise(resolve => setTimeout(resolve, 5)); // Reduced delay
});
