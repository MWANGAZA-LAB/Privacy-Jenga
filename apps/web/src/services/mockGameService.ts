// Enhanced Mock Game Service - Single Player Privacy Jenga Implementation
import { 
  Block, 
  Content, 
  GameState, 
  GameMove, 
  Achievement, 
  SpecialAction,
  DiceResult,
  LayerStats,
  BlockTypeStats,
  Player
} from '../types';

class MockGameService {
  private blocks: Block[] = [];
  private gameState: GameState | null = null;
  private achievements: Achievement[] = [];
  private specialActions: SpecialAction[] = [];

  constructor() {
    this.initializeMockData();
    this.initializeAchievements();
    this.initializeSpecialActions();
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

    // Initialize game state
    this.gameState = {
      currentPlayer,
      towerHeight: 18,
      blocksRemoved: 0,
      totalBlocks: 54,
      currentScore: 0,
      gameMode: 'learning',
      difficulty: 1,
      diceResult: 0,
      canPullFromLayers: [1, 2, 3],
      specialActions: [],
      gameHistory: [],
      layerStats: this.initializeLayerStats(),
      blockTypeStats: this.initializeBlockTypeStats()
    };
  }

  private createComplete54BlockSystem(): Block[] {
    const blocks: Block[] = [];
    let blockId = 1;

    // Create exactly 54 blocks (18 layers × 3 blocks per layer)
    for (let layer = 1; layer <= 18; layer++) {
      for (let position = 1; position <= 3; position++) {
        // Determine block type based on layer and position for balanced distribution
        const blockType = this.getBlockTypeForPosition(layer, position);
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

  private getBlockTypeForPosition(layer: number, position: number): 'safe' | 'risky' | 'challenge' {
    // Balanced distribution: 18 safe, 18 risky, 18 challenge
    // Layer 1-6: More safe blocks for beginners
    if (layer <= 6) {
      if (position === 1 || position === 2) return 'safe';
      if (position === 3) return layer % 2 === 0 ? 'risky' : 'challenge';
    }
    // Layer 7-12: Balanced mix
    else if (layer <= 12) {
      if (position === 1) return 'safe';
      if (position === 2) return 'risky';
      if (position === 3) return 'challenge';
    }
    // Layer 13-18: More challenging
    else if (layer <= 18) {
      if (position === 1) return 'risky';
      if (position === 2 || position === 3) return 'challenge';
    }
    return 'safe'; // Fallback
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

  private getContentForBlock(blockId: number, blockType: string, layer: number): Content {
    const categories = ['password', 'social-media', 'wifi', 'data-sharing', 'encryption', 'general', 'phishing', 'backup'];
    
    // Determine category based on layer
    let category: any;
    if (layer <= 3) category = categories[0]; // password
    else if (layer <= 6) category = categories[1]; // social-media
    else if (layer <= 9) category = categories[2]; // wifi
    else if (layer <= 12) category = categories[3]; // data-sharing
    else if (layer <= 15) category = categories[4]; // encryption
    else if (layer <= 18) category = categories[5]; // general
    else category = categories[0]; // fallback

    // Calculate points based on layer and type
    const basePoints = 10;
    const layerMultiplier = 1 + (layer - 1) * 0.1;
    const typeMultiplier = blockType === 'safe' ? 1 : blockType === 'risky' ? 1.5 : 2;
    const points = Math.round(basePoints * layerMultiplier * typeMultiplier);

    return {
      id: blockId.toString(),
      title: `Privacy Tip ${blockId}`,
      text: this.getPrivacyTipText(blockId, category),
      severity: blockType === 'safe' ? 'tip' : blockType === 'risky' ? 'warning' : 'critical',
      quiz: this.getQuizForBlock(blockId, category),
      points,
      category,
      fact: this.getPrivacyFact(category),
      impact: blockType === 'safe' ? 'positive' : 'neutral'
    };
  }

  private getPrivacyTipText(blockId: number, category: string): string {
    // Enhanced privacy tips for each category
    const tips = {
      'password': [
        'Use a unique password for each account to prevent credential stuffing attacks.',
        'Enable two-factor authentication (2FA) on all your accounts for extra security.',
        'Create strong passwords with at least 12 characters including numbers and symbols.',
        'Use a password manager to generate and store complex passwords securely.',
        'Never share your passwords with anyone, including customer service representatives.',
        'Change your passwords regularly, especially after security breaches.',
        'Avoid using personal information like birthdays in your passwords.'
      ],
      'social-media': [
        'Review your privacy settings monthly to ensure your posts are only visible to intended audiences.',
        'Be cautious about sharing location data, as it can reveal your daily routines.',
        'Think twice before posting personal information that could be used for identity theft.',
        'Use strong privacy settings to limit who can see your profile and posts.',
        'Be selective about accepting friend requests from people you don\'t know.',
        'Regularly audit your friends list and remove connections you no longer trust.',
        'Consider using a pseudonym instead of your real name for additional privacy.'
      ],
      'wifi': [
        'Never connect to public WiFi networks without using a VPN for encryption.',
        'Use WPA3 encryption on your home WiFi network for maximum security.',
        'Change your WiFi password from the default to something strong and unique.',
        'Disable WiFi when not in use to prevent automatic connections to unknown networks.',
        'Use a mobile hotspot instead of public WiFi when possible.',
        'Enable firewall protection on your devices when using public networks.',
        'Avoid accessing sensitive accounts on public WiFi networks.'
      ],
      'data-sharing': [
        'Read privacy policies before agreeing to share your personal information.',
        'Limit the amount of personal data you share with apps and services.',
        'Use privacy-focused alternatives to popular apps when possible.',
        'Regularly review and revoke permissions for apps you no longer use.',
        'Be cautious about sharing data with third-party services.',
        'Use disposable email addresses for non-essential services.',
        'Consider using a data broker opt-out service to remove your information.'
      ],
      'encryption': [
        'Use end-to-end encryption for all your communications and file storage.',
        'Enable full-disk encryption on your devices to protect data at rest.',
        'Use encrypted messaging apps like Signal for sensitive conversations.',
        'Store important files in encrypted cloud storage or encrypted containers.',
        'Use HTTPS for all web browsing to encrypt data in transit.',
        'Consider using a VPN to encrypt all your internet traffic.',
        'Use encrypted email services for sensitive communications.'
      ],
      'general': [
        'Regularly update your software and operating systems to patch security vulnerabilities.',
        'Use antivirus software and keep it updated to protect against malware.',
        'Back up your important data regularly using multiple methods.',
        'Be skeptical of unsolicited requests for personal information.',
        'Use different email addresses for different purposes to compartmentalize your data.',
        'Monitor your accounts regularly for suspicious activity.',
        'Consider using privacy-focused browsers and search engines.'
      ],
      'phishing': [
        'Never click on links in suspicious emails, even if they look legitimate.',
        'Verify the sender\'s email address carefully before responding to requests.',
        'Be cautious of urgent requests for personal or financial information.',
        'Use anti-phishing tools and browser extensions for additional protection.',
        'Report phishing attempts to help protect others from similar attacks.',
        'Never share passwords, PINs, or security codes via email or text.',
        'When in doubt, contact the company directly using verified contact information.'
      ],
      'backup': [
        'Create multiple backups of important data using different storage methods.',
        'Use cloud backup services with strong encryption for off-site storage.',
        'Test your backup and recovery procedures regularly to ensure they work.',
        'Keep backups in different physical locations to protect against disasters.',
        'Use version control for important documents to track changes over time.',
        'Encrypt your backups to protect sensitive information.',
        'Document your backup procedures for future reference.'
      ]
    };

    const categoryTips = tips[category as keyof typeof tips] || tips.general;
    const tipIndex = (blockId - 1) % categoryTips.length;
    return categoryTips[tipIndex];
  }

  private getQuizForBlock(blockId: number, category: string): any {
    // Enhanced quizzes for each category
    const quizzes = {
      'password': [
        {
          question: 'What is the minimum recommended length for a strong password?',
          choices: ['8 characters', '12 characters', '16 characters', '20 characters'],
          correctIndex: 1,
          explanation: '12 characters is the minimum recommended length for strong passwords, though longer is better.'
        },
        {
          question: 'Which of the following makes a password stronger?',
          choices: ['Using your pet\'s name', 'Using random words with numbers', 'Using your birthday', 'Using your favorite color'],
          correctIndex: 1,
          explanation: 'Random words combined with numbers create much stronger passwords than personal information.'
        }
      ],
      'social-media': [
        {
          question: 'What should you do before accepting a friend request?',
          choices: ['Accept immediately', 'Check their profile and mutual friends', 'Ignore all requests', 'Accept if they have many friends'],
          correctIndex: 1,
          explanation: 'Always verify the person\'s identity by checking their profile and mutual connections before accepting.'
        },
        {
          question: 'Which privacy setting is most secure for your posts?',
          choices: ['Public', 'Friends of friends', 'Friends only', 'Custom'],
          correctIndex: 2,
          explanation: 'Friends only is the most secure default setting, though custom settings can be more precise.'
        }
      ],
      'wifi': [
        {
          question: 'What should you do when connecting to public WiFi?',
          choices: ['Connect immediately', 'Use a VPN', 'Share your password', 'Disable your firewall'],
          correctIndex: 1,
          explanation: 'Always use a VPN when connecting to public WiFi to encrypt your traffic and protect your data.'
        },
        {
          question: 'Which WiFi encryption is most secure?',
          choices: ['WEP', 'WPA', 'WPA2', 'WPA3'],
          correctIndex: 3,
          explanation: 'WPA3 is the most recent and secure WiFi encryption standard available.'
        }
      ],
      'data-sharing': [
        {
          question: 'What should you do before agreeing to a privacy policy?',
          choices: ['Skip it', 'Read it carefully', 'Accept without reading', 'Ignore it'],
          correctIndex: 1,
          explanation: 'Always read privacy policies to understand how your data will be used and shared.'
        },
        {
          question: 'Which is safer for non-essential services?',
          choices: ['Your primary email', 'A disposable email', 'Your work email', 'Your school email'],
          correctIndex: 1,
          explanation: 'Use disposable email addresses for services you don\'t trust or need long-term.'
        }
      ],
      'encryption': [
        {
          question: 'What does end-to-end encryption protect?',
          choices: ['Only files at rest', 'Only data in transit', 'Data from sender to recipient', 'Only cloud storage'],
          correctIndex: 2,
          explanation: 'End-to-end encryption protects data from the moment it leaves the sender until it reaches the intended recipient.'
        },
        {
          question: 'Which protocol ensures secure web browsing?',
          choices: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
          correctIndex: 1,
          explanation: 'HTTPS encrypts data between your browser and websites, protecting your information from interception.'
        }
      ],
      'general': [
        {
          question: 'How often should you update your software?',
          choices: ['Never', 'Only when problems occur', 'When updates are available', 'Monthly'],
          correctIndex: 2,
          explanation: 'Install software updates as soon as they\'re available to patch security vulnerabilities.'
        },
        {
          question: 'What is the best way to protect against malware?',
          choices: ['Ignore security warnings', 'Use antivirus software', 'Disable firewalls', 'Share files freely'],
          correctIndex: 1,
          explanation: 'Antivirus software is essential for detecting and removing malicious software from your devices.'
        }
      ],
      'phishing': [
        {
          question: 'What should you do with suspicious emails?',
          choices: ['Click all links', 'Delete them immediately', 'Forward to friends', 'Reply with your password'],
          correctIndex: 1,
          explanation: 'Delete suspicious emails immediately without clicking any links or responding to them.'
        },
        {
          question: 'How can you verify a company\'s contact information?',
          choices: ['Trust the email', 'Call the number in the email', 'Look up the company\'s official website', 'Ask friends'],
          correctIndex: 2,
          explanation: 'Always verify contact information through the company\'s official website, not through emails.'
        }
      ],
      'backup': [
        {
          question: 'How many backup copies should you have?',
          choices: ['One', 'Two', 'Three or more', 'None'],
          correctIndex: 2,
          explanation: 'The 3-2-1 rule recommends at least 3 copies, on 2 different media types, with 1 off-site.'
        },
        {
          question: 'What should you do with your backups?',
          choices: ['Keep them all in one place', 'Store them in different locations', 'Share them online', 'Ignore them'],
          correctIndex: 1,
          explanation: 'Store backups in different physical locations to protect against disasters like fires or floods.'
        }
      ]
    };

    const categoryQuizzes = quizzes[category as keyof typeof quizzes] || quizzes.general;
    const quizIndex = (blockId - 1) % categoryQuizzes.length;
    return categoryQuizzes[quizIndex];
  }

  private getPrivacyFact(category: string): string {
    const facts = {
      'password': 'The most common password in 2023 was "123456", used by over 2.5 million people.',
      'social-media': 'Social media platforms collect an average of 1,500 data points per user.',
      'wifi': 'Public WiFi networks can be compromised in as little as 30 seconds by experienced hackers.',
      'data-sharing': 'Data brokers can sell your personal information to over 100 different companies.',
      'encryption': 'End-to-end encryption ensures that even the service provider cannot read your messages.',
      'general': 'Cybercrime costs the global economy over $6 trillion annually, more than the GDP of most countries.',
      'phishing': 'Phishing attacks increased by 600% during the COVID-19 pandemic.',
      'backup': '60% of companies that lose their data shut down within 6 months of the incident.'
    };

    return facts[category as keyof typeof facts] || facts.general;
  }

  private initializeLayerStats(): LayerStats[] {
    const stats: LayerStats[] = [];
    for (let layer = 1; layer <= 18; layer++) {
      const layerBlocks = this.blocks.filter(b => b.layer === layer);
      stats.push({
        layer,
        safeBlocks: layerBlocks.filter(b => b.type === 'safe').length,
        riskyBlocks: layerBlocks.filter(b => b.type === 'risky').length,
        challengeBlocks: layerBlocks.filter(b => b.type === 'challenge').length,
        totalBlocks: layerBlocks.length,
        removedBlocks: 0
      });
    }
    return stats;
  }

  private initializeBlockTypeStats(): BlockTypeStats {
    return {
      safe: { total: 18, removed: 0, points: 0 },
      risky: { total: 18, removed: 0, points: 0 },
      challenge: { total: 18, removed: 0, points: 0, correct: 0, incorrect: 0 }
    };
  }

  private initializeAchievements() {
    this.achievements = [
      { id: 'first_block', name: 'First Steps', description: 'Remove your first block', icon: '🎯', unlockedAt: new Date(), points: 10 },
      { id: 'safe_player', name: 'Safety First', description: 'Remove 5 safe blocks', icon: '🛡️', unlockedAt: new Date(), points: 25 },
      { id: 'risk_taker', name: 'Risk Taker', description: 'Remove 5 risky blocks', icon: '⚠️', unlockedAt: new Date(), points: 50 },
      { id: 'challenge_master', name: 'Challenge Master', description: 'Answer 5 challenge questions correctly', icon: '🧠', unlockedAt: new Date(), points: 100 },
      { id: 'tower_builder', name: 'Tower Builder', description: 'Remove blocks from 10 different layers', icon: '🏗️', unlockedAt: new Date(), points: 75 },
      { id: 'privacy_expert', name: 'Privacy Expert', description: 'Score 500 points', icon: '👑', unlockedAt: new Date(), points: 200 },
      { id: 'speed_demon', name: 'Speed Demon', description: 'Remove 3 blocks in under 2 minutes', icon: '⚡', unlockedAt: new Date(), points: 150 },
      { id: 'perfect_score', name: 'Perfect Score', description: 'Answer 10 questions correctly in a row', icon: '💯', unlockedAt: new Date(), points: 300 }
    ];
  }

  private initializeSpecialActions() {
    this.specialActions = [
      {
        id: 'double_points',
        name: 'Double Points',
        description: 'Double your points for the next block',
        cost: 50,
        effect: 'Next block gives 2x points',
        available: true
      },
      {
        id: 'extra_turn',
        name: 'Extra Block',
        description: 'Remove one additional block',
        cost: 100,
        effect: 'Remove one additional block',
        available: true
      },
      {
        id: 'stability_boost',
        name: 'Stability Boost',
        description: 'Increase tower stability temporarily',
        cost: 75,
        effect: 'Tower becomes more stable for 3 blocks',
        available: true
      }
    ];
  }

  // Public methods
  async startLearningMode(): Promise<void> {
    // Game state is already initialized in constructor
    if (this.gameState) {
      this.gameState.gameMode = 'learning';
      console.log('Learning mode started - tower will reset for continuous learning');
    }
  }

  async resetGame(): Promise<void> {
    // Reset all blocks
    this.blocks.forEach(block => {
      block.removed = false;
    });

    // Reset game state
    if (this.gameState) {
      this.gameState.towerHeight = 18;
      this.gameState.blocksRemoved = 0;
      this.gameState.currentScore = 0;
      this.gameState.diceResult = 0;
      this.gameState.canPullFromLayers = [1, 2, 3];
      this.gameState.gameHistory = [];
      this.gameState.layerStats = this.initializeLayerStats();
      this.gameState.blockTypeStats = this.initializeBlockTypeStats();
    }

    console.log('Game reset - new learning session started');
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  getBlocks(): Block[] {
    return this.blocks.filter(block => !block.removed);
  }

  getAllBlocks(): Block[] {
    return this.blocks;
  }

  async rollDice(): Promise<DiceResult> {
    if (!this.gameState) throw new Error('Game not initialized');

    const value = Math.floor(Math.random() * 6) + 1;
    console.log(`Dice roll: ${value}`);

    const diceResults: Record<number, DiceResult> = {
      1: { value: 1, effect: 'Remove from bottom 3 layers only', layerRestrictions: [1, 2, 3], bonusMultiplier: 1.0, specialEvent: 'Conservative play - focus on stability' },
      2: { value: 2, effect: 'Remove from layers 1-6', layerRestrictions: [1, 2, 3, 4, 5, 6], bonusMultiplier: 1.2, specialEvent: 'Balanced approach - moderate risk' },
      3: { value: 3, effect: 'Remove from any layer', layerRestrictions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], bonusMultiplier: 1.5, specialEvent: 'High risk, high reward!' },
      4: { value: 4, effect: 'Remove from middle layers 7-12', layerRestrictions: [7, 8, 9, 10, 11, 12], bonusMultiplier: 1.3, specialEvent: 'Strategic play - middle ground' },
      5: { value: 5, effect: 'Remove from upper layers 13-18', layerRestrictions: [13, 14, 15, 16, 17, 18], bonusMultiplier: 1.8, specialEvent: 'Danger zone - maximum points!' },
      6: { value: 6, effect: 'Remove from any layer with bonus', layerRestrictions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], bonusMultiplier: 2.0, specialEvent: 'Double points for this turn!' }
    };

    const result = diceResults[value];
    this.gameState.diceResult = value;
    this.gameState.canPullFromLayers = result.layerRestrictions;

    return result;
  }

  async pickBlock(blockId: string): Promise<{ success: boolean; gameState: GameState | null; content: Content | null }> {
    if (!this.gameState) {
      return { success: false, gameState: null, content: null };
    }

    const block = this.blocks.find(b => b.id === blockId);
    if (!block || block.removed) {
      return { success: false, gameState: this.gameState, content: null };
    }

    // Check if block can be removed from current layer
    if (!this.gameState.canPullFromLayers.includes(block.layer)) {
      return { success: false, gameState: this.gameState, content: null };
    }

    // Remove the block
    block.removed = true;
    this.gameState.blocksRemoved++;
    this.gameState.currentScore += block.content.points;

    // Update layer stats
    const layerStat = this.gameState.layerStats.find(ls => ls.layer === block.layer);
    if (layerStat) {
      layerStat.removedBlocks++;
    }

    // Update block type stats
    const blockTypeStat = this.gameState.blockTypeStats[block.type];
    if (blockTypeStat) {
      blockTypeStat.removed++;
      blockTypeStat.points += block.content.points;
    }

    // Add to game history
    const gameMove: GameMove = {
      id: Date.now().toString(),
      blockId: block.id,
      blockType: block.type,
      layer: block.layer,
      points: block.content.points,
      stability: block.stability,
      timestamp: new Date(),
      content: block.content
    };
    this.gameState.gameHistory.push(gameMove);

    // Update tower height
    this.updateTowerHeight();

    return { success: true, gameState: this.gameState, content: block.content };
  }

  private updateTowerHeight() {
    if (!this.gameState) return;

    // Calculate remaining layers
    const remainingLayers = new Set(this.blocks.filter(b => !b.removed).map(b => b.layer));
    this.gameState.towerHeight = remainingLayers.size;

    // Check if tower is too unstable
    if (this.calculateTowerStability() < 20) {
      console.log('Tower becoming unstable - consider resetting');
    }
  }

  calculateTowerStability(): number {
    if (!this.gameState) return 100;

    const remainingBlocks = this.blocks.filter(b => !b.removed);
    if (remainingBlocks.length === 0) return 0;

    // Calculate stability based on remaining blocks
    let totalStability = 0;
    let totalWeight = 0;

    remainingBlocks.forEach(block => {
      const weight = 1 / block.layer; // Higher layers have less weight
      totalStability += block.stability * weight;
      totalWeight += weight;
    });

    const averageStability = totalStability / totalWeight;
    const stability = Math.max(0, Math.min(100, averageStability * 100));

    return stability;
  }

  getGameModeInfo() {
    if (!this.gameState) return null;

    if (this.gameState.gameMode === 'learning') {
      return {
        mode: 'Learning',
        description: 'Continuous learning with tower resets',
        rules: [
          'Tower automatically resets when it becomes unstable for continuous learning',
          'Score accumulates across multiple tower resets',
          'Focus on mastering all 54 privacy concepts',
          'Perfect for extended learning and skill development'
        ]
      };
    } else {
      return {
        mode: 'Classic',
        description: 'Traditional Jenga experience - game ends when tower falls',
        rules: [
          'Remove blocks carefully to avoid tower collapse',
          'Game ends when tower becomes unstable or collapses',
          'Try to achieve the highest score possible',
          'Perfect for focused, strategic gameplay'
        ]
      };
    }
  }

  canContinueGame(): boolean {
    if (!this.gameState) return false;

    if (this.gameState.gameMode === 'learning') {
      // In learning mode, game can always continue (tower resets)
      return true;
    } else {
      // In classic mode, check if tower is still stable
      return this.calculateTowerStability() > 20 && this.gameState.towerHeight > 3;
    }
  }

  async answerQuiz(blockId: string, selectedAnswer: number): Promise<{ correct: boolean; explanation: string; points: number }> {
    if (!this.gameState) {
      return { correct: false, explanation: 'Game not initialized', points: 0 };
    }

    const block = this.blocks.find(b => b.id === blockId);
    if (!block || !block.content.quiz) {
      return { correct: false, explanation: 'No quiz available', points: 0 };
    }

    const isCorrect = selectedAnswer === block.content.quiz.correctIndex;
    const points = isCorrect ? block.content.points * 2 : block.content.points / 2;

    // Update game state
    if (isCorrect) {
      this.gameState.currentScore += points;
      this.gameState.blockTypeStats.challenge.correct++;
    } else {
      this.gameState.blockTypeStats.challenge.incorrect++;
    }

    // Update game history
    const gameMove = this.gameState.gameHistory.find(gm => gm.blockId === blockId);
    if (gameMove) {
      gameMove.quizAnswered = true;
      gameMove.quizCorrect = isCorrect;
    }

    return {
      correct: isCorrect,
      explanation: block.content.quiz.explanation,
      points
    };
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getSpecialActions(): SpecialAction[] {
    return this.specialActions;
  }

  async useSpecialAction(actionId: string): Promise<{ success: boolean; gameState: GameState | null }> {
    if (!this.gameState) {
      return { success: false, gameState: null };
    }

    const action = this.specialActions.find(a => a.id === actionId);
    if (!action || !action.available) {
      return { success: false, gameState: this.gameState };
    }

    // Check if player has enough points
    if (this.gameState.currentScore < action.cost) {
      return { success: false, gameState: this.gameState };
    }

    // Apply action effect
    this.gameState.currentScore -= action.cost;
    action.available = false;

    // Implement action effects
    switch (actionId) {
      case 'double_points':
        // Next block will give double points
        break;
      case 'extra_turn':
        // Player gets an extra turn
        break;
      case 'stability_boost':
        // Increase tower stability
        break;
    }

    return { success: true, gameState: this.gameState };
  }
}

export default MockGameService;
