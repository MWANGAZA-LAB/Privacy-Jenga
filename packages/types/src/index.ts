// Core Game Types
export interface Room {
  id: string;
  code: string;
  settings: RoomSettings;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  blocks: Block[];
  currentTurn: string | null;
  turnOrder: string[];
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  expiresAt: Date;
}

export interface RoomSettings {
  maxPlayers: number;
  mode: 'classic' | 'timed' | 'tournament';
  timeLimit?: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Player {
  id: string;
  roomId: string;
  nickname: string;
  avatar: string;
  sessionId: string;
  points: number;
  joinedAt: Date;
  isHost: boolean;
  isConnected: boolean;
  lastSeen: Date;
}

export interface Block {
  id: string;
  contentId: string;
  positionIndex: number;
  removed: boolean;
  removedBy?: string;
  removedAt?: Date;
  x: number;
  y: number;
  z: number;
}

export interface Content {
  id: string;
  title: string;
  text: string;
  severity: 'tip' | 'warning' | 'critical';
  quiz?: Quiz;
  tags: string[];
  locale: string;
  category: string;
}

export interface Quiz {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

// Socket Event Types
export interface SocketEvents {
  // Client → Server
  create_room: CreateRoomData;
  join_room: JoinRoomData;
  start_game: StartGameData;
  pick_block: PickBlockData;
  answer_quiz: AnswerQuizData;
  chat_message: ChatMessageData;
  heartbeat: HeartbeatData;
  
  // Server → Client
  room_created: RoomCreatedData;
  player_joined: PlayerJoinedData;
  game_started: GameStartedData;
  block_removed: BlockRemovedData;
  quiz_result: QuizResultData;
  turn_changed: TurnChangedData;
  score_update: ScoreUpdateData;
  room_state: RoomStateData;
  error: ErrorData;
}

export interface CreateRoomData {
  settings: RoomSettings;
}

export interface JoinRoomData {
  roomId: string;
  nickname: string;
  avatar?: string;
}

export interface StartGameData {
  roomId: string;
}

export interface PickBlockData {
  roomId: string;
  blockId: string;
}

export interface AnswerQuizData {
  roomId: string;
  blockId: string;
  answer: number;
}

export interface ChatMessageData {
  roomId: string;
  text: string;
}

export interface HeartbeatData {
  roomId: string;
}

export interface RoomCreatedData {
  roomId: string;
  code: string;
  settings: RoomSettings;
}

export interface PlayerJoinedData {
  player: Player;
}

export interface GameStartedData {
  turnOrder: string[];
  blocks: Block[];
}

export interface BlockRemovedData {
  blockId: string;
  content: Content;
  removedBy: string;
  pointsAwarded: number;
  newGameState: Partial<Room>;
}

export interface QuizResultData {
  blockId: string;
  playerId: string;
  correct: boolean;
  explanation: string;
  points: number;
}

export interface TurnChangedData {
  nextPlayerId: string;
  timeRemaining: number;
}

export interface ScoreUpdateData {
  scores: { [playerId: string]: number };
}

export interface RoomStateData {
  room: Room;
}

export interface ErrorData {
  message: string;
  code?: string;
}

// Database Types
export interface DatabaseRoom {
  id: string;
  code: string;
  settings: string; // JSON string
  status: string;
  created_at: Date;
  expires_at: Date;
}

export interface DatabasePlayer {
  id: string;
  room_id: string;
  nickname: string;
  avatar: string;
  session_id: string;
  points: number;
  joined_at: Date;
  is_host: boolean;
}

export interface DatabaseBlock {
  id: string;
  content_id: string;
  pos_index: number;
  removed: boolean;
  removed_by?: string;
  removed_at?: Date;
}

export interface DatabaseContent {
  id: string;
  title: string;
  text: string;
  severity: string;
  quiz?: string; // JSON string
  tags: string[]; // JSON array
  locale: string;
  category: string;
}

export interface DatabaseEvent {
  id: string;
  room_id: string;
  player_id: string;
  type: string;
  meta: string; // JSON string
  created_at: Date;
}

// Redis Types
export interface RedisRoomState {
  players: Player[];
  blocks: Block[];
  currentTurn: string | null;
  turnOrder: string[];
  gameState: 'waiting' | 'playing' | 'finished';
  timers: { [key: string]: number };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Admin Types
export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'moderator' | 'content_creator';
  permissions: string[];
}

export interface ContentPack {
  id: string;
  name: string;
  description: string;
  locale: string;
  difficulty: string;
  contents: Content[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  roomId: string;
  playerId: string;
  eventType: string;
  metadata: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

export interface LeaderboardEntry {
  id: string;
  playerIdentifier: string;
  pointsTotal: number;
  gamesPlayed: number;
  blocksCompleted: number;
  lastSeen: Date;
}

// Reward Types
export interface Reward {
  id: string;
  playerId: string;
  type: 'points' | 'badge' | 'sats';
  amount: number;
  description: string;
  claimed: boolean;
  claimedAt?: Date;
  expiresAt: Date;
}

export interface LightningClaim {
  id: string;
  playerId: string;
  amount: number; // sats
  invoice: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}
