import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { logger } from '../utils/logger';

const router = Router();

// Get analytics events
router.get('/events', async (req, res) => {
  try {
    const { 
      roomId, 
      playerId, 
      eventType, 
      startDate, 
      endDate,
      page = 1, 
      limit = 100 
    } = req.query;
    
    const events = await analyticsService.getEvents({
      roomId: roomId as string,
      playerId: playerId as string,
      eventType: eventType as string,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    logger.error('Error fetching analytics events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { 
      period = 'all', 
      limit = 50,
      category 
    } = req.query;
    
    const leaderboard = await analyticsService.getLeaderboard({
      period: period as string,
      limit: parseInt(limit as string),
      category: category as string
    });
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get game statistics
router.get('/stats', async (req, res) => {
  try {
    const { 
      period = '7d',
      roomId 
    } = req.query;
    
    const stats = await analyticsService.getGameStats({
      period: period as string,
      roomId: roomId as string
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error fetching game stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// Get content performance
router.get('/content-performance', async (req, res) => {
  try {
    const { 
      period = '30d',
      category,
      difficulty 
    } = req.query;
    
    const performance = await analyticsService.getContentPerformance({
      period: period as string,
      category: category as string,
      difficulty: difficulty as string
    });
    
    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    logger.error('Error fetching content performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content performance'
    });
  }
});

// Get player insights
router.get('/player-insights', async (req, res) => {
  try {
    const { 
      period = '30d',
      playerId 
    } = req.query;
    
    const insights = await analyticsService.getPlayerInsights({
      period: period as string,
      playerId: playerId as string
    });
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    logger.error('Error fetching player insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch player insights'
    });
  }
});

// Track custom event
router.post('/track', async (req, res) => {
  try {
    const { 
      roomId, 
      playerId, 
      eventType, 
      metadata 
    } = req.body;
    
    await analyticsService.trackEvent({
      roomId,
      playerId,
      eventType,
      metadata: metadata || {}
    });
    
    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    logger.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
});

export default router;
