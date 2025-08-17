import { 
  Block, 
  BlockContent, 
  GameState, 
  Player, 
  GameMove, 
  QuizResult, 
  PrivacyCategory,
  GameSettings,
  GameStatistics,
  Achievement,
  Difficulty,
  ContentTracker,
  EnhancedQuestion,
  PlayerProgress,
  QuestionAttempt,
  AdaptiveMetrics
} from '../types';
import ENHANCED_PRIVACY_QUESTIONS from '../data/enhancedPrivacyQuestions';

// Enhanced game settings with new stability mechanics
const DEFAULT_SETTINGS: GameSettings = {
  startingStability: 100,
  maxStability: 100,
  
  // Enhanced stability mechanics
  stabilityMechanics: {
    baseStability: 100,
    stabilityRanges: {
      critical: [0, 25],    // Red zone - high risk
      warning: [26, 50],    // Orange zone - medium risk  
      stable: [51, 75],     // Yellow zone - low risk
      optimal: [76, 100],   // Green zone - safe
    },
    impactMultipliers: {
      easy: { correct: 2, incorrect: -5 },
      medium: { correct: 3, incorrect: -8 },
      hard: { correct: 5, incorrect: -12 },
    },
    consecutiveBonuses: {
      correct: [0, 1, 2, 3, 5], // Bonus for streaks
      incorrect: [0, -1, -2, -3, -5], // Penalty for streaks
    },
  },
  
  // Adaptive difficulty settings
  adaptiveDifficulty: {
    playerSkill: {
      overallAccuracy: 0,
      categoryAccuracy: {
        'on-chain': 0,
        'off-chain': 0,
        'coin-mixing': 0,
        'wallet-setup': 0,
        'lightning': 0,
        'regulatory': 0,
        'best-practices': 0,
        'network-privacy': 0,
        'exchange-privacy': 0,
        'api-privacy': 0,
        'social-privacy': 0,
        'transaction-security': 0,
        'kyc-privacy': 0,
        'security': 0,
        'physical-privacy': 0,
      },
      difficultyPerformance: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    },
    dynamicAdjustment: {
      questionSelection: 'adaptive',
      difficultyProgression: 'adaptive',
      stabilityScaling: 'dynamic',
    },
  },
  
  // Achievement settings
  achievementSettings: {
    perfectRoundThreshold: 10,
    survivorThreshold: 15,
    fastThinkerThreshold: 10,
    stabilityMasterThreshold: 80,
    learningMasterThreshold: 90,
  },
  
  // Question settings
  questionSettings: {
    timeLimitEnabled: true,
    defaultTimeLimit: 30,
    hintsEnabled: true,
    maxHintsPerQuestion: 3,
    progressiveDifficulty: true,
  },
};

// Enhanced achievement definitions
const ACHIEVEMENTS: Omit<Achievement, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'perfect-round',
    name: 'Perfect Round',
    description: 'Answered all questions correctly in a tower',
    icon: '🎯',
    category: 'gameplay',
    points: 100,
    condition: {
      type: 'perfect_round',
      value: DEFAULT_SETTINGS.achievementSettings.perfectRoundThreshold,
      description: 'Complete a tower without any wrong answers'
    }
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Lasted many turns before tower collapse',
    icon: '🧱',
    category: 'gameplay',
    points: 75,
    condition: {
      type: 'survivor',
      value: DEFAULT_SETTINGS.achievementSettings.survivorThreshold,
      description: 'Survive many turns before the tower collapses'
    }
  },
  {
    id: 'privacy-pro',
    name: 'Privacy Pro',
    description: 'Completed all 54 privacy questions',
    icon: '🔒',
    category: 'learning',
    points: 500,
    condition: {
      type: 'privacy_pro',
      value: 54,
      description: 'Learn all privacy concepts in the game'
    }
  },
  {
    id: 'fast-thinker',
    name: 'Fast Thinker',
    description: 'Answered questions within time limit',
    icon: '⚡',
    category: 'gameplay',
    points: 50,
    condition: {
      type: 'fast_thinker',
      value: DEFAULT_SETTINGS.achievementSettings.fastThinkerThreshold,
      description: 'Answer questions quickly'
    }
  },
  {
    id: 'consecutive-master',
    name: 'Consecutive Master',
    description: 'Answered many questions correctly in a row',
    icon: '🔥',
    category: 'mastery',
    points: 150,
    condition: {
      type: 'consecutive_correct',
      value: 5,
      description: 'Answer 5 questions correctly in a row'
    }
  },
  {
    id: 'stability-master',
    name: 'Stability Master',
    description: 'Maintained high tower stability throughout',
    icon: '🏗️',
    category: 'mastery',
    points: 200,
    condition: {
      type: 'stability_master',
      value: DEFAULT_SETTINGS.achievementSettings.stabilityMasterThreshold,
      description: 'Keep tower stability above 80%'
    }
  },
  {
    id: 'category-explorer',
    name: 'Category Explorer',
    description: 'Explored all privacy categories',
    icon: '🗺️',
    category: 'learning',
    points: 100,
    condition: {
      type: 'all_categories',
      value: 7,
      description: 'Learn from all 7 privacy categories'
    }
  },
  {
    id: 'learning-master',
    name: 'Learning Master',
    description: 'Achieved high learning effectiveness',
    icon: '🧠',
    category: 'learning',
    points: 300,
    condition: {
      type: 'learning_master',
      value: DEFAULT_SETTINGS.achievementSettings.learningMasterThreshold,
      description: 'Achieve high learning effectiveness score'
    }
  }
];

