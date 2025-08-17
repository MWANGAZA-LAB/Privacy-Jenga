// Core Types
export type PrivacyCategory = 
  | 'on-chain' 
  | 'off-chain' 
  | 'coin-mixing' 
  | 'wallet-setup' 
  | 'lightning' 
  | 'regulatory' 
  | 'best-practices'
  | 'network-privacy'
  | 'exchange-privacy'
  | 'api-privacy'
  | 'social-privacy'
  | 'transaction-security'
  | 'kyc-privacy'
  | 'security'
  | 'physical-privacy';

// Enhanced Question Types
export type QuestionType = 'multiple_choice' | 'true_false' | 'scenario' | 'fill_blank';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type BlockType = 'QUESTION'; // All blocks are now questions

// Enhanced Question Interface
export interface EnhancedQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  category: PrivacyCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  stabilityImpact: {
    correct: number;
    incorrect: number;
  };
  points: {
    correct: number;
    incorrect: number;
  };
  learningTags: string[];
  timeLimit?: number; // Optional time limit in seconds
  hints?: string[]; // Progressive hints
}

// Enhanced Block Content (replaces old BlockContent)
export interface BlockContent {
  id: string;
  type: BlockType;
  difficulty: Difficulty;
  category: PrivacyCategory;
  title: string;
  content: string;
  question: EnhancedQuestion; // All blocks now have questions
}

// Enhanced Stability Mechanics
export interface StabilityMechanics {
  baseStability: number;
  stabilityRanges: {
    critical: [number, number];
    warning: [number, number];
    stable: [number, number];
    optimal: [number, number];
  };
  impactMultipliers: {
    easy: { correct: number; incorrect: number };
    medium: { correct: number; incorrect: number };
    hard: { correct: number; incorrect: number };
  };
  consecutiveBonuses: {
    correct: number[];
    incorrect: number[];
  };
}

// Adaptive Difficulty System
export interface AdaptiveDifficulty {
  playerSkill: {
    overallAccuracy: number;
    categoryAccuracy: Record<PrivacyCategory, number>;
    difficultyPerformance: Record<Difficulty, number>;
  };
  dynamicAdjustment: {
    questionSelection: 'weighted_random' | 'progressive' | 'remedial' | 'adaptive';
    difficultyProgression: 'linear' | 'exponential' | 'adaptive';
    stabilityScaling: 'fixed' | 'dynamic' | 'contextual';
  };
}

// Enhanced Player Progress
export interface PlayerProgress {
  questionHistory: QuestionAttempt[];
  categoryMastery: Record<PrivacyCategory, number>;
  difficultyProgression: Record<Difficulty, number>;
  learningPath: LearningPhase;
  adaptiveMetrics: AdaptiveMetrics;
}

export interface QuestionAttempt {
  questionId: string;
  isCorrect: boolean;
  timeToAnswer: number;
  stabilityImpact: number;
  pointsEarned: number;
  timestamp: Date;
  difficulty: Difficulty;
  category: PrivacyCategory;
}

export interface LearningPhase {
  currentPhase: 'foundation' | 'application' | 'mastery';
  phaseProgress: number;
  requiredAccuracy: number;
  unlockedQuestions: string[];
  completedQuestions: string[];
}

export interface AdaptiveMetrics {
  skillLevel: number; // 0-100
  learningRate: number;
  retentionRate: number;
  difficultyPreference: Difficulty;
  categoryStrengths: PrivacyCategory[];
  categoryWeaknesses: PrivacyCategory[];
}

// Enhanced Block interface
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  isRemoved: boolean;
  layer: number;
  position: number;
  worldPosition: [number, number, number];
  category: PrivacyCategory;
  difficulty: Difficulty;
  hasBeenShown: boolean; // Track if this content has been shown
}

// Enhanced Game State
export interface GameState {
  gamePhase: 'playing' | 'gameOver' | 'collapsed' | 'completed' | 'rebuilding';
  currentScore: number;
  towerStability: number;
  blocksRemoved: number;
  totalBlocks: number;
  correctAnswers: number;
  incorrectAnswers: number;
  
  // Enhanced learning progress
  totalContentShown: number;
  totalContentAvailable: number;
  contentShown: Set<string>;
  
  // Adaptive difficulty
  currentDifficulty: Difficulty;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  
  // Enhanced player state
  currentPlayer: Player;
  
  // Game history
  gameHistory: GameMove[];
  learningProgress: Record<PrivacyCategory, number>;
  
  // Tower state
  towerCollapsed: boolean;
  rebuildCount: number;
  
  // Enhanced features
  selectedBlockId?: string;
  lastQuizResult?: QuizResult;
  playerProgress: PlayerProgress;
  adaptiveMetrics: AdaptiveMetrics;
}

// Enhanced Quiz Result
export interface QuizResult {
  blockId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  pointsEarned: number;
  stabilityChange: number;
  timeToAnswer?: number;
  
  // Enhanced feedback
  difficulty: Difficulty;
  category: PrivacyCategory;
  learningTags: string[];
  adaptiveImpact: {
    skillAdjustment: number;
    categoryAdjustment: number;
    difficultyAdjustment: number;
  };
}

