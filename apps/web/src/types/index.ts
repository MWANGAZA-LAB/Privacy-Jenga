// Shared types for Privacy Jenga client (mirrors server types)

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  isHost: boolean;
  joinedAt: Date;
  lastActive: Date;
}

export interface Block {
  id: string;
  positionIndex: number;
  level: number;
  position: number;
  contentId: string;
  removed: boolean;
  removedBy?: string;
  removedAt?: Date;
}

export interface Content {
  id: string;
  title: string;
  text: string;
  severity: 'tip' | 'warning' | 'critical';
  quiz?: {
    question: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
  };
  tags: string[];
  category: string;
}

export interface Room {
  id: string;
  code: string;
  players: Player[];
  blocks: Block[];
  currentTurn: string;
  gameState: 'lobby' | 'playing' | 'finished';
  settings: {
    maxPlayers: number;
    turnTimeoutSeconds: number;
    allowChat: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  winner?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  playerId: string;
  nickname: string;
  message: string;
  timestamp: Date;
}

export interface GameEvent {
  type: 'block_removed' | 'quiz_answered' | 'turn_changed' | 'player_joined' | 'player_left' | 'game_started' | 'game_ended';
  data: any;
  timestamp: Date;
}

// UI-specific types
export interface GameState {
  room: Room | null;
  currentPlayer: Player | null;
  selectedBlock: Block | null;
  showContent: Content | null;
  isMyTurn: boolean;
  turnTimeLeft: number;
  chatMessages: ChatMessage[];
  gameEvents: GameEvent[];
}

export interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (_block: Block) => void;
  isInteractive: boolean;
  selectedBlockId?: string;
}

export interface BlockProps {
  block: Block;
  onClick: (_block: Block) => void;
  isSelected: boolean;
  isClickable: boolean;
  position: [number, number, number];
}

export interface ContentModalProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (_selectedAnswer: number) => void;
  showQuiz?: boolean;
}

export interface PlayerListProps {
  players: Player[];
  currentTurn: string;
  currentPlayerId?: string;
}

export interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (_message: string) => void;
  disabled?: boolean;
}

export interface RoomSettingsProps {
  settings: Room['settings'];
  onChange: (_settings: Partial<Room['settings']>) => void;
  disabled?: boolean;
}

// Socket event types for client
export interface ServerToClientEvents {
  room_joined: (data: { room: Room; playerId: string }) => void;
  player_joined: (player: Player) => void;
  player_left: (playerId: string) => void;
  game_started: (room: Room) => void;
  block_removed: (data: { blockId: string; contentId: string; actor: string; newGameState: Room }) => void;
  turn_changed: (data: { playerId: string; timeoutAt: Date }) => void;
  quiz_answered: (data: { playerId: string; correct: boolean; points: number }) => void;
  score_updated: (data: { playerId: string; newScore: number }) => void;
  chat_message: (message: ChatMessage) => void;
  game_ended: (data: { winner?: string; reason: string; finalScores: { playerId: string; points: number }[] }) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  create_room: (data: { nickname: string; settings?: Partial<Room['settings']> }, callback: (response: { success: boolean; room?: Room; error?: string }) => void) => void;
  join_room: (data: { code: string; nickname: string }, callback: (response: { success: boolean; room?: Room; playerId?: string; error?: string }) => void) => void;
  leave_room: () => void;
  start_game: () => void;
  pick_block: (data: { blockId: string }) => void;
  answer_quiz: (data: { blockId: string; selectedIndex: number }) => void;
  send_chat: (data: { message: string }) => void;
  get_room_state: (callback: (room: Room | null) => void) => void;
}

// Form types
export interface CreateRoomForm {
  nickname: string;
  maxPlayers: number;
  turnTimeoutSeconds: number;
  allowChat: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface JoinRoomForm {
  code: string;
  nickname: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContentResponse {
  content: Content[];
}

// Game statistics
export interface GameStats {
  blocksRemoved: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  totalPoints: number;
  playTime: number;
}

// Bitsacco integration types (future)
export interface BitsaccoReward {
  amount: number; // satoshis
  reason: string;
  txId?: string;
  claimed: boolean;
}

export interface PlayerProfile {
  id: string;
  nickname: string;
  totalGamesPlayed: number;
  totalPoints: number;
  badges: string[];
  bitsaccoRewards: BitsaccoReward[];
  privacyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
