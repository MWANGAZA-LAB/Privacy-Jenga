import { Router } from 'express';

const router = Router();

// Admin management routes
router.get('/', (req, res) => {
  res.json({ 
    message: 'Admin routes endpoint',
    endpoints: [
      'GET /api/admin/',
      'GET /api/admin/stats',
      'POST /api/admin/reset'
    ]
  });
});

// Get admin stats
router.get('/stats', (req, res) => {
  res.json({
    totalUsers: 0,
    totalGames: 0,
    totalBlocks: 54,
    systemHealth: 'good'
  });
});

// Reset system (admin only)
router.post('/reset', (req, res) => {
  res.json({ 
    message: 'System reset initiated',
    timestamp: new Date().toISOString()
  });
});

export default router;
