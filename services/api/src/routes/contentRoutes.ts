import { Router } from 'express';
import { z } from 'zod';
import { contentService } from '../services/contentService';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createContentSchema = z.object({
  title: z.string().min(1).max(200),
  text: z.string().min(1).max(1000),
  severity: z.enum(['tip', 'warning', 'critical']),
  quiz: z.object({
    question: z.string().min(1).max(500),
    choices: z.array(z.string().min(1).max(200)).min(2).max(4),
    correctIndex: z.number().min(0).max(3),
    explanation: z.string().min(1).max(500),
    points: z.number().min(1).max(100)
  }).optional(),
  tags: z.array(z.string()).default([]),
  locale: z.string().default('en'),
  category: z.string().default('general')
});

// Get all content
router.get('/', async (req, res) => {
  try {
    const { locale = 'en', category, difficulty } = req.query;
    
    const content = await contentService.getAllContent({
      locale: locale as string,
      category: category as string,
      difficulty: difficulty as string
    });
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await contentService.getContentById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    });
  }
});

// Create new content
router.post('/', validateRequest(createContentSchema), async (req, res) => {
  try {
    const content = await contentService.createContent(req.body);
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content'
    });
  }
});

// Update content
router.put('/:id', validateRequest(createContentSchema), async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await contentService.updateContent(id, req.body);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    logger.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content'
    });
  }
});

// Delete content
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await contentService.deleteContent(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
});

export default router;
