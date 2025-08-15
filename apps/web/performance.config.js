/**
 * Performance Configuration for Privacy Jenga
 * Optimized for gaming, 3D graphics, and smooth user experience
 */

module.exports = {
  // Build Optimizations
  build: {
    // Code Splitting
    codeSplitting: {
      vendor: ['react', 'react-dom'],
      three: ['three', '@react-three/fiber', '@react-three/drei'],
      utils: ['framer-motion', 'lucide-react'],
      game: ['./src/components/jenga', './src/pages/GamePage'],
      ui: ['./src/components', './src/pages/HomePage']
    },
    
    // Bundle Analysis
    analyze: process.env.NODE_ENV === 'development',
    bundleAnalyzer: {
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: 'bundle-analysis.html'
    },
    
    // Tree Shaking
    treeShaking: true,
    sideEffects: false,
    
    // Minification
    minify: process.env.NODE_ENV === 'production',
    terser: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    }
  },

  // 3D Graphics Optimization
  graphics: {
    // Three.js Optimizations
    three: {
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: false,
      precision: 'highp'
    },
    
    // Canvas Optimization
    canvas: {
      preserveDrawingBuffer: false,
      alpha: false,
      premultipliedAlpha: false,
      failIfMajorPerformanceCaveat: false
    },
    
    // Texture Optimization
    textures: {
      maxSize: 2048,
      format: 'webp',
      quality: 0.8,
      compression: true
    },
    
    // Geometry Optimization
    geometry: {
      mergeVertices: true,
      optimizeNormals: true,
      optimizeUvs: true
    }
  },

  // Game Performance
  game: {
    // Frame Rate
    targetFPS: 60,
    maxFPS: 120,
    
    // Physics
    physics: {
      enabled: true,
      gravity: -9.81,
      solverIterations: 10,
      broadphase: 'SAP'
    },
    
    // Level of Detail
    lod: {
      enabled: true,
      distances: [10, 25, 50, 100],
      quality: ['high', 'medium', 'low', 'minimal']
    },
    
    // Culling
    culling: {
      frustum: true,
      occlusion: true,
      distance: true,
      maxDistance: 1000
    }
  },

  // Asset Loading
  assets: {
    // Preloading
    preload: {
      critical: ['game-core', 'ui-essential'],
      important: ['game-assets', 'audio'],
      optional: ['tutorials', 'help-content']
    },
    
    // Lazy Loading
    lazy: {
      enabled: true,
      threshold: 0.1,
      rootMargin: '50px'
    },
    
    // Compression
    compression: {
      gzip: true,
      brotli: true,
      images: 'webp',
      audio: 'opus'
    }
  },

  // Memory Management
  memory: {
    // Garbage Collection
    gc: {
      enabled: true,
      threshold: 100 * 1024 * 1024, // 100MB
      interval: 30000 // 30 seconds
    },
    
    // Object Pooling
    pooling: {
      enabled: true,
      maxPoolSize: 1000,
      cleanupInterval: 60000 // 1 minute
    },
    
    // Texture Memory
    textures: {
      maxMemory: 512 * 1024 * 1024, // 512MB
      compression: true,
      mipmaps: true
    }
  },

  // Network Optimization
  network: {
    // HTTP/2 Push
    http2Push: true,
    
    // Service Worker
    serviceWorker: {
      enabled: true,
      cacheStrategy: 'stale-while-revalidate',
      maxCacheSize: 100 * 1024 * 1024 // 100MB
    },
    
    // CDN
    cdn: {
      enabled: process.env.NODE_ENV === 'production',
      domains: ['cdn.bitsacco.com', 'cdn.mwanga-lab.com']
    }
  },

  // Caching Strategy
  caching: {
    // Browser Cache
    browser: {
      static: '1 year',
      dynamic: '1 hour',
      api: '5 minutes'
    },
    
    // Application Cache
    app: {
      gameState: '1 hour',
      userPreferences: '1 week',
      gameAssets: '1 month'
    }
  },

  // Monitoring & Metrics
  monitoring: {
    // Performance Metrics
    performance: {
      enabled: true,
      metrics: ['FPS', 'memory', 'loadTime', 'renderTime'],
      sampling: 1000 // 1 second
    },
    
    // Error Tracking
    errors: {
      enabled: true,
      maxErrors: 100,
      reportTo: process.env.NODE_ENV === 'production' ? 'error-service' : 'console'
    },
    
    // User Experience
    ux: {
      enabled: true,
      metrics: ['TTFB', 'FCP', 'LCP', 'CLS', 'FID'],
      thresholds: {
        TTFB: 800,
        FCP: 1800,
        LCP: 2500,
        CLS: 0.1,
        FID: 100
      }
    }
  },

  // Development Tools
  development: {
    // Hot Reload
    hotReload: {
      enabled: process.env.NODE_ENV === 'development',
      overlay: true,
      fastRefresh: true
    },
    
    // Debug Tools
    debug: {
      enabled: process.env.NODE_ENV === 'development',
      threeInspector: true,
      performancePanel: true,
      memoryProfiler: true
    },
    
    // Profiling
    profiling: {
      enabled: process.env.NODE_ENV === 'development',
      cpu: true,
      memory: true,
      gpu: true
    }
  },

  // Production Optimizations
  production: {
    // Bundle Optimization
    bundle: {
      splitChunks: true,
      runtimeChunk: true,
      minimize: true,
      sourceMap: false
    },
    
    // Image Optimization
    images: {
      optimization: true,
      webp: true,
      responsive: true,
      lazy: true
    },
    
    // Critical CSS
    criticalCSS: {
      enabled: true,
      inline: true,
      extract: true
    }
  },

  // Testing & Quality
  testing: {
    // Performance Testing
    performance: {
      lighthouse: true,
      webPageTest: true,
      bundleAnalyzer: true
    },
    
    // Load Testing
    load: {
      enabled: true,
      concurrentUsers: 100,
      duration: 300, // 5 minutes
      rampUp: 60 // 1 minute
    },
    
    // Memory Testing
    memory: {
      enabled: true,
      maxMemory: 1 * 1024 * 1024 * 1024, // 1GB
      leakDetection: true
    }
  }
};
