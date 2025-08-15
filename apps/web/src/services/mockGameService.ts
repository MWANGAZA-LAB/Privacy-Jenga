// Enhanced Mock Game Service - Single Player Privacy Jenga Implementation
/* cSpell:disable-next-line */
// Technical Bitcoin/crypto terms: unlinkability, multisig, clearnet, blockchain, gameplay
import { 
  Block, 
  Content, 
  GameState, 
  GameMove, 
  Achievement, 
  DiceResult,
  LayerStats,
  BlockTypeStats,
  Player,
  QuizResult
} from '../types';

class MockGameService {
  private blocks: Block[] = [];
  private gameState: GameState | null = null;
  private achievements: Achievement[] = [];

  constructor() {
    console.log('MockGameService constructor called');
    this.initializeMockData();
    this.initializeAchievements();
    console.log('MockGameService initialization complete');
  }

  private initializeMockData() {
    // Create single player
    const currentPlayer: Player = {
      nickname: 'Player',
      score: 0,
      achievements: [],
      highScore: 0,
      gamesPlayed: 0,
      totalPoints: 0,
      totalBlocksRemoved: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    };

    // Create enhanced blocks with complete 54-block system
    this.blocks = this.createComplete54BlockSystem();

    // Initialize game state with FRESH START (no progress)
    this.gameState = {
      currentPlayer,
      towerHeight: 18,
      blocksRemoved: 0,
      totalBlocks: 54,
      currentScore: 0,
      gameMode: 'learning',
      difficulty: 1,
      diceResult: 0,
      canPullFromLayers: [], // Start with NO available layers until dice is rolled
      specialActions: [],
      gameHistory: [],
      layerStats: this.initializeLayerStats(),
      blockTypeStats: this.initializeBlockTypeStats(),
      // Enhanced game mechanics
      correctAnswers: 0,
      incorrectAnswers: 0,
      consecutiveCorrectAnswers: 0,
      consecutiveIncorrectAnswers: 0,
      towerStability: 100,
      isGameComplete: false,
      gamePhase: 'selecting',
      availableBlocks: []
    };
  }

  private createComplete54BlockSystem(): Block[] {
    const blocks: Block[] = [];
    let blockId = 1;

    // Create exactly 54 blocks (18 layers × 3 blocks per layer)
    for (let layer = 1; layer <= 18; layer++) {
      for (let position = 1; position <= 3; position++) {
        // Determine block type based on blockId to match privacy practice risk levels
        const blockType = this.getBlockTypeForBlockId(blockId);
        const content = this.getContentForBlock(blockId, blockType, layer);
        
        blocks.push({
          id: blockId.toString(),
          content,
          removed: false,
          type: blockType,
          difficulty: layer,
          layer,
          position,
          stability: this.calculateStability(layer, blockType),
          category: content.category
        });
        
        blockId++;
      }
    }

    return blocks;
  }

  private getBlockTypeForBlockId(blockId: number): 'safe' | 'risky' | 'challenge' {
    // Map blockId to risk level to match privacy practice content:
    // Blocks 1-18: Red blocks (risky) = Severe risks (Never do these)
    // Blocks 19-36: Orange blocks (challenge) = Moderate risks (Avoid these)  
    // Blocks 37-54: Green blocks (safe) = Mild risks (Consider these)
    
    if (blockId <= 18) {
      return 'risky';    // Red blocks for severe "Never" practices
    } else if (blockId <= 36) {
      return 'challenge'; // Orange blocks for moderate "Avoid" practices
    } else {
      return 'safe';     // Green blocks for mild "Consider" practices
    }
  }

  private calculateStability(layer: number, blockType: string): number {
    // Base stability decreases with height
    const baseStability = 1.0 - (layer - 1) * 0.05;
    
    // Block type affects stability
    let typeMultiplier = 1.0;
    switch (blockType) {
      case 'safe': typeMultiplier = 1.0; break;
      case 'risky': typeMultiplier = 0.8; break;
      case 'challenge': typeMultiplier = 0.6; break;
    }
    
    const stability = baseStability * typeMultiplier;
    return Math.max(0.1, Math.min(1.0, stability));
  }

