import { Router } from 'express';
import roomRoutes from './roomRoutes';
import contentRoutes from './contentRoutes';
import adminRoutes from './adminRoutes';
import analyticsRoutes from './analyticsRoutes';

export function setupRoutes(app: Router) {
  // API versioning
  const apiRouter = Router();
  
  // Mount route modules
  apiRouter.use('/rooms', roomRoutes);
  apiRouter.use('/content', contentRoutes);
  apiRouter.use('/admin', adminRoutes);
  apiRouter.use('/analytics', analyticsRoutes);
  
  // Mount API router
  app.use('/api/v1', apiRouter);
}
