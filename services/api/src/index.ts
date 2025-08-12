import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';
import { setupSocketHandlers } from './socket/gameSocket';
import { initializeDatabase, closeDatabase } from './config/database';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config({ path: '../../env.local' });

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

// Initialize Socket.IO with optional Redis adapter
let io: Server;

try {
  // Try to import Redis (optional for development)
  const Redis = require('redis');
  const { createAdapter } = require('@socket.io/redis-adapter');
  
  const pubClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  const subClient = pubClient.duplicate();
  
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"]
    },
    adapter: createAdapter(pubClient, subClient)
  });
  
  logger.info('Socket.IO initialized with Redis adapter');
} catch (error) {
  // Fallback to in-memory adapter for development
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
  
  logger.info('Socket.IO initialized with in-memory adapter (Redis not available)');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(compression() as unknown as express.RequestHandler);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter as unknown as express.RequestHandler);

// Setup API routes
setupRoutes(app);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  setupSocketHandlers(io, socket);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await closeDatabase();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await closeDatabase();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database (optional for development)
    await initializeDatabase();
    
    server.listen(port, () => {
      logger.info(`🚀 Privacy Jenga API Server running on port ${port}`);
      logger.info(`📱 Web client should be accessible at ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      logger.info(`🔌 Socket.IO server ready for real-time connections`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