  // Calculate overall tower stability based on removed blocks and game state
  private calculateOverallTowerStability(): number {
    if (!this.gameState) return 1.0;
    
    // Use the current tower stability from game state
    return this.gameState.towerStability / 100;
  }

  private getContentForBlock(blockId: number, blockType: string, layer: number): Content {
    // New comprehensive privacy education categories
    const categories = [
      'on-chain-privacy',      // 15 blocks - Address reuse, transaction amounts, change addresses
      'off-chain-practices',   // 10 blocks - VPNs, different wallets, operational security
      'coin-mixing',           // 10 blocks - CoinJoin, traceability, user responsibility
      'wallet-setup',          // 5 blocks - Hierarchical wallets, seed phrase security
      'lightning-network',     // 5 blocks - Channel privacy, routing, unlinkability
      'regulatory',            // 5 blocks - KYC risks, public records, subpoenas
      'best-practices'         // 4 blocks - Tor, multisig, fund splitting
    ];
    
    // Determine category based on blockId for better distribution
    let category: 'on-chain-privacy' | 'off-chain-practices' | 'coin-mixing' | 'wallet-setup' | 'lightning-network' | 'regulatory' | 'best-practices';
    if (blockId <= 15) category = categories[0] as 'on-chain-privacy';
    else if (blockId <= 25) category = categories[1] as 'off-chain-practices';
    else if (blockId <= 35) category = categories[2] as 'coin-mixing';
    else if (blockId <= 40) category = categories[3] as 'wallet-setup';
    else if (blockId <= 45) category = categories[4] as 'lightning-network';
    else if (blockId <= 50) category = categories[5] as 'regulatory';
    else category = categories[6] as 'best-practices';

    // Calculate points based on layer and type
    const basePoints = 10;
    const layerMultiplier = 1 + (layer - 1) * 0.1;
    const typeMultiplier = blockType === 'safe' ? 1 : blockType === 'risky' ? 1.5 : 2;
    const points = Math.round(basePoints * layerMultiplier * typeMultiplier);

    return {
      id: blockId.toString(),
      title: `Privacy Tip ${blockId}`,
      text: this.getPrivacyTipText(blockId),
      severity: blockType === 'safe' ? 'tip' : blockType === 'risky' ? 'warning' : 'critical',
      quiz: this.getQuizForBlock(),
      points,
      category,
      fact: this.getPrivacyFact(category),
      impact: blockType === 'safe' ? 'positive' : 'neutral'
    };
  }

