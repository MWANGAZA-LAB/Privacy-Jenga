import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import contentRoutes from './routes/contentRoutes';
import roomRoutes from './routes/roomRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mwangaza-lab.github.io', 'https://privacy-jenga.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security and parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint with detailed system info
app.get('/health', (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    service: 'Privacy Jenga API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
    },
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  };
  
  res.status(200).json(healthCheck);
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler with enhanced information
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      health: 'GET /health',
      admin: 'GET /api/admin',
      analytics: 'GET /api/analytics', 
      content: 'GET /api/content',
      rooms: 'GET /api/rooms'
    }
  });
});

// Enhanced error handler with proper logging
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp
  });
});

// Start server with graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`🚀 Privacy Jenga API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Server started at ${new Date().toISOString()}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

export default app;
