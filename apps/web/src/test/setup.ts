import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import React from 'react';

// Mock Three.js for testing
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Mock WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: (contextType: string) => {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return {
        // Mock WebGL context
        createShader: () => ({}),
        shaderSource: () => {},
        compileShader: () => {},
        createProgram: () => ({}),
        attachShader: () => {},
        linkProgram: () => {},
        useProgram: () => {},
        createBuffer: () => ({}),
        bindBuffer: () => {},
        bufferData: () => {},
        enableVertexAttribArray: () => {},
        vertexAttribPointer: () => {},
        drawArrays: () => {},
        drawElements: () => {},
        getExtension: () => null,
        getParameter: () => 4096,
        viewport: () => {},
        clear: () => {},
        clearColor: () => {},
      };
    }
    return null;
  },
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    getEntriesByType: () => [],
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock @react-three/fiber Canvas component
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn().mockImplementation(({ children }) => {
    return React.createElement('div', { 'data-testid': 'three-canvas' }, children);
  }),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    scene: {},
    camera: {},
    gl: {}
  })),
  extend: vi.fn((objects) => {
    // Mock the extend function that makes Three.js objects available as JSX
    Object.assign(global, objects);
  }),
}));

// Mock Three.js components for React Three Fiber  
vi.mock('three', () => ({
  MeshStandardMaterial: vi.fn().mockImplementation(() => ({
    color: { set: vi.fn() },
    transparent: false,
    opacity: 1,
  })),
  MeshBasicMaterial: vi.fn().mockImplementation(() => ({
    color: { set: vi.fn() },
    transparent: false,
    opacity: 1,
  })),
  BoxGeometry: vi.fn().mockImplementation(() => ({})),
  Mesh: vi.fn().mockImplementation(() => ({
    position: { x: 0, y: 0, z: 0, set: vi.fn(), setScalar: vi.fn() },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1, setScalar: vi.fn() },
    material: {},
  })),
}));

// Add JSX component mocks for React Three Fiber components
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

// Set up global JSX components for React Three Fiber
const MeshComponent = React.forwardRef<HTMLDivElement, any>((props: any, ref: any) => 
  React.createElement('div', { 'data-testid': 'three-mesh', ref, ...props })
);
MeshComponent.displayName = 'mesh';
(global as any).mesh = MeshComponent;
const BoxGeometryComponent = React.forwardRef<HTMLDivElement, any>((props: any, ref: any) => 
  React.createElement('div', { 'data-testid': 'three-box-geometry', ref, ...props })
);
BoxGeometryComponent.displayName = 'boxGeometry';
(global as any).boxGeometry = BoxGeometryComponent;
const MeshStandardMaterialComponent = React.forwardRef<HTMLDivElement, any>((props: any, ref: any) => 
  React.createElement('div', { 'data-testid': 'three-mesh-standard-material', ref, ...props })
);
MeshStandardMaterialComponent.displayName = 'meshStandardMaterial';
(global as any).meshStandardMaterial = MeshStandardMaterialComponent;
const MeshBasicMaterialComponent = React.forwardRef<HTMLDivElement, any>((props: any, ref: any) => 
  React.createElement('div', { 'data-testid': 'three-mesh-basic-material', ref, ...props })
);
MeshBasicMaterialComponent.displayName = 'meshBasicMaterial';
(global as any).meshBasicMaterial = MeshBasicMaterialComponent;

// Mock @react-three/drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn(() => React.createElement('div', { 'data-testid': 'orbit-controls' })),
  Box: vi.fn((props) => React.createElement('div', { 'data-testid': 'drei-box', ...props })),
  Text: vi.fn((props) => React.createElement('div', { 'data-testid': 'drei-text', ...props }, props.children)),
  // Add missing components that are used in tests
  ambientLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-ambient-light' })),
  directionalLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-directional-light' })),
  pointLight: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-point-light' })),
  planeGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-plane-geometry' })),
  ringGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-ring-geometry' })),
  sphereGeometry: vi.fn(() => React.createElement('div', { 'data-testid': 'drei-sphere-geometry' })),
}));

// Global test setup
beforeEach(() => {
  // Clear any mocks before each test
  vi.clearAllMocks();
  
  // Prevent memory leaks by limiting animation frames
  if (typeof window !== 'undefined') {
    let frameCount = 0;
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      frameCount++;
      if (frameCount > 100) { // Limit animation frames in tests
        return -1;
      }
      return originalRAF(callback);
    };
  }
});

// Add memory management for test environment
afterEach(() => {
  // Force garbage collection if available (in Node.js with --expose-gc)
  if (global.gc) {
    global.gc();
  }
});