  private getPrivacyTipText(blockId: number): string {
    // Authentic Bitcoin privacy practices organized by risk level (Red=Severe, Orange=Moderate, Green=Mild)
    // Based on bitcoinjenga.com by Amiti & D++
    
    const severePractices = [
      'Never submit your private keys to any online service or third party',
      'Never store your seed phrase in digital format (photos, emails, cloud storage)',
      'Never share your seed phrase with anyone claiming to "help" you',
      'Never enter your seed phrase on any website or unfamiliar application',
      'Never use brain wallets or predictable seed phrases',
      'Never reuse addresses for multiple transactions - it links all your activity',
      'Never send your entire Bitcoin balance in one transaction',
      'Never use custodial wallets for long-term storage of significant amounts',
      'Never connect your hardware wallet to compromised computers',
      'Never ignore security updates for your wallet software',
      'Never use the same wallet for both privacy-sensitive and KYC transactions',
      'Never broadcast transactions from your home IP without Tor protection',
      'Never consolidate UTXOs from different sources in a single transaction',
      'Never use centralized mixers or tumblers (they can steal funds and are often honeypots)',
      'Never trust closed-source wallet software with significant amounts',
      'Never use online wallet generators or web-based wallet creation tools',
      'Never store recovery information on devices connected to the internet',
      'Never use the same computer for both regular browsing and Bitcoin transactions'
    ];

    const moderatePractices = [
      'Avoid using the same Bitcoin address for multiple purposes or services',
      'Avoid linking your real identity to your Bitcoin addresses on social media',
      'Avoid using blockchain explorers that track your IP and link it to addresses',
      'Avoid round number transactions that make your payments obvious',
      'Avoid using Bitcoin ATMs that require ID verification for privacy-sensitive transactions',
      'Avoid keeping large amounts on mobile wallets used for daily spending',
      'Avoid broadcasting transactions immediately after receiving funds',
      'Avoid using the same amount values repeatedly in transactions',
      'Avoid connecting to your own node over clearnet without additional privacy layers',
      'Avoid using exchange withdrawal addresses directly for private transactions',
      'Avoid timing patterns that could link your transactions',
      'Avoid using predictable transaction fee amounts',
      'Avoid mixing coins from different risk profiles in the same transaction',
      'Avoid using custodial lightning wallets for privacy-sensitive payments',
      'Avoid keeping detailed transaction records in easily accessible locations',
      'Avoid using Bitcoin debit cards for sensitive purchases',
      'Avoid participating in KYC exchanges if privacy is your primary concern',
      'Avoid using the same wallet software across different devices without proper isolation'
    ];

    const mildPractices = [
      'Consider using a new address for each transaction to improve privacy',
      'Consider running your own Bitcoin node to avoid relying on third parties',
      'Consider using Tor when connecting to Bitcoin network services',
      'Consider separating your Bitcoin holdings across multiple wallets',
      'Consider using coin selection features to avoid linking unrelated UTXOs',
      'Consider timing your transactions to blend with network activity',
      'Consider using Lightning Network for smaller, more private transactions',
      'Consider implementing proper operational security practices',
      'Consider using different fee strategies to avoid creating patterns',
      'Consider using collaborative transactions like CoinJoin when appropriate',
      'Consider keeping your node synchronized to avoid metadata leaks',
      'Consider using watch-only wallets for monitoring without exposing private keys',
      'Consider implementing proper backup and recovery procedures',
      'Consider using hardware wallets for cold storage of significant amounts',
      'Consider educating yourself about privacy trade-offs in different wallet types',
      'Consider monitoring your addresses for unexpected activity',
      'Consider using testnet for learning and experimentation',
      'Consider contributing to privacy-focused Bitcoin development and education'
    ];

    if (blockId <= 18) {
      return severePractices[(blockId - 1) % severePractices.length];
    } else if (blockId <= 36) {
      return moderatePractices[(blockId - 19) % moderatePractices.length];
    } else {
      return mildPractices[(blockId - 37) % mildPractices.length];
    }
  }

  private getQuizForBlock(): any {
    return {
      question: "What is the most important privacy consideration when using Bitcoin?",
      options: ["Speed of transactions", "Address reuse", "Transaction fees", "Network congestion"],
      correctIndex: 1,
      explanation: "Address reuse is one of the biggest privacy mistakes in Bitcoin, as it links all your transactions together."
    };
  }

  private getPrivacyFact(category: string): string {
    const facts: Record<string, string> = {
      'on-chain-privacy': 'Bitcoin transactions are permanently recorded on a public blockchain visible to everyone.',
      'off-chain-practices': 'Your IP address can be linked to your Bitcoin transactions without proper privacy tools.',
      'coin-mixing': 'CoinJoin helps break transaction links but requires careful implementation to be effective.',
      'wallet-setup': 'Hierarchical Deterministic (HD) wallets generate new addresses automatically for better privacy.',
      'lightning-network': 'Lightning Network provides better privacy than on-chain transactions but has its own considerations.',
      'regulatory': 'KYC information from exchanges can be subpoenaed and linked to your transaction history.',
      'best-practices': 'Combining multiple privacy techniques provides the strongest protection for your financial privacy.'
    };
    return facts[category] || 'Privacy is a fundamental right that requires active protection.';
  }

