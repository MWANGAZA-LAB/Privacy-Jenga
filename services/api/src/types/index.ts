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

// Admin Types
export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'moderator' | 'content_creator';
  permissions: string[];
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
