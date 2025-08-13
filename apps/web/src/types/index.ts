// Game Types
export interface Block {
  id: string;
  content: Content;
  removed: boolean;
  removedBy?: string;
  type: 'safe' | 'risky' | 'challenge';
  difficulty: number; // 1-18 scale (layer number)
  layer: number; // 1-18 layers
  position: number; // 1-3 positions per layer
  stability: number; // How much this block affects tower stability
  category: 'password' | 'social-media' | 'wifi' | 'data-sharing' | 'encryption' | 'general' | 'phishing' | 'backup';
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
  points: number; // Points awarded for this content
  category: 'password' | 'social-media' | 'wifi' | 'data-sharing' | 'encryption' | 'general' | 'phishing' | 'backup';
  fact: string; // Educational fact about the topic
  impact: 'positive' | 'negative' | 'neutral'; // How this affects privacy
}

export interface ChatMessage {
  id: number;
  text: string;
  player: string;
  timestamp: string;
  playerId?: string;
  nickname?: string;
}

export interface Player {
  nickname: string;
  isHost: boolean;
  score: number;
  achievements: Achievement[];
  highScore: number;
  gamesPlayed: number;
  totalPoints: number;
  totalBlocksRemoved: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

export interface Room {
  id: string;
  code: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  currentTurn?: string;
  blocks: Block[];
  settings?: {
    maxPlayers: number;
    turnTimeoutSeconds: number;
    allowChat: boolean;
    difficulty: string;
  };
}

export interface GameState {
  currentPlayer: Player;
  towerHeight: number;
  blocksRemoved: number;
  totalBlocks: number;
  currentScore: number;
  gameMode: 'classic' | 'endless' | 'challenge' | 'learning';
  difficulty: number;
  diceResult: number;
  canPullFromLayers: number[];
  specialActions: SpecialAction[];
  gameHistory: GameMove[];
  layerStats: LayerStats[];
  blockTypeStats: BlockTypeStats;
}

export interface LayerStats {
  layer: number;
  safeBlocks: number;
  riskyBlocks: number;
  challengeBlocks: number;
  totalBlocks: number;
  removedBlocks: number;
}

export interface BlockTypeStats {
  safe: { total: number; removed: number; points: number };
  risky: { total: number; removed: number; points: number };
  challenge: { total: number; removed: number; points: number; correct: number; incorrect: number };
}

export interface GameMove {
  id: string;
  playerId: string;
  blockId: string;
  blockType: string;
  layer: number;
  points: number;
  stability: number;
  timestamp: Date;
  quizAnswered?: boolean;
  quizCorrect?: boolean;
  content: Content;
}

export interface SpecialAction {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  available: boolean;
}

export interface DiceResult {
  value: number;
  effect: string;
  layerRestrictions: number[];
  bonusMultiplier: number;
  specialEvent?: string;
}

// Mock Types for Service
export interface MockPlayer {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
  score: number;
  achievements: Achievement[];
  highScore: number;
  gamesPlayed: number;
  totalPoints: number;
  totalBlocksRemoved: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface MockRoom {
  id: string;
  code: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  currentTurn: number;
  blocks: Block[];
}

// Component Props Types
export interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  isInteractive: boolean;
  selectedBlockId?: string;
  gameState: GameState;
  onDiceRoll: () => void;
}

export interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  currentPlayerId?: string;
}

export interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => Promise<void>;
  showQuiz?: boolean;
  gameState: GameState;
}

export interface PlayerListProps {
  players: Player[];
  currentTurn?: string;
  currentPlayerId?: string;
  gameState: GameState;
}

export interface GameStatsProps {
  gameState: GameState;
  onNewGame: () => void;
  onEndlessMode: () => void;
}
