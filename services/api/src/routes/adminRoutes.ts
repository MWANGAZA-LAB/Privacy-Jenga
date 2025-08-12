import { Router } from 'express';
import { z } from 'zod';
import { adminService } from '../services/adminService';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createAdminUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(['admin', 'moderator', 'content_creator']),
  permissions: z.array(z.string()).default([])
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Admin login
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await adminService.login(username, password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    logger.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Create admin user
router.post('/users', validateRequest(createAdminUserSchema), async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error creating admin user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create admin user'
    });
  }
});

// Get admin users
router.get('/users', async (req, res) => {
  try {
    const users = await adminService.getUsers();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching admin users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

// Content management
router.get('/content', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const content = await adminService.getContentForAdmin({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string
    });
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error('Error fetching admin content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// Room management
router.get('/rooms', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const rooms = await adminService.getRoomsForAdmin({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      status: status as string
    });
    
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    logger.error('Error fetching admin rooms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms'
    });
  }
});

// Analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d', type } = req.query;
    
    const analytics = await adminService.getAnalytics({
      period: period as string,
      type: type as string
    });
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

export default router;
