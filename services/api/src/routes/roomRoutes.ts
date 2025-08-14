import { Router } from 'express';

const router = Router();

// Room management routes
router.get('/', (req, res) => {
  res.json({ 
    message: 'Room routes endpoint',
    endpoints: [
      'GET /api/rooms/',
      'GET /api/rooms/:id',
      'POST /api/rooms/',
      'PUT /api/rooms/:id',
      'DELETE /api/rooms/:id',
      'POST /api/rooms/:id/join',
      'POST /api/rooms/:id/leave'
    ]
  });
});

// Get room by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Get room ${id}`,
    id,
    room: {
      id,
      name: `Room ${id}`,
      players: [],
      status: 'waiting',
      maxPlayers: 4
    }
  });
});

// Create new room
router.post('/', (req, res) => {
  const { name, maxPlayers = 4 } = req.body;
  const roomId = Date.now().toString();
  res.status(201).json({
    message: 'Room created',
    room: {
      id: roomId,
      name,
      maxPlayers,
      players: [],
      status: 'waiting'
    }
  });
});

// Update room
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({
    message: `Room ${id} updated`,
    id,
    updates
  });
});

// Delete room
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Room ${id} deleted`,
    id
  });
});

// Join room
router.post('/:id/join', (req, res) => {
  const { id } = req.params;
  const { playerId, playerName } = req.body;
  res.json({
    message: `Player ${playerName} joined room ${id}`,
    roomId: id,
    playerId,
    playerName
  });
});

// Leave room
router.post('/:id/leave', (req, res) => {
  const { id } = req.params;
  const { playerId } = req.body;
  res.json({
    message: `Player left room ${id}`,
    roomId: id,
    playerId
  });
});

export default router;