  private initializeLayerStats(): LayerStats[] {
    const stats: LayerStats[] = [];
    for (let layer = 1; layer <= 18; layer++) {
      stats.push({
        layer,
        totalBlocks: 3,
        removedBlocks: 0,
        stability: this.calculateStability(layer, 'safe'),
        points: 0
      });
    }
    return stats;
  }

  private initializeBlockTypeStats(): BlockTypeStats {
    return {
      safe: { total: 18, removed: 0, points: 0 },
      risky: { total: 18, removed: 0, points: 0 },
      challenge: { total: 18, removed: 0, points: 0 }
    };
  }

  private initializeAchievements() {
    this.achievements = [
      {
        id: 'privacy_novice',
        name: 'Privacy Novice',
        description: 'Complete your first privacy challenge',
        icon: '🎯',
        unlocked: false,
        category: 'beginner'
      },
      {
        id: 'stability_master',
        name: 'Stability Master',
        description: 'Maintain tower stability above 80%',
        icon: '🏗️',
        unlocked: false,
        category: 'advanced'
      }
    ];
  }

  // PUBLIC API METHODS

  async getBlocks(): Promise<Block[]> {
    // DEFENSIVE: Ensure blocks are initialized
    if (!this.blocks || this.blocks.length === 0) {
      console.error('🚨 CRITICAL: Blocks not initialized in getBlocks, reinitializing...');
      this.initializeMockData();
    }
    return Promise.resolve([...this.blocks]);
  }

  async getGameState(): Promise<GameState | null> {
    return Promise.resolve(this.gameState ? { ...this.gameState } : null);
  }

  async removeBlock(blockId: string): Promise<GameMove> {
    // DEFENSIVE: Ensure blocks are initialized
    if (!this.blocks || this.blocks.length === 0) {
      console.error('🚨 CRITICAL: Blocks not initialized in removeBlock, reinitializing...');
      this.initializeMockData();
    }
    
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) {
      throw new Error(`Block ${blockId} not found`);
    }

    if (block.removed) {
      throw new Error(`Block ${blockId} already removed`);
    }

    // Mark block as removed
    block.removed = true;

    // Update game state
    if (this.gameState) {
      this.gameState.blocksRemoved++;
      this.gameState.currentScore += block.content.points;
      this.gameState.currentPlayer.score += block.content.points;
      this.gameState.currentPlayer.totalBlocksRemoved++;
    }