// Enhanced content tracker implementation
class EnhancedContentTrackerImpl implements ContentTracker {
  public shownContent: Set<string> = new Set();
  public availableContent: BlockContent[] = [];
  public questionBank: EnhancedQuestion[] = [];

  constructor() {
    this.initializeQuestionBank();
  }

  private initializeQuestionBank(): void {
    // Use the enhanced question database
    this.questionBank = ENHANCED_PRIVACY_QUESTIONS;
    this.availableContent = this.questionBank.map(q => this.createBlockContent(q));
  }

  private createBlockContent(question: EnhancedQuestion): BlockContent {
    return {
      id: question.id,
      type: 'QUESTION',
      difficulty: question.difficulty,
      category: question.category,
      title: `Question: ${question.question.substring(0, 50)}...`,
      content: question.explanation,
      question,
    };
  }

  getUnseenContent(difficulty?: Difficulty, category?: PrivacyCategory): BlockContent[] {
    return this.availableContent.filter(content => {
      const notShown = !this.shownContent.has(content.id);
      const matchesDifficulty = !difficulty || content.difficulty === difficulty;
      const matchesCategory = !category || content.category === category;
      return notShown && matchesDifficulty && matchesCategory;
    });
  }

  markAsShown(contentId: string): void {
    this.shownContent.add(contentId);
  }

  isAllContentShown(): boolean {
    return this.shownContent.size >= this.availableContent.length;
  }

  getCompletionPercentage(): number {
    return (this.shownContent.size / this.availableContent.length) * 100;
  }

  selectOptimalQuestion(): BlockContent | null {
    // Implement intelligent question selection based on player context
    const unseenContent = this.getUnseenContent();
    if (unseenContent.length === 0) return null;

    // Simple selection for now - will be enhanced with adaptive logic
    return unseenContent[Math.floor(Math.random() * unseenContent.length)];
  }

  getQuestionByDifficulty(difficulty: Difficulty): BlockContent[] {
    return this.availableContent.filter(content => content.difficulty === difficulty);
  }

  getQuestionByCategory(category: PrivacyCategory): BlockContent[] {
    return this.availableContent.filter(content => content.category === category);
  }
}

class EnhancedGameService {
  private gameState: GameState;
  private settings: GameSettings;
  private blocks: Block[] = [];
  private contentTracker: ContentTracker;
  private sessionStartTime: Date;
  private lastAnswerTime?: Date;

  constructor() {
    this.settings = DEFAULT_SETTINGS;
    this.contentTracker = new EnhancedContentTrackerImpl();
    this.sessionStartTime = new Date();
    this.gameState = this.createInitialGameState();
  }

  // Initialize a new game
  initializeGame(): GameState {
    this.blocks = this.createTower();
    this.gameState = this.createInitialGameState();
    this.gameState.totalBlocks = this.blocks.length;
    this.gameState.totalContentAvailable = this.contentTracker.availableContent.length;
    this.sessionStartTime = new Date();
    return this.gameState;
  }

