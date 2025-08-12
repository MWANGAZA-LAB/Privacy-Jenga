import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { ServerToClientEvents, ClientToServerEvents, Room, Player, ChatMessage, Content } from '@/types';

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [turnTimeLeft, setTurnTimeLeft] = useState(0);
  
  const turnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'] as any, // Try polling first for better stability
      timeout: 20000,
      forceNew: false, // Allow connection reuse
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      upgrade: true,
      rememberUpgrade: true
    } as any);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      toast.success('Connected to game server');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setConnected(false);
      setRoom(null);
      setCurrentPlayer(null);
      toast.error('Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Failed to connect to server');
    });

    // Game events
    newSocket.on('room_joined', ({ room: joinedRoom, playerId }) => {
      console.log('Joined room:', joinedRoom.code);
      setRoom(joinedRoom);
      const player = joinedRoom.players.find((p: Player) => p.id === playerId);
      setCurrentPlayer(player || null);
      setIsMyTurn(joinedRoom.currentTurn === playerId);
      toast.success(`Joined room ${joinedRoom.code}`);
    });

    newSocket.on('player_joined', (player) => {
      console.log('Player joined:', player.nickname);
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          players: [...prevRoom.players, player]
        };
      });
      toast.success(`${player.nickname} joined the game`);
    });

    newSocket.on('player_left', (playerId) => {
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        const leavingPlayer = prevRoom.players.find(p => p.id === playerId);
        if (leavingPlayer) {
          toast(`${leavingPlayer.nickname} left the game`, { icon: '👋' });
        }
        return {
          ...prevRoom,
          players: prevRoom.players.filter(p => p.id !== playerId)
        };
      });
    });

    newSocket.on('game_started', (updatedRoom) => {
      console.log('Game started');
      setRoom(updatedRoom);
      toast.success('Game started! 🎮');
    });

    newSocket.on('block_removed', ({ blockId, actor, newGameState }) => {
      console.log('Block removed:', blockId);
      setRoom(newGameState);
      
      const actorPlayer = newGameState.players.find((p: Player) => p.id === actor);
      if (actorPlayer) {
        toast.success(`${actorPlayer.nickname} removed a block!`);
      }
    });

    newSocket.on('turn_changed', ({ playerId, timeoutAt }) => {
      console.log('Turn changed to:', playerId);
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, currentTurn: playerId };
      });
      
      const isMyNewTurn = playerId === currentPlayer?.id;
      setIsMyTurn(isMyNewTurn);
      
      if (isMyNewTurn) {
        toast.success("It's your turn!", { icon: '🎯' });
      }
      
      // Start turn timer
      const timeLeft = Math.max(0, new Date(timeoutAt).getTime() - Date.now());
      setTurnTimeLeft(Math.floor(timeLeft / 1000));
      
      if (turnTimerRef.current) {
        clearInterval(turnTimerRef.current);
      }
      
      turnTimerRef.current = setInterval(() => {
        setTurnTimeLeft(prev => {
          if (prev <= 1) {
            if (turnTimerRef.current) {
              clearInterval(turnTimerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    newSocket.on('quiz_answered', ({ playerId, correct, points }) => {
      const player = room?.players.find(p => p.id === playerId);
      if (player) {
        if (correct) {
          toast.success(`${player.nickname} answered correctly! +${points} points`, { icon: '✅' });
        } else {
          toast(`${player.nickname} answered incorrectly`, { icon: '❌' });
        }
      }
    });

    newSocket.on('score_updated', ({ playerId, newScore }) => {
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          players: prevRoom.players.map(p => 
            p.id === playerId ? { ...p, points: newScore } : p
          )
        };
      });
    });

    newSocket.on('chat_message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    newSocket.on('game_ended', ({ winner, reason }) => {
      console.log('Game ended:', reason);
      setRoom(prevRoom => {
        if (!prevRoom) return null;
        return { ...prevRoom, gameState: 'finished', winner };
      });
      
      if (winner === currentPlayer?.id) {
        toast.success('🎉 You won!');
      } else if (winner) {
        const winnerPlayer = room?.players.find(p => p.id === winner);
        toast.success(`🎉 ${winnerPlayer?.nickname || 'Someone'} won!`);
      } else {
        toast(`Game ended: ${reason}`);
      }
    });

    newSocket.on('error', (message) => {
      console.error('Socket error:', message);
      toast.error(message);
    });

    setSocket(newSocket);

    return () => {
      if (turnTimerRef.current) {
        clearInterval(turnTimerRef.current);
      }
      newSocket.close();
    };
  }, [currentPlayer?.id, room?.players]);

  // Socket methods
  const createRoom = (nickname: string, settings?: Partial<Room['settings']>) => {
    return new Promise<{ success: boolean; room?: Room; error?: string }>((resolve) => {
      if (!socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }
      
      socket.emit('create_room', { nickname, settings }, resolve);
    });
  };

  const joinRoom = (code: string, nickname: string) => {
    return new Promise<{ success: boolean; room?: Room; playerId?: string; error?: string }>((resolve) => {
      if (!socket) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }
      
      socket.emit('join_room', { code, nickname }, resolve);
    });
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave_room');
      setRoom(null);
      setCurrentPlayer(null);
      setChatMessages([]);
      setSelectedContent(null);
      setIsMyTurn(false);
      setTurnTimeLeft(0);
      
      if (turnTimerRef.current) {
        clearInterval(turnTimerRef.current);
      }
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit('start_game');
    }
  };

  const pickBlock = (blockId: string) => {
    if (socket && isMyTurn) {
      socket.emit('pick_block', { blockId });
    }
  };

  const answerQuiz = (blockId: string, selectedIndex: number) => {
    if (socket) {
      socket.emit('answer_quiz', { blockId, selectedIndex });
    }
  };

  const sendChatMessage = (message: string) => {
    if (socket && room?.settings.allowChat) {
      socket.emit('send_chat', { message });
    }
  };

  const getRoomState = () => {
    return new Promise<Room | null>((resolve) => {
      if (!socket) {
        resolve(null);
        return;
      }
      
      socket.emit('get_room_state', resolve);
    });
  };

  return {
    socket,
    connected,
    room,
    currentPlayer,
    chatMessages,
    selectedContent,
    isMyTurn,
    turnTimeLeft,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    pickBlock,
    answerQuiz,
    sendChatMessage,
    getRoomState,
    setSelectedContent,
  };
};