    return {
      blockId,
      playerId: this.gameState?.currentPlayer.nickname || 'Player',
      timestamp: new Date(),
      points: block.content.points,
      newTowerStability: this.calculateOverallTowerStability(),
      achievementsUnlocked: []
    };
  }

  // 🧠 ENHANCED: Quiz system with sophisticated stability mechanics
  async answerQuiz(blockId: string, selectedAnswer: number): Promise<QuizResult> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block || !block.content.quiz) {
      throw new Error('Block not found or has no quiz');
    }

    if (!this.gameState) {
      throw new Error('Game state not initialized');
    }

    const isCorrect = selectedAnswer === block.content.quiz.correctIndex;
    
    // 🔥 ENHANCED: Progressive penalty/bonus system
    let stabilityChange = 0;
    
    if (isCorrect) {
      // 🎉 CORRECT ANSWER BONUSES
      this.gameState.correctAnswers++;
      this.gameState.currentPlayer.correctAnswers++;
      this.gameState.consecutiveCorrectAnswers++;
      this.gameState.consecutiveIncorrectAnswers = 0; // Reset wrong streak
      
      // Progressive bonus for consecutive correct answers
      const streakBonus = Math.min(this.gameState.consecutiveCorrectAnswers * 2, 10);
      const baseBonus = 12;
      
      // Reduced bonus when stability is already high (diminishing returns)
      const stabilityFactor = this.gameState.towerStability < 50 ? 1.5 : 0.8;
      
      stabilityChange = Math.round((baseBonus + streakBonus) * stabilityFactor);
      
    } else {
      // ❌ WRONG ANSWER PENALTIES  
      this.gameState.incorrectAnswers++;
      this.gameState.currentPlayer.incorrectAnswers++;
      this.gameState.consecutiveIncorrectAnswers++;
      this.gameState.consecutiveCorrectAnswers = 0; // Reset correct streak
      
      // Progressive penalty for consecutive wrong answers
      const consecutiveMultiplier = Math.min(this.gameState.consecutiveIncorrectAnswers * 1.5, 4.0);
      
      // Block type affects penalty severity
      const typeMultiplier = {
        'safe': 1.0,      // -8% stability loss
        'risky': 1.5,     // -12% stability loss  
        'challenge': 2.0  // -16% stability loss
      }[block.type] || 1.0;
      
      const basePenalty = -8;
      stabilityChange = Math.round(basePenalty * consecutiveMultiplier * typeMultiplier);
    }
    
    const pointsAwarded = isCorrect ? block.content.points * 2 : 0;

    // Apply stability change with bounds checking
    const previousStability = this.gameState.towerStability;
    this.gameState.towerStability = Math.max(0, Math.min(100, 
      this.gameState.towerStability + stabilityChange
    ));

    // Award points and update score
    this.gameState.currentScore += pointsAwarded;
    this.gameState.currentPlayer.score += pointsAwarded;

    console.log('🧠 Quiz answered:', {
      isCorrect,
      stabilityChange,
      previousStability,
      newStability: this.gameState.towerStability,
      correctAnswers: this.gameState.correctAnswers,
      incorrectAnswers: this.gameState.incorrectAnswers,
      consecutiveCorrect: this.gameState.consecutiveCorrectAnswers,
      consecutiveIncorrect: this.gameState.consecutiveIncorrectAnswers
    });

    // 🏗️ CHECK GAME OVER CONDITIONS
    this.checkGameOverConditions();

    const quizResult: QuizResult = {
      blockId,
      isCorrect,
      selectedAnswer,
      correctAnswer: block.content.quiz.correctIndex,
      stabilityChange,
      pointsAwarded,
      explanation: block.content.quiz.explanation
    };

    return quizResult;
  }

  // 🎯 ENHANCED: Sophisticated game over detection with multiple collapse triggers
  private checkGameOverConditions() {
    if (!this.gameState) return;

    const totalAnswers = this.gameState.correctAnswers + this.gameState.incorrectAnswers;
    const correctPercentage = totalAnswers > 0 ? (this.gameState.correctAnswers / totalAnswers) * 100 : 0;

    // 💥 ENHANCED TOWER COLLAPSE CONDITIONS
    
    // 1. Critical stability threshold
    if (this.gameState.towerStability <= 15) {
      this.gameState.gamePhase = 'collapsed';
      this.gameState.isGameComplete = true;
      console.log('💥 Tower collapsed due to low stability! Stability:', this.gameState.towerStability);
      return;
    }
    
    // 2. Consecutive wrong answers threshold (confidence collapse)
    if (this.gameState.consecutiveIncorrectAnswers >= 5) {
      this.gameState.gamePhase = 'collapsed';
      this.gameState.isGameComplete = true;
      console.log('💥 Tower collapsed due to consecutive wrong answers! Streak:', this.gameState.consecutiveIncorrectAnswers);
      return;
    }
    
    // 3. Overall accuracy threshold breach (knowledge collapse)
    if (totalAnswers >= 10 && correctPercentage < 30) {
      this.gameState.gamePhase = 'collapsed';
      this.gameState.isGameComplete = true;
      console.log(`💥 Tower collapsed due to poor accuracy! Rate: ${correctPercentage.toFixed(1)}%`);
      return;
    }

    // 🎉 ENHANCED VICTORY CONDITIONS
    const allBlocks = this.blocks.length;
    const answeredBlocks = this.gameState.correctAnswers + this.gameState.incorrectAnswers;
    
    // 1. Knowledge mastery victory (answer all blocks with 70%+ accuracy)
    if (answeredBlocks >= allBlocks && correctPercentage >= 70) {
      this.gameState.gamePhase = 'complete';
      this.gameState.isGameComplete = true;
      console.log(`🎉 Knowledge mastery achieved! Accuracy: ${correctPercentage.toFixed(1)}%`);
      return;
    }
    
    // 2. Efficiency victory (high accuracy with tower intact)
    if (correctPercentage >= 90 && this.gameState.towerStability >= 80 && answeredBlocks >= 30) {
      this.gameState.gamePhase = 'complete';
      this.gameState.isGameComplete = true;
      console.log(`🏆 Efficiency expert victory! Accuracy: ${correctPercentage.toFixed(1)}%, Stability: ${this.gameState.towerStability}%`);
      return;
    }

    // ⚠️ WARNING STATE - Low stability but still playable
    if (this.gameState.towerStability <= 30) {
      console.log('⚠️ Tower in danger! Stability:', this.gameState.towerStability);
    }

    // Continue playing
    this.gameState.gamePhase = 'rolling';
  }

  // 🏗️ ENHANCED: Tower regeneration with learning progression
  async regenerateTower(): Promise<void> {
    if (!this.gameState) return;

    console.log('🏗️ Regenerating tower after collapse...');

    // Calculate learning metrics for progression
    const totalAnswers = this.gameState.correctAnswers + this.gameState.incorrectAnswers;
    const accuracy = totalAnswers > 0 ? (this.gameState.correctAnswers / totalAnswers) * 100 : 0;

    // Reset all blocks to their original state
    this.blocks.forEach(block => {
      block.removed = false;
    });

    // Mix blocks immediately for fresh start
    // this.mixBlockTypes(); // REMOVED: No more block mixing

    // Reset game state but preserve learning progress
    const previousScore = this.gameState.currentScore;
    const previousGamesPlayed = this.gameState.currentPlayer.gamesPlayed;
    
    this.gameState.towerStability = 100;
    this.gameState.gamePhase = 'rolling';
    this.gameState.isGameComplete = false;
    this.gameState.blocksRemoved = 0;
    this.gameState.diceResult = 0;
    this.gameState.canPullFromLayers = [];
    this.gameState.availableBlocks = [];
    
    // Learning progression: Keep partial score based on performance
    const scoreRetention = Math.max(0.3, accuracy / 100); // Keep 30-100% of score
    this.gameState.currentScore = Math.round(previousScore * scoreRetention);
    this.gameState.currentPlayer.score = this.gameState.currentScore;
    
    // Update player statistics
    this.gameState.currentPlayer.gamesPlayed = previousGamesPlayed + 1;
    this.gameState.currentPlayer.totalPoints += previousScore;
    
    // Reset quiz counters for new game
    this.gameState.correctAnswers = 0;
    this.gameState.incorrectAnswers = 0;
    this.gameState.consecutiveCorrectAnswers = 0;
    this.gameState.consecutiveIncorrectAnswers = 0;
    this.gameState.currentPlayer.correctAnswers = 0;
    this.gameState.currentPlayer.incorrectAnswers = 0;

    console.log('🎮 Tower regenerated:', {
      scoreRetained: `${Math.round(scoreRetention * 100)}%`,
      newScore: this.gameState.currentScore,
      gamesPlayed: this.gameState.currentPlayer.gamesPlayed,
      accuracy: `${accuracy.toFixed(1)}%`
    });
  }

  async rollDice(): Promise<DiceResult> {
    // DEFENSIVE: Ensure blocks are initialized
    if (!this.blocks || this.blocks.length === 0) {
      console.error('🚨 CRITICAL: Blocks not initialized, reinitializing...');
      this.initializeMockData();
    }
    
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const availableLayers = this.getAvailableLayersFromDiceRoll(diceRoll);
    
    // SIMPLIFIED: No more block mixing - just determine accessible layers
    // Blocks keep their original types and colors throughout the game
    
    const availableBlocks = this.getAvailableBlocksAfterDiceRoll(availableLayers);

    if (this.gameState) {
      this.gameState.diceResult = diceRoll;
      this.gameState.canPullFromLayers = availableLayers;
      this.gameState.availableBlocks = availableBlocks;
      this.gameState.gamePhase = 'selecting';
    }

    console.log('🎲 Dice rolled - layers unlocked:', {
      roll: diceRoll,
      availableLayers,
      availableBlocks: availableBlocks.length,
      totalBlocks: this.blocks.filter(b => !b.removed).length
    });

    return {
      value: diceRoll,
      availableLayers,
      availableBlocks,
      specialEffect: 'layers_unlocked' // Changed from 'blocks_mixed'
    };
  }

  // REMOVED: The complex mixBlockTypes method that was causing corruption
  // Blocks now maintain their original types throughout the game

  private getAvailableBlocksAfterDiceRoll(availableLayers: number[]): string[] {
    // DEFENSIVE: Ensure blocks are initialized
    if (!this.blocks || this.blocks.length === 0) {
      console.error('🚨 CRITICAL: Blocks not initialized in getAvailableBlocksAfterDiceRoll');
      return [];
    }
    
    // SIMPLIFIED: Just return blocks in accessible layers, no mixing
    const blocksInLayers = this.blocks.filter(block => 
      !block.removed && availableLayers.includes(block.layer)
    );
    
    // Return all accessible blocks (no artificial limiting)
    return blocksInLayers.map(block => block.id);
  }

  private getAvailableLayersFromDiceRoll(diceRoll: number): number[] {
    // DEFENSIVE: Ensure blocks are initialized
    if (!this.blocks || this.blocks.length === 0) {
      console.error('🚨 CRITICAL: Blocks not initialized in getAvailableLayersFromDiceRoll');
      return [];
    }
    
    // SIMPLIFIED: Only unlock the exact number of layers from dice roll
    const availableLayers: number[] = [];
    
    // Only unlock layers 1 through diceRoll (e.g., roll 4 = layers 1,2,3,4)
    for (let layer = 1; layer <= diceRoll; layer++) {
      const layerHasBlocks = this.blocks.some(b => b.layer === layer && !b.removed);
      if (layerHasBlocks) {
        availableLayers.push(layer);
      }
    }
    
    return availableLayers;
  }

  async resetGame(): Promise<GameState> {
    console.log('🔄 Resetting game to fresh state...');
    
    // Reset all blocks to original state (no mixing)
    this.blocks.forEach(block => {
      block.removed = false;
      // Keep original block type and content - no corruption
    });
    
    // Reset game state but preserve learning progress
    if (this.gameState) {
      this.gameState.blocksRemoved = 0;
      this.gameState.currentScore = 0;
      this.gameState.diceResult = 0;
      this.gameState.canPullFromLayers = [];
      this.gameState.availableBlocks = [];
      this.gameState.gamePhase = 'rolling';
      this.gameState.towerStability = 100;
      this.gameState.isGameComplete = false;
      
      // Preserve player learning progress
      // this.gameState.correctAnswers = 0; // Keep for learning continuity
      // this.gameState.incorrectAnswers = 0; // Keep for learning continuity
    }
    
    console.log('✅ Game reset complete - blocks restored to original state');
    return this.gameState!;
  }

  async getAchievements(): Promise<Achievement[]> {
    return Promise.resolve([...this.achievements]);
  }
}

// Create singleton instance
const mockGameService = new MockGameService();

// Export the instance as default
export default mockGameService;
