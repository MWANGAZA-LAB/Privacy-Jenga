// Game Types
export interface Block {
  id: string;
  content: Content;
  removed: boolean;
  type: 'safe' | 'risky' | 'challenge';
  difficulty: number; // 1-18 scale (layer number)
  layer: number; // 1-18 layers
  position: number; // 1-3 positions per layer
  stability: number; // How much this block affects tower stability
  category: 'on-chain-privacy' | 'off-chain-practices' | 'coin-mixing' | 'wallet-setup' | 'lightning-network' | 'regulatory' | 'best-practices';
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
  category: 'on-chain-privacy' | 'off-chain-practices' | 'coin-mixing' | 'wallet-setup' | 'lightning-network' | 'regulatory' | 'best-practices';
  fact: string; // Educational fact about the topic
  impact: 'positive' | 'negative' | 'neutral'; // How this affects privacy
}

export interface Player {
  nickname: string;
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
  unlocked: boolean;
  category: string;
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
  // Enhanced game mechanics
  correctAnswers: number;
  incorrectAnswers: number;
  consecutiveCorrectAnswers: number;
  consecutiveIncorrectAnswers: number;
  towerStability: number;
  isGameComplete: boolean;
  gamePhase: 'rolling' | 'selecting' | 'answering' | 'complete' | 'collapsed';
  availableBlocks: string[]; // Blocks available after dice roll
}

export interface LayerStats {
  layer: number;
  totalBlocks: number;
  removedBlocks: number;
  stability: number;
  points: number;
}

export interface BlockTypeStats {
  safe: { total: number; removed: number; points: number };
  risky: { total: number; removed: number; points: number };
  challenge: { total: number; removed: number; points: number };
}

export interface GameMove {
  blockId: string;
  playerId: string;
  timestamp: Date;
  points: number;
  newTowerStability: number;
  achievementsUnlocked: Achievement[];
  quizResult?: QuizResult;
}

export interface QuizResult {
  blockId: string;
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  stabilityChange: number;
  pointsAwarded: number;
  explanation?: string; // Optional explanation for the answer
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
  availableLayers: number[];
  availableBlocks: string[]; // NEW: Specific blocks available after dice roll
  specialEffect: string | null;
}

// Component Props Types
export interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  selectedBlockId?: string;
  gameState: GameState;
}

export interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => Promise<void>;
  showQuiz?: boolean;
  gameState: GameState;
}

export interface GameStatsProps {
  gameState: GameState;
  onNewGame: () => void;
  onClose: () => void;
}
