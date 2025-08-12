import { Server, Socket } from 'socket.io';
import { roomService } from '../services/roomService';
import { contentService } from '../services/contentService';
import { logger } from '../utils/logger';
import { 
  CreateRoomData, 
  JoinRoomData, 
  PickBlockData, 
  AnswerQuizData,
  ChatMessageData,
  Room,
  Player,
  Block
} from '@privacy-jenga/types';

export function setupSocketHandlers(io: Server, socket: Socket) {
  
  // Create room
  socket.on('create_room', async (data: CreateRoomData) => {
    try {
      const room = await roomService.createRoom(data.settings);
      
      socket.emit('room_created', {
        roomId: room.id,
        code: room.code,
        settings: room.settings
      });
      
      logger.info(`Room created: ${room.id} by ${socket.id}`);
    } catch (error) {
      logger.error('Error creating room:', error);
      socket.emit('error', { message: 'Failed to create room' });
    }
  });
  
  // Join room
  socket.on('join_room', async (data: JoinRoomData) => {
    try {
      const result = await roomService.joinRoom(data.roomId, {
        nickname: data.nickname,
        avatar: data.avatar
      });
      
      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }
      
      // Join socket room
      socket.join(data.roomId);
      
      // Store player session
      socket.data.roomId = data.roomId;
      socket.data.playerId = result.playerId;
      
      // Notify room of new player
      io.to(data.roomId).emit('player_joined', {
        player: result.roomState.players.find(p => p.id === result.playerId)
      });
      
      // Send current room state to joining player
      socket.emit('room_state', { room: result.roomState });
      
      logger.info(`Player joined room: ${data.roomId} - ${data.nickname}`);
    } catch (error) {
      logger.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  // Start game
  socket.on('start_game', async () => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (!roomId || !playerId) {
        socket.emit('error', { message: 'Not in a room' });
        return;
      }
      
      const result = await roomService.startGame(roomId, playerId);
      
      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }
      
      // Notify all players in room
      io.to(roomId).emit('game_started', {
        turnOrder: result.turnOrder,
        blocks: result.blocks
      });
      
      logger.info(`Game started in room: ${roomId}`);
    } catch (error) {
      logger.error('Error starting game:', error);
      socket.emit('error', { message: 'Failed to start game' });
    }
  });
  
  // Pick block
  socket.on('pick_block', async (data: PickBlockData) => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (!roomId || !playerId) {
        socket.emit('error', { message: 'Not in a room' });
        return;
      }
      
      const result = await roomService.pickBlock(roomId, playerId, data.blockId);
      
      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }
      
      // Get content for the block
      const content = await contentService.getContentById(result.block.contentId);
      
      // Notify all players in room
      io.to(roomId).emit('block_removed', {
        blockId: data.blockId,
        content,
        removedBy: playerId,
        pointsAwarded: result.pointsAwarded,
        newGameState: result.newGameState
      });
      
      // Update turn
      const nextTurn = await roomService.advanceTurn(roomId);
      if (nextTurn) {
        io.to(roomId).emit('turn_changed', {
          nextPlayerId: nextTurn,
          timeRemaining: 30 // 30 seconds per turn
        });
      }
      
      logger.info(`Block picked in room ${roomId}: ${data.blockId} by ${playerId}`);
    } catch (error) {
      logger.error('Error picking block:', error);
      socket.emit('error', { message: 'Failed to pick block' });
    }
  });
  
  // Answer quiz
  socket.on('answer_quiz', async (data: AnswerQuizData) => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (!roomId || !playerId) {
        socket.emit('error', { message: 'Not in a room' });
        return;
      }
      
      const result = await roomService.answerQuiz(roomId, playerId, data.blockId, data.answer);
      
      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }
      
      // Notify all players of quiz result
      io.to(roomId).emit('quiz_result', {
        blockId: data.blockId,
        playerId,
        correct: result.correct,
        explanation: result.explanation,
        points: result.points
      });
      
      // Update scores
      const scores = await roomService.getRoomScores(roomId);
      io.to(roomId).emit('score_update', { scores });
      
      logger.info(`Quiz answered in room ${roomId}: ${data.blockId} by ${playerId} - ${result.correct ? 'correct' : 'incorrect'}`);
    } catch (error) {
      logger.error('Error answering quiz:', error);
      socket.emit('error', { message: 'Failed to answer quiz' });
    }
  });
  
  // Chat message
  socket.on('chat_message', async (data: ChatMessageData) => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (!roomId || !playerId) {
        socket.emit('error', { message: 'Not in a room' });
        return;
      }
      
      // Validate message
      if (!data.text || data.text.length > 200) {
        socket.emit('error', { message: 'Invalid message' });
        return;
      }
      
      // Get player info
      const room = await roomService.getRoomById(roomId);
      const player = room?.players.find(p => p.id === playerId);
      
      if (!player) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }
      
      // Broadcast message to room
      io.to(roomId).emit('chat_message', {
        playerId,
        nickname: player.nickname,
        avatar: player.avatar,
        text: data.text,
        timestamp: new Date()
      });
      
      logger.info(`Chat message in room ${roomId}: ${player.nickname}: ${data.text}`);
    } catch (error) {
      logger.error('Error sending chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Heartbeat
  socket.on('heartbeat', async () => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (roomId && playerId) {
        await roomService.updatePlayerActivity(roomId, playerId);
      }
    } catch (error) {
      logger.error('Error updating player activity:', error);
    }
  });
  
  // Disconnect handling
  socket.on('disconnect', async () => {
    try {
      const roomId = socket.data.roomId;
      const playerId = socket.data.playerId;
      
      if (roomId && playerId) {
        await roomService.handlePlayerDisconnect(roomId, playerId);
        
        // Notify other players
        io.to(roomId).emit('player_disconnected', { playerId });
        
        logger.info(`Player disconnected: ${playerId} from room ${roomId}`);
      }
    } catch (error) {
      logger.error('Error handling disconnect:', error);
    }
  });
}
