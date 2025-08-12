import { Router } from 'express';
import { z } from 'zod';
import { roomService } from '../services/roomService';
import { validateRequest } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createRoomSchema = z.object({
  settings: z.object({
    maxPlayers: z.number().min(2).max(6),
    mode: z.enum(['classic', 'timed', 'tournament']),
    timeLimit: z.number().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard'])
  })
});

const joinRoomSchema = z.object({
  roomId: z.string().uuid(),
  nickname: z.string().min(1).max(20),
  avatar: z.string().optional()
});

// Create a new room
router.post('/', validateRequest(createRoomSchema), async (req, res) => {
  try {
    const { settings } = req.body;
    
    const room = await roomService.createRoom(settings);
    
    res.status(201).json({
      success: true,
      data: {
        roomId: room.id,
        code: room.code,
        settings: room.settings
      }
    });
  } catch (error) {
    logger.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create room'
    });
  }
});

// Join an existing room
router.post('/:id/join', validateRequest(joinRoomSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, avatar } = req.body;
    
    const result = await roomService.joinRoom(id, { nickname, avatar });
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: {
        playerId: result.playerId,
        roomState: result.roomState
      }
    });
  } catch (error) {
    logger.error('Error joining room:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join room'
    });
  }
});

// Get room state
router.get('/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    
    const roomState = await roomService.getRoomState(id);
    
    if (!roomState) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: roomState
    });
  } catch (error) {
    logger.error('Error fetching room state:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch room state'
    });
  }
});

// Get room by code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const room = await roomService.getRoomByCode(code);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: room.id,
        code: room.code,
        settings: room.settings,
        status: room.status,
        playerCount: room.players.length,
        maxPlayers: room.settings.maxPlayers
      }
    });
  } catch (error) {
    logger.error('Error fetching room by code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch room'
    });
  }
});

// Start game
router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;
    
    const result = await roomService.startGame(id, playerId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: {
        turnOrder: result.turnOrder,
        blocks: result.blocks
      }
    });
  } catch (error) {
    logger.error('Error starting game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start game'
    });
  }
});

// Get active rooms
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    const rooms = await roomService.getActiveRooms({
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
    
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    logger.error('Error fetching active rooms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms'
    });
  }
});

export default router;