  // Get current game state
  getGameState(): GameState {
    return this.gameState;
  }

  // Get all blocks
  getBlocks(): Block[] {
    return this.blocks;
  }

  // Handle block click (now always shows a question)
  handleBlockClick(blockId: string): BlockContent | null {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block || block.isRemoved) {
      return null;
    }

    // Mark content as shown
    this.contentTracker.markAsShown(block.content.id);
    this.gameState.contentShown.add(block.content.id);
    this.gameState.totalContentShown = this.gameState.contentShown.size;

    // Update game state
    this.gameState.selectedBlockId = blockId;
    block.hasBeenShown = true;
    
    // Record the move
    this.recordGameMove('block_clicked', 'success', 0, 0, block.content);
    
    console.log(`📚 Content shown: ${block.content.title} (${block.content.category})`);
    console.log(`📊 Total content shown: ${this.gameState.totalContentShown}/${this.gameState.totalContentAvailable}`);
    
    return block.content;
  }

  // Enhanced quiz answer handling
  handleQuizAnswer(blockId: string, selectedAnswer: number): QuizResult {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block || !block.content.question) {
      throw new Error('Invalid block or no question found');
    }

    const question = block.content.question;
    const isCorrect = selectedAnswer === question.correctIndex;
    
    console.log(`🧠 Quiz answer: ${selectedAnswer}, Correct: ${question.correctIndex}, IsCorrect: ${isCorrect}`);
    
    // Calculate enhanced stability impact
    const stabilityChange = this.calculateStabilityImpact(question, isCorrect);
    const pointsEarned = isCorrect ? question.points.correct : question.points.incorrect;

    // Calculate time to answer
    const timeToAnswer = this.lastAnswerTime ? 
      (Date.now() - this.lastAnswerTime.getTime()) / 1000 : undefined;

    // Update adaptive difficulty
    this.updateAdaptiveDifficulty(isCorrect, question);

    // Update game state
    if (isCorrect) {
      this.gameState.correctAnswers++;
      this.gameState.currentScore += pointsEarned;
      this.gameState.consecutiveCorrect++;
      this.gameState.consecutiveIncorrect = 0;
    } else {
      this.gameState.incorrectAnswers++;
      this.gameState.consecutiveIncorrect++;
      this.gameState.consecutiveCorrect = 0;
    }

    // REMOVE THE BLOCK - This was the missing piece!
    block.isRemoved = true;
    this.gameState.blocksRemoved++;
    
    // Update player statistics
    this.gameState.currentPlayer.totalBlocksRemoved++;
    if (isCorrect) {
      this.gameState.currentPlayer.totalCorrectAnswers++;
    } else {
      this.gameState.currentPlayer.totalIncorrectAnswers++;
    }

    // Update tower stability
    const oldStability = this.gameState.towerStability;
    this.gameState.towerStability = Math.max(0, 
      Math.min(100, this.gameState.towerStability + stabilityChange)
    );
    
    console.log(`🏗️ Tower stability: ${oldStability}% → ${this.gameState.towerStability}% (change: ${stabilityChange})`);

    // Check if tower collapsed
    if (this.gameState.towerStability <= 0) {
      this.gameState.gamePhase = 'collapsed';
      this.gameState.towerCollapsed = true;
      console.log('💥 Tower collapsed!');
    }

    // Create enhanced quiz result
    const quizResult: QuizResult = {
      blockId,
      question: question.question,
      selectedAnswer,
      correctAnswer: question.correctIndex,
      isCorrect,
      explanation: question.explanation,
      pointsEarned,
      stabilityChange,
      timeToAnswer,
      difficulty: question.difficulty,
      category: question.category,
      learningTags: question.learningTags,
      adaptiveImpact: {
        skillAdjustment: isCorrect ? 1 : -1,
        categoryAdjustment: isCorrect ? 0.5 : -0.5,
        difficultyAdjustment: isCorrect ? 0.2 : -0.2,
      },
    };

    this.gameState.lastQuizResult = quizResult;
    
    // Record the move
    this.recordGameMove('question_answered', isCorrect ? 'success' : 'failure', pointsEarned, stabilityChange, block.content);

    // Update player progress
    this.updatePlayerProgress(quizResult);

    // Check achievements
    this.checkAchievements();

    console.log(`📊 Quiz result: ${isCorrect ? '✅ Correct' : '❌ Incorrect'}, Stability: ${stabilityChange}, Score: +${pointsEarned}`);

    return quizResult;
  }

  // Enhanced stability calculation
  private calculateStabilityImpact(question: EnhancedQuestion, isCorrect: boolean): number {
    // Use the question's stability impact directly
    const baseImpact = isCorrect ? 
      question.stabilityImpact.correct : 
      question.stabilityImpact.incorrect;

    // Apply consecutive bonus/penalty
    const consecutiveArray = isCorrect ? 
      this.settings.stabilityMechanics.consecutiveBonuses.correct :
      this.settings.stabilityMechanics.consecutiveBonuses.incorrect;
    
    const consecutiveIndex = Math.min(
      isCorrect ? this.gameState.consecutiveCorrect : this.gameState.consecutiveIncorrect,
      consecutiveArray.length - 1
    );
    const consecutiveBonus = consecutiveArray[consecutiveIndex];

    // Apply stability-based scaling
    const currentStability = this.gameState.towerStability;
    let stabilityMultiplier = 1;
    
    if (currentStability <= 25) {
      // Critical zone - reduce penalties, increase rewards
      stabilityMultiplier = isCorrect ? 1.5 : 0.5;
    } else if (currentStability <= 50) {
      // Warning zone - moderate scaling
      stabilityMultiplier = isCorrect ? 1.2 : 0.8;
    } else if (currentStability >= 80) {
      // Optimal zone - reduce rewards, increase penalties
      stabilityMultiplier = isCorrect ? 0.8 : 1.2;
    }

    const finalImpact = Math.round(baseImpact * (1 + consecutiveBonus * 0.1) * stabilityMultiplier);
    
    console.log(`🔧 Stability calculation: base=${baseImpact}, consecutive=${consecutiveBonus}, multiplier=${stabilityMultiplier}, final=${finalImpact}`);
    
    return finalImpact;
  }

  // Enhanced adaptive difficulty update
  private updateAdaptiveDifficulty(_isCorrect: boolean, question: EnhancedQuestion): void {
    // Update overall accuracy
    const totalAnswers = this.gameState.correctAnswers + this.gameState.incorrectAnswers;
    if (totalAnswers > 0) {
      this.settings.adaptiveDifficulty.playerSkill.overallAccuracy = 
        (this.gameState.correctAnswers / totalAnswers) * 100;
    }

    // Update category accuracy
    const categoryAttempts = this.gameState.playerProgress.questionHistory
      .filter(q => q.category === question.category);
    const categoryCorrect = categoryAttempts.filter(q => q.isCorrect).length;
    if (categoryAttempts.length > 0) {
      this.settings.adaptiveDifficulty.playerSkill.categoryAccuracy[question.category] = 
        (categoryCorrect / categoryAttempts.length) * 100;
    }

    // Update difficulty performance
    const difficultyAttempts = this.gameState.playerProgress.questionHistory
      .filter(q => q.difficulty === question.difficulty);
    const difficultyCorrect = difficultyAttempts.filter(q => q.isCorrect).length;
    if (difficultyAttempts.length > 0) {
      this.settings.adaptiveDifficulty.playerSkill.difficultyPerformance[question.difficulty] = 
        (difficultyCorrect / difficultyAttempts.length) * 100;
    }

    // Adjust current difficulty based on performance
    this.adjustDifficulty();
  }

  private adjustDifficulty(): void {
    const overallAccuracy = this.settings.adaptiveDifficulty.playerSkill.overallAccuracy;
    const currentDifficulty = this.gameState.currentDifficulty;

    if (overallAccuracy >= 80 && currentDifficulty !== 'hard') {
      // High accuracy - increase difficulty
      if (currentDifficulty === 'easy') {
        this.gameState.currentDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        this.gameState.currentDifficulty = 'hard';
      }
    } else if (overallAccuracy <= 40 && currentDifficulty !== 'easy') {
      // Low accuracy - decrease difficulty
      if (currentDifficulty === 'hard') {
        this.gameState.currentDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        this.gameState.currentDifficulty = 'easy';
      }
    }
  }

  // Enhanced player progress update
  private updatePlayerProgress(quizResult: QuizResult): void {
    const questionAttempt: QuestionAttempt = {
      questionId: quizResult.blockId,
      isCorrect: quizResult.isCorrect,
      timeToAnswer: quizResult.timeToAnswer || 0,
      stabilityImpact: quizResult.stabilityChange,
      pointsEarned: quizResult.pointsEarned,
      timestamp: new Date(),
      difficulty: quizResult.difficulty,
      category: quizResult.category,
    };

    this.gameState.playerProgress.questionHistory.push(questionAttempt);

    // Update category mastery
    const categoryAttempts = this.gameState.playerProgress.questionHistory
      .filter(q => q.category === quizResult.category);
    const categoryCorrect = categoryAttempts.filter(q => q.isCorrect).length;
    this.gameState.playerProgress.categoryMastery[quizResult.category] = 
      categoryAttempts.length > 0 ? (categoryCorrect / categoryAttempts.length) * 100 : 0;

    // Update difficulty progression
    const difficultyAttempts = this.gameState.playerProgress.questionHistory
      .filter(q => q.difficulty === quizResult.difficulty);
    const difficultyCorrect = difficultyAttempts.filter(q => q.isCorrect).length;
    this.gameState.playerProgress.difficultyProgression[quizResult.difficulty] = 
      difficultyAttempts.length > 0 ? (difficultyCorrect / difficultyAttempts.length) * 100 : 0;

    // Update adaptive metrics
    this.updateAdaptiveMetrics();
  }

  private updateAdaptiveMetrics(): void {
    const totalAttempts = this.gameState.playerProgress.questionHistory.length;
    if (totalAttempts === 0) return;

    const correctAttempts = this.gameState.playerProgress.questionHistory
      .filter(q => q.isCorrect).length;
    
    // Calculate skill level (0-100)
    this.gameState.adaptiveMetrics.skillLevel = (correctAttempts / totalAttempts) * 100;

    // Calculate learning rate (recent performance vs overall)
    const recentAttempts = this.gameState.playerProgress.questionHistory
      .slice(-10); // Last 10 attempts
    const recentCorrect = recentAttempts.filter(q => q.isCorrect).length;
    const recentAccuracy = recentAttempts.length > 0 ? (recentCorrect / recentAttempts.length) * 100 : 0;
    
    this.gameState.adaptiveMetrics.learningRate = recentAccuracy - this.gameState.adaptiveMetrics.skillLevel;

    // Determine difficulty preference
    const difficultyPerformance = this.gameState.playerProgress.difficultyProgression;
    const bestDifficulty = Object.entries(difficultyPerformance)
      .reduce((a, b) => difficultyPerformance[a[0] as Difficulty] > difficultyPerformance[b[0] as Difficulty] ? a : b)[0] as Difficulty;
    this.gameState.adaptiveMetrics.difficultyPreference = bestDifficulty;

    // Determine category strengths and weaknesses
    const categoryMastery = this.gameState.playerProgress.categoryMastery;
    const strengths = Object.entries(categoryMastery)
      .filter(([_, mastery]) => mastery >= 70)
      .map(([category, _]) => category as PrivacyCategory);
    const weaknesses = Object.entries(categoryMastery)
      .filter(([_, mastery]) => mastery <= 30)
      .map(([category, _]) => category as PrivacyCategory);

    this.gameState.adaptiveMetrics.categoryStrengths = strengths;
    this.gameState.adaptiveMetrics.categoryWeaknesses = weaknesses;
  }

  // Rebuild tower after collapse
  rebuildTower(): GameState {
    if (this.gameState.gamePhase !== 'collapsed') {
      return this.gameState;
    }

    // Check if there's unseen content to continue
    const unseenContent = this.contentTracker.getUnseenContent();
    if (unseenContent.length === 0) {
      this.gameState.gamePhase = 'completed';
      return this.gameState;
    }

    // Rebuild tower with unseen content
    this.blocks = this.createTower();
    this.gameState.gamePhase = 'playing';
    this.gameState.towerStability = this.settings.startingStability;
    this.gameState.blocksRemoved = 0;
    this.gameState.totalBlocks = this.blocks.length;
    this.gameState.towerCollapsed = false;
    this.gameState.rebuildCount++;

    // Reset consecutive counters for new tower
    this.gameState.consecutiveCorrect = 0;
    this.gameState.consecutiveIncorrect = 0;

    // Record the rebuild
    this.recordGameMove('tower_rebuilt', 'success', 0, 0, unseenContent[0]);

    return this.gameState;
  }

  // Reset game
  resetGame(): GameState {
    this.blocks = this.createTower();
    this.gameState = this.createInitialGameState();
    this.gameState.totalBlocks = this.blocks.length;
    this.gameState.totalContentAvailable = this.contentTracker.availableContent.length;
    this.sessionStartTime = new Date();
    return this.gameState;
  }

  // Get enhanced game statistics
  getGameStatistics(): GameStatistics {
    const totalGames = this.gameState.currentPlayer.gamesPlayed;
    const averageScore = totalGames > 0 ? this.gameState.currentPlayer.totalScore / totalGames : 0;
    const sessionDuration = (Date.now() - this.sessionStartTime.getTime()) / (1000 * 60); // minutes

    return {
      totalGamesPlayed: totalGames,
      totalScore: this.gameState.currentPlayer.totalScore,
      averageScore: Math.round(averageScore),
      bestScore: this.gameState.currentPlayer.highScore,
      totalBlocksRemoved: this.gameState.currentPlayer.totalBlocksRemoved,
      totalCorrectAnswers: this.gameState.currentPlayer.totalCorrectAnswers,
      totalIncorrectAnswers: this.gameState.currentPlayer.totalIncorrectAnswers,
      averageStability: this.gameState.towerStability,
      categoriesMastered: this.getMasteredCategories(),
      learningProgress: this.gameState.learningProgress,
      
      // Achievement statistics
      totalAchievements: this.gameState.currentPlayer.totalAchievements,
      achievementsUnlocked: this.gameState.currentPlayer.achievements.filter(a => a.isUnlocked),
      
      // Session statistics
      totalPlayTime: this.gameState.currentPlayer.totalPlayTime + sessionDuration,
      longestSession: Math.max(this.gameState.currentPlayer.longestSession, sessionDuration),
      averageSessionLength: totalGames > 0 ? (this.gameState.currentPlayer.totalPlayTime + sessionDuration) / totalGames : 0,
      
      // Learning statistics
      totalContentLearned: this.gameState.totalContentShown,
      completionRate: this.contentTracker.getCompletionPercentage(),
      
      // Enhanced learning metrics
      adaptiveMetrics: this.gameState.adaptiveMetrics,
      learningEffectiveness: {
        knowledgeRetention: this.calculateKnowledgeRetention(),
        skillProgression: this.gameState.adaptiveMetrics.learningRate,
        categoryMastery: this.calculateAverageCategoryMastery(),
        difficultyAdaptation: this.calculateDifficultyAdaptation(),
      },
    };
  }

  // Private helper methods
  private createInitialGameState(): GameState {
    return {
      gamePhase: 'playing',
      currentScore: 0,
      towerStability: this.settings.startingStability,
      blocksRemoved: 0,
      totalBlocks: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      
      // Enhanced learning progress
      totalContentShown: 0,
      totalContentAvailable: this.contentTracker.availableContent.length,
      contentShown: new Set(),
      
      // Adaptive difficulty
      currentDifficulty: 'easy',
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      
      // Enhanced player state
      currentPlayer: this.createDefaultPlayer(),
      
      // Game history
      gameHistory: [],
      learningProgress: this.createInitialLearningProgress(),
      
      // Tower state
      towerCollapsed: false,
      rebuildCount: 0,
      
      // Enhanced features
      playerProgress: this.createInitialPlayerProgress(),
      adaptiveMetrics: this.createInitialAdaptiveMetrics(),
    };
  }

  private createDefaultPlayer(): Player {
    return {
      id: 'default-player',
      nickname: 'Privacy Explorer',
      score: 0,
      totalScore: 0,
      highScore: 0,
      gamesPlayed: 0,
      totalBlocksRemoved: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      learningProgress: this.createInitialLearningProgress(),
      
      // Enhanced achievement tracking
      achievements: ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        isUnlocked: false,
        unlockedAt: undefined
      })),
      totalAchievements: 0,
      
      // Session tracking
      currentSessionStart: new Date(),
      longestSession: 0,
      totalPlayTime: 0,
      
      // Enhanced learning metrics
      playerProgress: this.createInitialPlayerProgress(),
      adaptiveMetrics: this.createInitialAdaptiveMetrics(),
    };
  }

  private createInitialLearningProgress(): Record<PrivacyCategory, number> {
    return {
      'on-chain': 0,
      'off-chain': 0,
      'coin-mixing': 0,
      'wallet-setup': 0,
      'lightning': 0,
      'regulatory': 0,
      'best-practices': 0,
      'network-privacy': 0,
      'exchange-privacy': 0,
      'api-privacy': 0,
      'social-privacy': 0,
      'transaction-security': 0,
      'kyc-privacy': 0,
      'security': 0,
      'physical-privacy': 0
    };
  }

  private createInitialPlayerProgress(): PlayerProgress {
    return {
      questionHistory: [],
      categoryMastery: this.createInitialLearningProgress(),
      difficultyProgression: { easy: 0, medium: 0, hard: 0 },
      learningPath: {
        currentPhase: 'foundation',
        phaseProgress: 0,
        requiredAccuracy: 70,
        unlockedQuestions: [],
        completedQuestions: [],
      },
      adaptiveMetrics: this.createInitialAdaptiveMetrics(),
    };
  }

  private createInitialAdaptiveMetrics(): AdaptiveMetrics {
    return {
      skillLevel: 0,
      learningRate: 0,
      retentionRate: 0,
      difficultyPreference: 'easy',
      categoryStrengths: [],
      categoryWeaknesses: [],
    };
  }

  private createTower(): Block[] {
    const blocks: Block[] = [];
    let blockId = 1;

    // Get unseen content for this tower
    const unseenContent = this.contentTracker.getUnseenContent();
    if (unseenContent.length === 0) {
      // If no unseen content, reset the tracker and use all content
      this.contentTracker.shownContent.clear();
      unseenContent.push(...this.contentTracker.availableContent);
    }

    // Create 18 layers with 3 blocks per layer (except top layer)
    for (let layer = 1; layer <= 18; layer++) {
      const blocksInLayer = layer === 18 ? 1 : 3; // Top layer has 1 block
      
      for (let position = 1; position <= blocksInLayer; position++) {
        // Get content for this specific block, ensuring variety
        const content = this.getContentForBlock(unseenContent, layer, position);
        
        // Calculate centered positions for each layer
        let xOffset = 0;
        if (blocksInLayer === 3) {
          // For 3-block layers, center them around 0
          xOffset = (position - 2) * 1.2; // -1.2, 0, 1.2
        }
        // For 1-block top layer, xOffset remains 0 (centered)
        
        const worldPosition: [number, number, number] = [
          xOffset,                                    // X position (centered)
          (18 - layer) * 0.4,                        // Y position (height from bottom)
          layer % 2 === 0 ? 0 : 0.75                 // Z position (alternating, reduced spacing)
        ];

        blocks.push({
          id: `block-${blockId++}`,
          type: 'QUESTION',
          content,
          isRemoved: false,
          layer,
          position,
          worldPosition,
          category: content.category,
          difficulty: content.difficulty,
          hasBeenShown: false
        });
      }
    }

    return blocks;
  }



  private getContentForBlock(availableContent: BlockContent[], layer: number, position: number): BlockContent {
    // Determine difficulty based on layer (matching visual design)
    let targetDifficulty: Difficulty;
    if (layer <= 6) {
      targetDifficulty = 'hard'; // Bottom layers = Red = Hard
    } else if (layer <= 12) {
      targetDifficulty = 'medium'; // Middle layers = Orange = Medium
    } else {
      targetDifficulty = 'easy'; // Top layers = Green = Easy
    }

    // Filter content by target difficulty
    const difficultyContent = availableContent.filter(content => 
      content.difficulty === targetDifficulty
    );

    // If no content for target difficulty, use any available content
    const contentPool = difficultyContent.length > 0 ? difficultyContent : availableContent;
    
    // Use deterministic selection based on layer and position to ensure variety
    const seed = layer * 100 + position;
    const index = seed % contentPool.length;
    return contentPool[index];
  }

  private checkAchievements(): void {
    // Perfect Round - no mistakes in current tower
    if (this.gameState.incorrectAnswers === 0 && this.gameState.blocksRemoved >= this.settings.achievementSettings.perfectRoundThreshold) {
      this.unlockAchievement('perfect-round');
    }

    // Survivor - lasted many turns (only for correct answers)
    if (this.gameState.correctAnswers >= this.settings.achievementSettings.survivorThreshold) {
      this.unlockAchievement('survivor');
    }

    // Fast Thinker - answered quickly (only for correct answers)
    if (this.gameState.lastQuizResult?.isCorrect && 
        this.gameState.lastQuizResult?.timeToAnswer && 
        this.gameState.lastQuizResult.timeToAnswer <= this.settings.achievementSettings.fastThinkerThreshold) {
      this.unlockAchievement('fast-thinker');
    }

    // Consecutive Master
    if (this.gameState.consecutiveCorrect >= 5) {
      this.unlockAchievement('consecutive-master');
    }

    // Stability Master - only if maintaining high stability
    if (this.gameState.towerStability >= this.settings.achievementSettings.stabilityMasterThreshold && 
        this.gameState.blocksRemoved >= 5) {
      this.unlockAchievement('stability-master');
    }

    // Category Explorer - only for correct answers
    const exploredCategories = Object.values(this.gameState.learningProgress).filter(progress => progress > 0).length;
    if (exploredCategories >= 7 && this.gameState.correctAnswers >= 10) {
      this.unlockAchievement('category-explorer');
    }

    // Learning Master - only for high accuracy
    if (this.gameState.adaptiveMetrics.skillLevel >= this.settings.achievementSettings.learningMasterThreshold && 
        this.gameState.correctAnswers >= 20) {
      this.unlockAchievement('learning-master');
    }
  }

  private unlockAchievement(achievementId: string): void {
    const achievement = this.gameState.currentPlayer.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date();
      this.gameState.currentPlayer.totalAchievements++;
      this.gameState.currentPlayer.score += achievement.points;
      this.gameState.currentScore += achievement.points;
      
      console.log(`🏆 Achievement unlocked: ${achievement.name} - ${achievement.description}`);
    }
  }

  private recordGameMove(
    action: GameMove['action'],
    result: GameMove['result'],
    points: number,
    stabilityChange: number,
    content: BlockContent
  ): void {
    const move: GameMove = {
      id: `move-${Date.now()}`,
      blockId: this.gameState.selectedBlockId || '',
      action,
      result,
      points,
      stabilityChange,
      timestamp: new Date(),
      content,
      difficulty: this.gameState.currentDifficulty,
    };

    this.gameState.gameHistory.push(move);
  }

  private getMasteredCategories(): PrivacyCategory[] {
    return Object.entries(this.gameState.learningProgress)
      .filter(([_, progress]) => progress >= 3) // Consider mastered after 3 interactions
      .map(([category, _]) => category as PrivacyCategory);
  }

  private calculateKnowledgeRetention(): number {
    // Calculate based on recent vs older performance
    const history = this.gameState.playerProgress.questionHistory;
    if (history.length < 10) return 0;

    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAccuracy = recent.filter(q => q.isCorrect).length / recent.length;
    const olderAccuracy = older.filter(q => q.isCorrect).length / older.length;
    
    return Math.max(0, (recentAccuracy - olderAccuracy) * 100);
  }

  private calculateAverageCategoryMastery(): number {
    const masteries = Object.values(this.gameState.playerProgress.categoryMastery);
    return masteries.reduce((sum, mastery) => sum + mastery, 0) / masteries.length;
  }

  private calculateDifficultyAdaptation(): number {
    const difficulties = Object.values(this.gameState.playerProgress.difficultyProgression);
    return difficulties.reduce((sum, perf) => sum + perf, 0) / difficulties.length;
  }

  // Public method to set answer time for Fast Thinker achievement
  setAnswerStartTime(): void {
    this.lastAnswerTime = new Date();
  }
}

export const enhancedGameService = new EnhancedGameService();
export default enhancedGameService;