// Enhanced Game move interface
export interface GameMove {
  id: string;
  blockId: string;
  action: 'question_answered' | 'block_clicked' | 'tower_collapsed' | 'tower_rebuilt';
  result: 'success' | 'failure' | 'partial';
  points: number;
  stabilityChange: number;
  timestamp: Date;
  content: BlockContent;
  difficulty: Difficulty;
  
  // Enhanced move data
  questionAttempt?: QuestionAttempt;
  adaptiveMetrics?: AdaptiveMetrics;
}

// Enhanced Player interface
export interface Player {
  id: string;
  nickname: string;
  score: number;
  totalScore: number;
  highScore: number;
  gamesPlayed: number;
  totalBlocksRemoved: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  learningProgress: Record<PrivacyCategory, number>;
  
  // Enhanced achievement tracking
  achievements: Achievement[];
  totalAchievements: number;
  
  // Session tracking
  currentSessionStart: Date;
  longestSession: number;
  totalPlayTime: number;
  
  // Enhanced learning metrics
  playerProgress: PlayerProgress;
  adaptiveMetrics: AdaptiveMetrics;
}

// Enhanced Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon
  category: 'gameplay' | 'learning' | 'mastery' | 'special';
  unlockedAt?: Date;
  points: number;
  condition: AchievementCondition;
  isUnlocked: boolean;
}

// Achievement conditions
export interface AchievementCondition {
  type: 'perfect_round' | 'survivor' | 'privacy_pro' | 'fast_thinker' | 'consecutive_correct' | 'all_categories' | 'stability_master' | 'learning_master';
  value: number; // Threshold value
  description: string;
}

// Component Props Types
export interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  gameState: GameState;
  selectedBlockId?: string;
}

export interface ContentModalProps {
  content: BlockContent | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (blockId: string, selectedAnswer: number) => Promise<void>;
  showQuiz?: boolean;
  gameState: GameState;
  blockId?: string;
}

export interface SimplifiedJengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  gameState: GameState;
  selectedBlockId?: string;
  onGameRestart?: () => void;
}

export interface GameHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial?: () => void;
  onStartGame?: () => void;
}

export interface GameStatsProps {
  player: Player;
  statistics: GameStatistics;
  onClose: () => void;
}

export interface MobileControlsProps {
  onReset: () => void;
  onHelp: () => void;
  onTutorial: () => void;
}

export interface EndgameSummaryProps {
  gameState: GameState;
  gameHistory: GameMove[];
  onPlayAgain: () => void;
  onClose: () => void;
  achievements: Achievement[];
}

export interface BitsaccoLogoProps {
  size?: number;
  className?: string;
}

export interface GameErrorBoundaryProps {
  children: any;
}

export interface GameErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Enhanced Game Settings
export interface GameSettings {
  startingStability: number;
  maxStability: number;
  
  // Enhanced stability mechanics
  stabilityMechanics: StabilityMechanics;
  
  // Adaptive difficulty settings
  adaptiveDifficulty: AdaptiveDifficulty;
  
  // Achievement settings
  achievementSettings: {
    perfectRoundThreshold: number;
    survivorThreshold: number;
    fastThinkerThreshold: number;
    stabilityMasterThreshold: number;
    learningMasterThreshold: number;
  };
  
  // Question settings
  questionSettings: {
    timeLimitEnabled: boolean;
    defaultTimeLimit: number;
    hintsEnabled: boolean;
    maxHintsPerQuestion: number;
    progressiveDifficulty: boolean;
  };
}

// Enhanced Game Statistics
export interface GameStatistics {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalBlocksRemoved: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  averageStability: number;
  categoriesMastered: PrivacyCategory[];
  learningProgress: Record<PrivacyCategory, number>;
  
  // Achievement statistics
  totalAchievements: number;
  achievementsUnlocked: Achievement[];
  
  // Session statistics
  totalPlayTime: number;
  longestSession: number;
  averageSessionLength: number;
  
  // Learning statistics
  totalContentLearned: number;
  completionRate: number;
  
  // Enhanced learning metrics
  adaptiveMetrics: AdaptiveMetrics;
  learningEffectiveness: {
    knowledgeRetention: number;
    skillProgression: number;
    categoryMastery: number;
    difficultyAdaptation: number;
  };
}

// Enhanced Content Tracker
export interface ContentTracker {
  shownContent: Set<string>;
  availableContent: BlockContent[];
  questionBank: EnhancedQuestion[];
  
  getUnseenContent(difficulty?: Difficulty, category?: PrivacyCategory): BlockContent[];
  markAsShown(contentId: string): void;
  isAllContentShown(): boolean;
  getCompletionPercentage(): number;
  
  // Enhanced question selection
  selectOptimalQuestion(playerContext: PlayerProgress): BlockContent | null;
  getQuestionByDifficulty(difficulty: Difficulty): BlockContent[];
  getQuestionByCategory(category: PrivacyCategory): BlockContent[];
}
