/**
 * Security Configuration for Privacy Jenga
 * Comprehensive security settings and best practices
 */

module.exports = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'object-src': ["'none'"],
    'media-src': ["'self'"],
    'worker-src': ["'self'"],
    'manifest-src': ["'self'"],
    'upgrade-insecure-requests': []
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Content-Security-Policy-Report-Only': false,
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  },

  // Input Validation Rules
  validation: {
    maxInputLength: 1000,
    allowedHtmlTags: [],
    sanitizeInputs: true,
    validateFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // Authentication & Authorization
  auth: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later.'
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://mwanga-lab.github.io', 'https://bitsacco.com']
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
  },

  // Environment Security
  environment: {
    nodeEnv: process.env.NODE_ENV || 'development',
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development',
    test: process.env.NODE_ENV === 'test'
  },

  // Build Security
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    dropConsole: process.env.NODE_ENV === 'production',
    dropDebugger: true,
    pureFunctions: ['console.log', 'console.info', 'console.debug', 'console.warn']
  },

  // Performance & Security Monitoring
  monitoring: {
    enablePerformanceMonitoring: true,
    enableSecurityMonitoring: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    reportErrors: process.env.NODE_ENV === 'production',
    collectMetrics: process.env.NODE_ENV === 'production'
  },

  // Privacy & GDPR Compliance
  privacy: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    anonymizeData: true,
    dataRetentionDays: 90,
    enableCookieConsent: true,
    privacyPolicyUrl: '/privacy-policy',
    termsOfServiceUrl: '/terms-of-service'
  },

  // API Security
  api: {
    enableRateLimiting: true,
    enableRequestValidation: true,
    enableResponseSanitization: true,
    maxRequestBodySize: '10mb',
    timeout: 30000, // 30 seconds
    enableCompression: true
  },

  // File Upload Security
  fileUpload: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    scanForViruses: process.env.NODE_ENV === 'production',
    storeInCloud: process.env.NODE_ENV === 'production',
    enableImageOptimization: true
  },

  // Database Security
  database: {
    enableConnectionEncryption: true,
    enableQueryLogging: process.env.NODE_ENV === 'development',
    enableBackup: process.env.NODE_ENV === 'production',
    backupFrequency: 'daily',
    maxConnections: 10
  },

  // Logging & Auditing
  logging: {
    enableAccessLogs: true,
    enableErrorLogs: true,
    enableSecurityLogs: true,
    logFormat: 'json',
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    enableLogRotation: true,
    maxLogSize: '10m',
    maxLogFiles: 5
  },

  // Error Handling
  errorHandling: {
    showDetailedErrors: process.env.NODE_ENV === 'development',
    enableErrorReporting: process.env.NODE_ENV === 'production',
    logUnhandledErrors: true,
    enableGracefulDegradation: true
  },

  // Testing Security
  testing: {
    enableSecurityTests: true,
    enablePenetrationTests: process.env.NODE_ENV === 'production',
    enableVulnerabilityScans: process.env.NODE_ENV === 'production',
    testCoverage: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  }
};
