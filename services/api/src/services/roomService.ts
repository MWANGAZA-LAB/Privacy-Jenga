import { v4 as uuidv4 } from 'uuid';
import { Room, Player, RoomSettings, Block } from '../types';
import { logger } from '../utils/logger';

class RoomService {
  private rooms: Map<string, Room> = new Map();

  async createRoom(settings: RoomSettings): Promise<Room> {
    const roomId = uuidv4();
    const code = this.generateRoomCode();
    
    const room: Room = {
      id: roomId,
      code,
      settings,
      status: 'waiting',
      players: [],
      blocks: this.generateInitialBlocks(),
      currentTurn: null,
      turnOrder: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.rooms.set(roomId, room);
    logger.info(`Room created: ${roomId} with code ${code}`);
    
    return room;
  }

  async joinRoom(roomId: string, playerData: { nickname: string; avatar?: string }): Promise<{
    success: boolean;
    playerId?: string;
    roomState?: Room;
    error?: string;
  }> {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.status !== 'waiting') {
      return { success: false, error: 'Game already started' };
    }

    if (room.players.length >= room.settings.maxPlayers) {
      return { success: false, error: 'Room is full' };
    }

    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      roomId,
      nickname: playerData.nickname,
      avatar: playerData.avatar || '🐎',
      sessionId: uuidv4(),
      points: 0,
      joinedAt: new Date(),
      isHost: room.players.length === 0,
      isConnected: true,
      lastSeen: new Date()
    };

    room.players.push(player);
    
    if (room.players.length === 1) {
      room.currentTurn = playerId;
    }

    logger.info(`Player joined room: ${roomId} - ${playerData.nickname}`);
    
    return {
      success: true,
      playerId,
      roomState: room
    };
  }

  async getRoomById(roomId: string): Promise<Room | undefined> {
    return this.rooms.get(roomId);
  }

  async getRoomByCode(code: string): Promise<Room | undefined> {
    for (const room of this.rooms.values()) {
      if (room.code === code.toUpperCase()) {
        return room;
      }
    }
    return undefined;
  }

  async getRoomState(roomId: string): Promise<Room | undefined> {
    return this.rooms.get(roomId);
  }

  async startGame(roomId: string, playerId: string): Promise<{
    success: boolean;
    turnOrder?: string[];
    blocks?: Block[];
    error?: string;
  }> {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player || !player.isHost) {
      return { success: false, error: 'Only host can start game' };
    }

    if (room.players.length < 2) {
      return { success: false, error: 'Need at least 2 players' };
    }

    room.status = 'playing';
    room.startedAt = new Date();
    room.turnOrder = room.players.map(p => p.id);
    room.currentTurn = room.players[0].id;

    logger.info(`Game started in room: ${roomId}`);
    
    return {
      success: true,
      turnOrder: room.turnOrder,
      blocks: room.blocks
    };
  }

  async pickBlock(roomId: string, playerId: string, blockId: string): Promise<{
    success: boolean;
    block?: Block;
    pointsAwarded?: number;
    newGameState?: Partial<Room>;
    error?: string;
  }> {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.status !== 'playing') {
      return { success: false, error: 'Game not in progress' };
    }

    if (room.currentTurn !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    const block = room.blocks.find(b => b.id === blockId);
    if (!block || block.removed) {
      return { success: false, error: 'Block not available' };
    }

    // Mark block as removed
    block.removed = true;
    block.removedBy = playerId;
    block.removedAt = new Date();

    // Award points (basic scoring)
    const pointsAwarded = 10;
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.points += pointsAwarded;
    }

    logger.info(`Block picked in room ${roomId}: ${blockId} by ${playerId}`);
    
    return {
      success: true,
      block,
      pointsAwarded,
      newGameState: {
        blocks: room.blocks,
        players: room.players
      }
    };
  }

  async advanceTurn(roomId: string): Promise<string | null> {
    const room = this.rooms.get(roomId);
    
    if (!room || room.status !== 'playing') {
      return null;
    }

    const currentIndex = room.turnOrder.indexOf(room.currentTurn || '');
    if (currentIndex === -1) {
      return null;
    }

    const nextIndex = (currentIndex + 1) % room.turnOrder.length;
    const nextPlayerId = room.turnOrder[nextIndex];
    
    room.currentTurn = nextPlayerId;
    
    return nextPlayerId;
  }

  async answerQuiz(roomId: string, playerId: string, blockId: string, answer: number): Promise<{
    success: boolean;
    correct?: boolean;
    explanation?: string;
    points?: number;
    error?: string;
  }> {
    // This would integrate with content service to validate quiz answers
    // For now, return a simple response
    const correct = Math.random() > 0.5; // Random for demo
    const points = correct ? 5 : 0;
    const explanation = correct ? 'Correct answer!' : 'Wrong answer. Try again!';

    return {
      success: true,
      correct,
      explanation,
      points
    };
  }

  async getRoomScores(roomId: string): Promise<{ [playerId: string]: number }> {
    const room = this.rooms.get(roomId);
    if (!room) {
      return {};
    }

    const scores: { [playerId: string]: number } = {};
    room.players.forEach(player => {
      scores[player.id] = player.points;
    });

    return scores;
  }

  async updatePlayerActivity(roomId: string, playerId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.lastSeen = new Date();
    }
  }

  async handlePlayerDisconnect(roomId: string, playerId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isConnected = false;
      player.lastSeen = new Date();
    }
  }

  async getActiveRooms(options: { limit: number; offset: number }): Promise<Partial<Room>[]> {
    const activeRooms = Array.from(this.rooms.values())
      .filter(room => room.status === 'waiting')
      .slice(options.offset, options.offset + options.limit)
      .map(room => ({
        id: room.id,
        code: room.code,
        settings: room.settings,
        status: room.status,
        playerCount: room.players.length,
        maxPlayers: room.settings.maxPlayers
      }));

    return activeRooms;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateInitialBlocks(): Block[] {
    const blocks: Block[] = [];
    let blockIndex = 0;

    // Generate a 3x3x18 Jenga tower
    for (let layer = 0; layer < 18; layer++) {
      const isHorizontal = layer % 2 === 0;
      const y = layer * 0.3;
      
      if (isHorizontal) {
        // Horizontal blocks (along X axis)
        for (let x = -1; x <= 1; x++) {
          blocks.push({
            id: uuidv4(),
            contentId: `content_${blockIndex++}`,
            positionIndex: blockIndex - 1,
            removed: false,
            x: x * 0.3,
            y,
            z: 0
          });
        }
      } else {
        // Vertical blocks (along Z axis)
        for (let z = -1; z <= 1; z++) {
          blocks.push({
            id: uuidv4(),
            contentId: `content_${blockIndex++}`,
            positionIndex: blockIndex - 1,
            removed: false,
            x: 0,
            y,
            z: z * 0.3
          });
        }
      }
    }

    return blocks;
  }
}

export const roomService = new RoomService();
