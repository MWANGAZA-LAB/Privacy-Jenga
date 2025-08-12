// Enhanced Mock Game Service - Complete 54-Block Privacy Jenga Implementation
import { 
  Block, 
  Content, 
  MockRoom, 
  MockPlayer, 
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
  private rooms: MockRoom[] = [];
  private currentRoom: MockRoom | null = null;
  private players: MockPlayer[] = [];
  private blocks: Block[] = [];
  private gameState: GameState | null = null;
  private achievements: Achievement[] = [];
  private specialActions: SpecialAction[] = [];

  constructor() {
    console.log('MockGameService - Constructor called, initializing...');
    try {
      this.initializeMockData();
      this.initializeAchievements();
      this.initializeSpecialActions();
      console.log('MockGameService - Initialization complete');
      console.log('MockGameService - Total blocks created:', this.blocks.length);
      console.log('MockGameService - Total players created:', this.players.length);
    } catch (error) {
      console.error('MockGameService - Error in constructor:', error);
    }
  }

  private initializeMockData() {
    console.log('MockGameService - initializeMockData called');
    
    // Create mock rooms
    this.rooms = [
      {
        id: '1',
        code: 'ABC123',
        players: ['Player1'],
        status: 'waiting',
        currentTurn: 0,
        blocks: []
      }
    ];
    console.log('MockGameService - Rooms created:', this.rooms.length);

    // Create single player for single-player mode
    this.players = [
      { 
        id: '1', 
        nickname: 'Player1', 
        avatar: '🎮', 
        points: 0,
        score: 0,
        achievements: [],
        highScore: 0,
        gamesPlayed: 0,
        totalPoints: 0,
        totalBlocksRemoved: 0,
        correctAnswers: 0,
        incorrectAnswers: 0
      }
    ];
    console.log('MockGameService - Players created:', this.players.length);

    // Create enhanced blocks with complete 54-block system
    console.log('MockGameService - Starting block creation...');
    this.blocks = this.createComplete54BlockSystem();
    console.log('MockGameService - Block creation complete, total blocks:', this.blocks.length);
  }

  private createComplete54BlockSystem(): Block[] {
    console.log('MockGameService - Creating 54-block system...');
    const blocks: Block[] = [];
    let blockId = 1;

    try {
      // Create exactly 54 blocks (18 layers × 3 blocks per layer)
      for (let layer = 1; layer <= 18; layer++) {
        for (let position = 1; position <= 3; position++) {
          try {
            // Determine block type based on layer and position for balanced distribution
            const blockType = this.getBlockTypeForPosition(layer, position);
            console.log(`MockGameService - Creating block ${blockId}: layer=${layer}, position=${position}, type=${blockType}`);
            
            const content = this.getContentForBlock(blockId, blockType, layer);
            
            const block: Block = {
              id: blockId.toString(),
              content,
              removed: false,
              type: blockType,
              difficulty: layer,
              layer,
              position,
              stability: this.calculateStability(layer, blockType),
              category: content.category
            };
            
            blocks.push(block);
            blockId++;
          } catch (error) {
            console.error(`MockGameService - Error creating block ${blockId} at layer ${layer}, position ${position}:`, error);
            // Create a fallback block to prevent the system from breaking
            const fallbackBlock: Block = {
              id: blockId.toString(),
              content: this.getFallbackContent(blockId),
              removed: false,
              type: 'safe',
              difficulty: layer,
              layer,
              position,
              stability: 1.0,
              category: 'general'
            };
            blocks.push(fallbackBlock);
            blockId++;
          }
        }
      }
      
      console.log(`MockGameService - Successfully created ${blocks.length} blocks`);
      console.log('MockGameService - Sample blocks:', blocks.slice(0, 3));
      return blocks;
    } catch (error) {
      console.error('MockGameService - Critical error in block creation:', error);
      // Return minimal fallback blocks to prevent complete failure
      return this.createFallbackBlocks();
    }
  }

  private getBlockTypeForPosition(layer: number, position: number): 'safe' | 'risky' | 'challenge' {
    // Balanced distribution: 18 safe, 18 risky, 18 challenge
    // Layer 1-6: More safe blocks for beginners
    // Layer 7-12: Balanced mix
    // Layer 13-18: More challenging blocks
    
    if (layer <= 6) {
      // First 6 layers: 12 safe, 3 risky, 3 challenge
      if (position === 1 || position === 2) return 'safe';
      if (position === 3) return layer % 2 === 0 ? 'risky' : 'challenge';
    } else if (layer <= 12) {
      // Middle 6 layers: 6 safe, 6 risky, 6 challenge
      if (position === 1) return 'safe';
      if (position === 2) return 'risky';
      if (position === 3) return 'challenge';
    } else {
      // Last 6 layers: 0 safe, 9 risky, 9 challenge
      if (position === 1) return 'risky';
      if (position === 2 || position === 3) return 'challenge';
    }
    
    return 'safe'; // Fallback
  }

  private calculateStability(layer: number, type: string): number {
    let baseStability = 1.0;
    
    // Higher layers are less stable
    baseStability -= (layer - 1) * 0.05;
    
    // Block type affects stability
    switch (type) {
      case 'safe':
        baseStability += 0.15; // Safe blocks are more stable
        break;
      case 'risky':
        baseStability -= 0.25; // Risky blocks are less stable
        break;
      case 'challenge':
        baseStability -= 0.1; // Challenge blocks are moderately stable
        break;
    }
    
    return Math.max(0.1, Math.min(1.0, baseStability));
  }

  private getContentForBlock(id: number, type: string, layer: number): Content {
    try {
      const contentLibrary = this.getCompleteContentLibrary();
      const category = this.getCategoryForLayer(layer);
      
      console.log(`MockGameService - Getting content for block ${id}: type=${type}, layer=${layer}, category=${category}`);
      console.log(`MockGameService - Available categories:`, Object.keys(contentLibrary));
      
      if (!contentLibrary[category as keyof typeof contentLibrary]) {
        console.error(`MockGameService - Category '${category}' not found in content library`);
        return this.getFallbackContent(id);
      }
      
      const categoryContent = contentLibrary[category as keyof typeof contentLibrary];
      if (!Array.isArray(categoryContent) || categoryContent.length === 0) {
        console.error(`MockGameService - Category '${category}' has no content`);
        return this.getFallbackContent(id);
      }
      
      const randomIndex = Math.floor(Math.random() * categoryContent.length);
      const content = categoryContent[randomIndex];
      
      console.log(`MockGameService - Selected content for block ${id}:`, content.title);
      
      return {
        ...content,
        id: id.toString(),
        points: this.calculatePoints(type, layer),
        category: category as 'password' | 'social-media' | 'wifi' | 'data-sharing' | 'encryption' | 'general' | 'phishing' | 'backup',
        fact: content.fact,
        impact: content.impact
      };
    } catch (error) {
      console.error(`MockGameService - Error getting content for block ${id}:`, error);
      return this.getFallbackContent(id);
    }
  }

  private getFallbackContent(id: number): Content {
    return {
      id: id.toString(),
      title: 'Privacy Tip',
      text: 'Stay safe online by using strong passwords and being careful with personal information.',
      severity: 'tip',
      fact: 'Basic privacy practices can prevent most common online threats.',
      impact: 'positive',
      points: 10,
      category: 'general'
    };
  }

  private createFallbackBlocks(): Block[] {
    console.log('MockGameService - Creating fallback blocks due to error');
    const blocks: Block[] = [];
    
    for (let i = 1; i <= 54; i++) {
      blocks.push({
        id: i.toString(),
        content: this.getFallbackContent(i),
        removed: false,
        type: 'safe',
        difficulty: Math.ceil(i / 3),
        layer: Math.ceil(i / 3),
        position: ((i - 1) % 3) + 1,
        stability: 1.0,
        category: 'general'
      });
    }
    
    return blocks;
  }

  private getCategoryForLayer(layer: number): string {
    const categories = ['password', 'social-media', 'wifi', 'data-sharing', 'encryption', 'general', 'phishing', 'backup'];
    
    // Distribute categories across layers
    if (layer <= 3) return categories[0]; // password
    if (layer <= 6) return categories[1]; // social-media
    if (layer <= 9) return categories[2]; // wifi
    if (layer <= 12) return categories[3]; // data-sharing
    if (layer <= 15) return categories[4]; // encryption
    if (layer <= 18) return categories[5]; // general
    
    return categories[0]; // fallback
  }

  private calculatePoints(type: string, layer: number): number {
    let basePoints = 10;
    
    // Layer difficulty multiplier
    const layerMultiplier = 1 + (layer - 1) * 0.2;
    
    switch (type) {
      case 'safe':
        basePoints = 15;
        break;
      case 'risky':
        basePoints = 25;
        break;
      case 'challenge':
        basePoints = 35;
        break;
    }
    
    return Math.round(basePoints * layerMultiplier);
  }

  private getCompleteContentLibrary() {
    return {
      'password': [
        {
          title: 'Strong Password Creation',
          text: 'Use a mix of uppercase, lowercase, numbers, and special characters. Consider using a passphrase instead.',
          severity: 'tip' as const,
          fact: 'Using a passphrase like "correct-horse-battery-staple" is more secure than a complex password like "P@ssw0rd123".',
          impact: 'positive' as const,
          quiz: {
            question: 'What is the minimum recommended length for a strong password?',
            choices: ['6 characters', '8 characters', '12 characters', '16 characters'],
            correctIndex: 2,
            explanation: '12 characters is the minimum recommended length for a strong password.'
          }
        },
        {
          title: 'Password Manager Benefits',
          text: 'Password managers generate and store unique passwords for each account, reducing the risk of reuse.',
          severity: 'tip' as const,
          fact: 'Password managers can generate passwords up to 128 characters long with full complexity.',
          impact: 'positive' as const,
          quiz: {
            question: 'True or False: Using the same password for multiple accounts is safe.',
            choices: ['True', 'False'],
            correctIndex: 1,
            explanation: 'False! Using the same password for multiple accounts is a major security risk.'
          }
        },
        {
          title: 'Password Reuse Dangers',
          text: 'Reusing passwords across multiple accounts creates a security vulnerability.',
          severity: 'critical' as const,
          fact: 'If one account is compromised, hackers can access all accounts using the same password.',
          impact: 'negative' as const,
          quiz: {
            question: 'What happens if you reuse a password and one account gets hacked?',
            choices: ['Nothing', 'Only that account is affected', 'All accounts with that password are at risk', 'You get a warning'],
            correctIndex: 2,
            explanation: 'All accounts using the same password become vulnerable to attack.'
          }
        }
      ],
      'social-media': [
        {
          title: 'Privacy Settings Review',
          text: 'Regularly review and adjust your social media privacy settings to control who sees your content.',
          severity: 'warning' as const,
          fact: 'Facebook has over 50 different privacy settings that control who can see your information.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you review your social media privacy settings?',
            choices: ['Never', 'Once a year', 'Every 6 months', 'Monthly'],
            correctIndex: 2,
            explanation: 'Reviewing privacy settings every 6 months helps maintain control over your data.'
          }
        },
        {
          title: 'Oversharing Personal Information',
          text: 'Avoid posting personal details like addresses, phone numbers, or travel plans.',
          severity: 'critical' as const,
          fact: 'Posting vacation photos while away can alert burglars that your home is empty.',
          impact: 'negative' as const,
          quiz: {
            question: 'What should you avoid posting on social media?',
            choices: ['Food photos', 'Personal address', 'Pet pictures', 'Sunset photos'],
            correctIndex: 1,
            explanation: 'Never post your personal address or location details on social media.'
          }
        },
        {
          title: 'Location Services Awareness',
          text: 'Be aware of location services and geotagging in your social media posts.',
          severity: 'warning' as const,
          fact: 'GPS coordinates in photos can reveal your exact location to strangers.',
          impact: 'negative' as const,
          quiz: {
            question: 'What can happen if you share photos with location data?',
            choices: ['Nothing', 'People can see where you were', 'Photos get better quality', 'You get more likes'],
            correctIndex: 1,
            explanation: 'Location data in photos can reveal your whereabouts to anyone who sees them.'
          }
        }
      ],
      'wifi': [
        {
          title: 'Public WiFi Dangers',
          text: 'Public WiFi networks are often unsecured. Never access sensitive information without a VPN.',
          severity: 'critical' as const,
          fact: 'Hackers can intercept data on public WiFi networks in under 30 seconds.',
          impact: 'negative' as const,
          quiz: {
            question: 'What should you avoid doing on public WiFi?',
            choices: ['Checking email', 'Online banking', 'Social media', 'Reading news'],
            correctIndex: 1,
            explanation: 'Online banking on public WiFi can expose your financial information to hackers.'
          }
        },
        {
          title: 'VPN Protection',
          text: 'Use a Virtual Private Network (VPN) to encrypt your internet connection and protect your data.',
          severity: 'tip' as const,
          fact: 'VPNs encrypt all your internet traffic, making it unreadable to hackers.',
          impact: 'positive' as const,
          quiz: {
            question: 'What does a VPN do for your internet connection?',
            choices: ['Makes it faster', 'Encrypts your data', 'Saves money', 'Changes your location'],
            correctIndex: 1,
            explanation: 'VPNs encrypt your data to protect it from interception.'
          }
        },
        {
          title: 'Home WiFi Security',
          text: 'Secure your home WiFi with a strong password and WPA3 encryption if available.',
          severity: 'tip' as const,
          fact: 'WPA3 encryption is 100 times more secure than the older WPA2 standard.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is the most secure WiFi encryption standard?',
            choices: ['WEP', 'WPA', 'WPA2', 'WPA3'],
            correctIndex: 3,
            explanation: 'WPA3 is the latest and most secure WiFi encryption standard.'
          }
        }
      ],
      'data-sharing': [
        {
          title: 'Data Minimization',
          text: 'Only share the minimum amount of personal information necessary for a service to function.',
          severity: 'warning' as const,
          fact: 'Companies often collect more data than they need to provide their services.',
          impact: 'positive' as const,
          quiz: {
            question: 'When asked for personal information, what should you do first?',
            choices: ['Provide everything requested', 'Ask why it\'s needed', 'Refuse to provide any', 'Give fake information'],
            correctIndex: 1,
            explanation: 'Always ask why personal information is needed before providing it.'
          }
        },
        {
          title: 'Third-Party App Permissions',
          text: 'Review and limit permissions granted to third-party apps and services.',
          severity: 'warning' as const,
          fact: 'Many apps request access to contacts, location, and camera even when not needed.',
          impact: 'negative' as const,
          quiz: {
            question: 'What should you do when an app asks for unnecessary permissions?',
            choices: ['Grant all permissions', 'Deny unnecessary ones', 'Delete the app', 'Ignore the request'],
            correctIndex: 1,
            explanation: 'Only grant permissions that are essential for the app to function.'
          }
        },
        {
          title: 'Data Broker Awareness',
          text: 'Be aware that your personal information may be sold by data brokers to advertisers.',
          severity: 'critical' as const,
          fact: 'Data brokers can collect up to 1,500 data points about each person.',
          impact: 'negative' as const,
          quiz: {
            question: 'What do data brokers do with your personal information?',
            choices: ['Keep it private', 'Sell it to advertisers', 'Delete it', 'Give it to you'],
            correctIndex: 1,
            explanation: 'Data brokers collect and sell personal information to advertisers and other companies.'
          }
        }
      ],
      'encryption': [
        {
          title: 'End-to-End Encryption',
          text: 'Use messaging apps with end-to-end encryption to ensure only you and the recipient can read messages.',
          severity: 'tip' as const,
          fact: 'End-to-end encryption means even the app company cannot read your messages.',
          impact: 'positive' as const,
          quiz: {
            question: 'What does end-to-end encryption protect?',
            choices: ['Only the sender', 'Only the recipient', 'Both sender and recipient', 'No one'],
            correctIndex: 2,
            explanation: 'End-to-end encryption protects both the sender and recipient from unauthorized access.'
          }
        },
        {
          title: 'File Encryption',
          text: 'Encrypt sensitive files on your devices to protect them if your device is lost or stolen.',
          severity: 'tip' as const,
          fact: 'File encryption can protect your data even if someone gains physical access to your device.',
          impact: 'positive' as const,
          quiz: {
            question: 'What happens to encrypted files if your device is stolen?',
            choices: ['They become readable', 'They remain protected', 'They get deleted', 'They get corrupted'],
            correctIndex: 1,
            explanation: 'Encrypted files remain protected even if someone gains access to your device.'
          }
        },
        {
          title: 'Encryption Key Management',
          text: 'Safely store and backup your encryption keys. Losing them means losing access to your data.',
          severity: 'warning' as const,
          fact: 'There is no way to recover encrypted data without the encryption key.',
          impact: 'negative' as const,
          quiz: {
            question: 'What happens if you lose your encryption key?',
            choices: ['You can recover it', 'Your data is lost forever', 'You get a new one', 'Nothing happens'],
            correctIndex: 1,
            explanation: 'Without the encryption key, encrypted data cannot be recovered.'
          }
        }
      ],
      'general': [
        {
          title: 'Two-Factor Authentication',
          text: 'Enable 2FA on all your accounts for an extra layer of security beyond passwords.',
          severity: 'critical' as const,
          fact: '2FA can prevent 99.9% of automated attacks on your accounts.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is the most secure form of two-factor authentication?',
            choices: ['SMS codes', 'Email codes', 'Authenticator apps', 'Security questions'],
            correctIndex: 2,
            explanation: 'Authenticator apps are more secure than SMS or email codes.'
          }
        },
        {
          title: 'Software Updates',
          text: 'Keep your software and operating systems updated to patch security vulnerabilities.',
          severity: 'warning' as const,
          fact: '90% of successful cyber attacks exploit known vulnerabilities that have patches available.',
          impact: 'positive' as const,
          quiz: {
            question: 'Why are software updates important for security?',
            choices: ['They make apps faster', 'They patch security holes', 'They add new features', 'They save storage'],
            correctIndex: 1,
            explanation: 'Software updates fix security vulnerabilities that hackers could exploit.'
          }
        },
        {
          title: 'Backup Security',
          text: 'Regularly backup your important data and ensure backups are also encrypted and secure.',
          severity: 'tip' as const,
          fact: 'The 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite location.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is the 3-2-1 backup rule?',
            choices: ['3 backups, 2 locations, 1 password', '3 copies, 2 media types, 1 offsite', '3 days, 2 weeks, 1 month', '3 files, 2 folders, 1 drive'],
            correctIndex: 1,
            explanation: '3 copies, 2 different media types, 1 offsite location for maximum data protection.'
          }
        }
      ],
      'phishing': [
        {
          title: 'Phishing Email Recognition',
          text: 'Learn to recognize phishing emails by checking sender addresses and avoiding suspicious links.',
          severity: 'critical' as const,
          fact: 'Phishing attacks increased by 600% during the COVID-19 pandemic.',
          impact: 'negative' as const,
          quiz: {
            question: 'What is a common sign of a phishing email?',
            choices: ['Professional formatting', 'Urgent action required', 'Clear sender address', 'Proper grammar'],
            correctIndex: 1,
            explanation: 'Phishing emails often create urgency to pressure you into acting quickly.'
          }
        },
        {
          title: 'Suspicious Link Detection',
          text: 'Hover over links before clicking to see the actual destination URL.',
          severity: 'warning' as const,
          fact: 'Phishing links often look legitimate but redirect to fake websites.',
          impact: 'positive' as const,
          quiz: {
            question: 'What should you do before clicking a link in an email?',
            choices: ['Click immediately', 'Hover to see the URL', 'Forward to friends', 'Delete the email'],
            correctIndex: 1,
            explanation: 'Hovering over links reveals the actual destination URL.'
          }
        },
        {
          title: 'Social Engineering Awareness',
          text: 'Be aware of social engineering tactics that manipulate people into revealing sensitive information.',
          severity: 'warning' as const,
          fact: 'Social engineering attacks rely on human psychology rather than technical vulnerabilities.',
          impact: 'negative' as const,
          quiz: {
            question: 'What do social engineering attacks target?',
            choices: ['Computer systems', 'Human psychology', 'Network security', 'Software bugs'],
            correctIndex: 1,
            explanation: 'Social engineering attacks manipulate human psychology to gain access to information.'
          }
        }
      ],
      'backup': [
        {
          title: 'Cloud Backup Security',
          text: 'Use encrypted cloud backup services and enable two-factor authentication on backup accounts.',
          severity: 'tip' as const,
          fact: 'Cloud backups can protect your data from ransomware attacks and hardware failures.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is an advantage of cloud backups?',
            choices: ['They are always free', 'They protect from ransomware', 'They are faster than local', 'They use less space'],
            correctIndex: 1,
            explanation: 'Cloud backups can protect your data from ransomware attacks and hardware failures.'
          }
        },
        {
          title: 'Local Backup Encryption',
          text: 'Encrypt your local backups to protect sensitive data if backup drives are lost or stolen.',
          severity: 'warning' as const,
          fact: 'Unencrypted backups can expose all your data if the backup device is compromised.',
          impact: 'positive' as const,
          quiz: {
            question: 'Why should you encrypt local backups?',
            choices: ['To save space', 'To protect data if lost', 'To make them faster', 'To organize them'],
            correctIndex: 1,
            explanation: 'Encryption protects your backup data if the backup device is lost or stolen.'
          }
        },
        {
          title: 'Backup Testing',
          text: 'Regularly test your backups to ensure you can actually restore your data when needed.',
          severity: 'tip' as const,
          fact: 'Many people discover their backups are corrupted only when trying to restore data.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you test your backups?',
            choices: ['Never', 'Once a year', 'Every 6 months', 'Monthly'],
            correctIndex: 2,
            explanation: 'Testing backups every 6 months ensures they work when you need them.'
          }
        }
      ]
    };
  }

  private initializeAchievements() {
    this.achievements = [
      {
        id: 'first_block',
        name: 'First Steps',
        description: 'Remove your first block',
        icon: '🎯',
        unlockedAt: new Date(),
        points: 10
      },
      {
        id: 'privacy_pro',
        name: 'Privacy Pro',
        description: 'Answer 5 quiz questions correctly',
        icon: '🛡️',
        unlockedAt: new Date(),
        points: 50
      },
      {
        id: 'tower_master',
        name: 'Tower Master',
        description: 'Remove 20 blocks without the tower falling',
        icon: '🏗️',
        unlockedAt: new Date(),
        points: 100
      },
      {
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Score 500 points in a single game',
        icon: '🏆',
        unlockedAt: new Date(),
        points: 200
      },
      {
        id: 'layer_explorer',
        name: 'Layer Explorer',
        description: 'Remove blocks from 10 different layers',
        icon: '🔍',
        unlockedAt: new Date(),
        points: 150
      },
      {
        id: 'quiz_champion',
        name: 'Quiz Champion',
        description: 'Answer 10 challenge blocks correctly',
        icon: '🧠',
        unlockedAt: new Date(),
        points: 300
      }
    ];
  }

  private initializeSpecialActions() {
    this.specialActions = [
      {
        id: 'swap_blocks',
        name: 'Block Swap',
        description: 'Swap two blocks in the same layer',
        cost: 50,
        effect: 'Rearrange tower for better stability',
        available: true
      },
      {
        id: 'skip_turn',
        name: 'Skip Turn',
        description: 'Skip your turn to regain stability',
        cost: 25,
        effect: 'Tower becomes more stable',
        available: true
      },
      {
        id: 'double_pull',
        name: 'Double Pull',
        description: 'Remove two blocks in one turn',
        cost: 100,
        effect: 'Double points but higher risk',
        available: true
      }
    ];
  }

  // Enhanced API methods
  async createRoom(): Promise<MockRoom> {
    const newRoom: MockRoom = {
      id: Date.now().toString(),
      code: Math.random().toString(36).substr(2, 6).toUpperCase(),
      players: ['Player1'],
      status: 'waiting',
      currentTurn: 0,
      blocks: []
    };
    this.rooms.push(newRoom);
    this.currentRoom = newRoom;
    return newRoom;
  }

  async joinRoom(code: string): Promise<MockRoom | null> {
    const room = this.rooms.find(r => r.code === code);
    if (room && room.status === 'waiting') {
      room.players.push('Player2');
      this.currentRoom = room;
      return room;
    }
    return null;
  }

  async startGame(): Promise<boolean> {
    console.log('MockGameService - startGame called, currentRoom:', this.currentRoom);
    if (this.currentRoom) {
      this.currentRoom.status = 'playing';
      this.initializeGameState();
      console.log('MockGameService - Game started, gameState:', this.gameState);
      return true;
    }
    console.log('MockGameService - No current room, cannot start game');
    return false;
  }

  private initializeGameState() {
    console.log('MockGameService - initializeGameState called');
    const currentPlayer = this.players[0]; // For single player
    console.log('MockGameService - Current player:', currentPlayer);
    console.log('MockGameService - Total blocks available:', this.blocks.length);
    
    this.gameState = {
      currentPlayer: {
        nickname: currentPlayer.nickname,
        isHost: true,
        score: currentPlayer.score,
        achievements: currentPlayer.achievements,
        highScore: currentPlayer.highScore,
        gamesPlayed: currentPlayer.gamesPlayed,
        totalPoints: currentPlayer.totalPoints,
        totalBlocksRemoved: currentPlayer.totalBlocksRemoved,
        correctAnswers: currentPlayer.correctAnswers,
        incorrectAnswers: currentPlayer.incorrectAnswers
      },
      towerHeight: 18, // 18 layers
      blocksRemoved: 0,
      totalBlocks: 54, // Exactly 54 blocks
      currentScore: 0,
      gameMode: 'classic',
      difficulty: 1,
      diceResult: 0,
      canPullFromLayers: [1, 2, 3, 4, 5, 6], // Start with bottom 6 layers
      specialActions: this.specialActions,
      gameHistory: [],
      layerStats: this.calculateLayerStats(),
      blockTypeStats: this.calculateBlockTypeStats()
    };
    
    console.log('MockGameService - Game state initialized:', this.gameState);
  }

  private calculateLayerStats(): LayerStats[] {
    const stats: LayerStats[] = [];
    
    for (let layer = 1; layer <= 18; layer++) {
      const layerBlocks = this.blocks.filter(b => b.layer === layer);
      const removedBlocks = layerBlocks.filter(b => b.removed);
      
      stats.push({
        layer,
        safeBlocks: layerBlocks.filter(b => b.type === 'safe').length,
        riskyBlocks: layerBlocks.filter(b => b.type === 'risky').length,
        challengeBlocks: layerBlocks.filter(b => b.type === 'challenge').length,
        totalBlocks: layerBlocks.length,
        removedBlocks: removedBlocks.length
      });
    }
    
    return stats;
  }

  private calculateBlockTypeStats(): BlockTypeStats {
    const allBlocks = this.blocks;
    const removedBlocks = allBlocks.filter(b => b.removed);
    
    return {
      safe: {
        total: allBlocks.filter(b => b.type === 'safe').length,
        removed: removedBlocks.filter(b => b.type === 'safe').length,
        points: removedBlocks.filter(b => b.type === 'safe').reduce((sum, b) => sum + b.content.points, 0)
      },
      risky: {
        total: allBlocks.filter(b => b.type === 'risky').length,
        removed: removedBlocks.filter(b => b.type === 'risky').length,
        points: removedBlocks.filter(b => b.type === 'risky').reduce((sum, b) => sum + b.content.points, 0)
      },
      challenge: {
        total: allBlocks.filter(b => b.type === 'challenge').length,
        removed: removedBlocks.filter(b => b.type === 'challenge').length,
        points: removedBlocks.filter(b => b.type === 'challenge').reduce((sum, b) => sum + b.content.points, 0),
        correct: this.gameState?.gameHistory.filter(move => move.quizCorrect).length || 0,
        incorrect: this.gameState?.gameHistory.filter(move => move.quizAnswered && !move.quizCorrect).length || 0
      }
    };
  }

  async pickBlock(blockId: string): Promise<{ content: Content; gameState: GameState } | null> {
    const block = this.blocks.find(b => b.id === blockId && !b.removed);
    if (block && this.gameState) {
      // Check if block can be removed based on dice restrictions
      if (!this.gameState.canPullFromLayers.includes(block.layer)) {
        throw new Error(`Cannot remove block from layer ${block.layer}. Available layers: ${this.gameState.canPullFromLayers.join(', ')}`);
      }

      block.removed = true;
      block.removedBy = 'currentPlayer';

      // Update game state
      this.gameState.blocksRemoved++;
      this.gameState.towerHeight = Math.max(1, 18 - Math.floor(this.gameState.blocksRemoved / 3));
      this.gameState.currentScore += block.content.points;
      
      // Update player stats
      this.gameState.currentPlayer.totalBlocksRemoved++;
      this.gameState.currentPlayer.totalPoints += block.content.points;

      // Record move
      const move: GameMove = {
        id: Date.now().toString(),
        playerId: this.gameState.currentPlayer.nickname,
        blockId: block.id,
        blockType: block.type,
        layer: block.layer,
        points: block.content.points,
        stability: block.stability,
        timestamp: new Date(),
        content: block.content
      };
      this.gameState.gameHistory.push(move);

      // Update stats
      this.gameState.layerStats = this.calculateLayerStats();
      this.gameState.blockTypeStats = this.calculateBlockTypeStats();

      // Check for achievements
      this.checkAchievements();

      return { 
        content: block.content, 
        gameState: this.gameState 
      };
    }
    return null;
  }

  private checkAchievements() {
    if (!this.gameState) return;

    const player = this.gameState.currentPlayer;
    
    // First block achievement
    if (this.gameState.blocksRemoved === 1) {
      this.unlockAchievement('first_block', player);
    }

    // Privacy Pro achievement
    if (player.correctAnswers >= 5) {
      this.unlockAchievement('privacy_pro', player);
    }

    // Tower Master achievement
    if (this.gameState.blocksRemoved >= 20) {
      this.unlockAchievement('tower_master', player);
    }

    // High Scorer achievement
    if (this.gameState.currentScore >= 500) {
      this.unlockAchievement('high_scorer', player);
    }

    // Layer Explorer achievement
    const uniqueLayers = new Set(this.gameState.gameHistory.map(move => move.layer)).size;
    if (uniqueLayers >= 10) {
      this.unlockAchievement('layer_explorer', player);
    }

    // Quiz Champion achievement
    if (player.correctAnswers >= 10) {
      this.unlockAchievement('quiz_champion', player);
    }
  }

  private unlockAchievement(achievementId: string, player: Player) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (achievement && !player.achievements.find(a => a.id === achievementId)) {
      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date()
      };
      player.achievements.push(unlockedAchievement);
      player.score += achievement.points;
      
      // Also update the corresponding MockPlayer for consistency
      const mockPlayer = this.players.find(p => p.nickname === player.nickname);
      if (mockPlayer) {
        mockPlayer.achievements.push(unlockedAchievement);
        mockPlayer.score += achievement.points;
      }
    }
  }

  async rollDice(): Promise<DiceResult> {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const result = this.getDiceResult(diceValue);
    
    if (this.gameState) {
      this.gameState.diceResult = diceValue;
      this.gameState.canPullFromLayers = result.layerRestrictions;
    }
    
    return result;
  }

  private getDiceResult(value: number): DiceResult {
    const diceResults: { [key: number]: DiceResult } = {
      1: {
        value: 1,
        effect: 'Safe Zone - Only bottom 3 layers',
        layerRestrictions: [1, 2, 3],
        bonusMultiplier: 1.0
      },
      2: {
        value: 2,
        effect: 'Steady - Bottom 6 layers',
        layerRestrictions: [1, 2, 3, 4, 5, 6],
        bonusMultiplier: 1.2
      },
      3: {
        value: 3,
        effect: 'Risky - Bottom 9 layers',
        layerRestrictions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        bonusMultiplier: 1.5
      },
      4: {
        value: 4,
        effect: 'Danger Zone - Bottom 12 layers',
        layerRestrictions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bonusMultiplier: 2.0
      },
      5: {
        value: 5,
        effect: 'Extreme - Bottom 15 layers',
        layerRestrictions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        bonusMultiplier: 2.5
      },
      6: {
        value: 6,
        effect: 'Ultimate Challenge - All layers',
        layerRestrictions: Array.from({length: 18}, (_, i) => i + 1),
        bonusMultiplier: 3.0,
        specialEvent: 'Double points for this turn!'
      }
    };

    return diceResults[value];
  }

  async answerQuiz(blockId: string, selectedAnswer: number): Promise<{ correct: boolean; points: number; gameState: GameState }> {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block || !this.gameState) {
      throw new Error('Block or game state not found');
    }

    const isCorrect = selectedAnswer === block.content.quiz?.correctIndex;
    let points = 0;

    if (isCorrect) {
      points = block.content.points * 2; // Double points for correct answer
      this.gameState.currentScore += points;
      this.gameState.currentPlayer.correctAnswers++;
      this.gameState.currentPlayer.totalPoints += points;
    } else {
      points = -block.content.points / 2; // Penalty for wrong answer
      this.gameState.currentScore = Math.max(0, this.gameState.currentScore + points);
      this.gameState.currentPlayer.incorrectAnswers++;
    }

    // Update the move in game history
    const move = this.gameState.gameHistory.find(m => m.blockId === blockId);
    if (move) {
      move.quizAnswered = true;
      move.quizCorrect = isCorrect;
    }

    // Update stats
    this.gameState.blockTypeStats = this.calculateBlockTypeStats();

    return {
      correct: isCorrect,
      points,
      gameState: this.gameState
    };
  }

  async useSpecialAction(actionId: string): Promise<{ success: boolean; gameState: GameState }> {
    if (!this.gameState) {
      throw new Error('Game not started');
    }

    const action = this.specialActions.find(a => a.id === actionId);
    if (!action || !action.available) {
      return { success: false, gameState: this.gameState };
    }

    if (this.gameState.currentScore < action.cost) {
      return { success: false, gameState: this.gameState };
    }

    // Apply action effect
    this.gameState.currentScore -= action.cost;
    
    switch (actionId) {
      case 'swap_blocks':
        // Implement block swapping logic
        break;
      case 'skip_turn':
        // Implement turn skipping logic
        break;
      case 'double_pull':
        // Implement double pull logic
        break;
    }

    return { success: true, gameState: this.gameState };
  }

  // Test method to verify service is working
  testService(): { blocks: number; players: number; gameState: boolean } {
    console.log('MockGameService - testService called');
    return {
      blocks: this.blocks.length,
      players: this.players.length,
      gameState: !!this.gameState
    };
  }

  getCurrentRoom(): MockRoom | null {
    return this.currentRoom;
  }

  getBlocks(): Block[] {
    console.log('MockGameService - getBlocks called, returning', this.blocks.length, 'blocks');
    console.log('MockGameService - First few blocks:', this.blocks.slice(0, 3));
    return this.blocks;
  }

  getPlayers(): MockPlayer[] {
    return this.players;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getSpecialActions(): SpecialAction[] {
    return this.specialActions;
  }

  // Endless mode support
  async startEndlessMode(): Promise<void> {
    this.initializeGameState();
    if (this.gameState) {
      this.gameState.gameMode = 'endless';
    }
  }

  async resetGame(): Promise<void> {
    // Reset all blocks
    this.blocks.forEach(block => {
      block.removed = false;
      block.removedBy = undefined;
    });

    // Create new random blocks
    this.blocks = this.createComplete54BlockSystem();

    // Reset game state but keep score
    if (this.gameState) {
      const currentScore = this.gameState.currentScore;
      this.initializeGameState();
      if (this.gameState) {
        this.gameState.currentScore = currentScore;
        this.gameState.gameMode = 'classic';
      }
    }
  }

  async resetTower(): Promise<void> {
    // Reset all blocks
    this.blocks.forEach(block => {
      block.removed = false;
      block.removedBy = undefined;
    });

    // Create new random blocks
    this.blocks = this.createComplete54BlockSystem();

    // Reset game state but keep score
    if (this.gameState) {
      const currentScore = this.gameState.currentScore;
      this.initializeGameState();
      if (this.gameState) {
        this.gameState.currentScore = currentScore;
        this.gameState.gameMode = 'endless';
      }
    }
  }

  // Save/load game state
  saveGameState(): void {
    if (this.gameState) {
      localStorage.setItem('privacyJenga_gameState', JSON.stringify(this.gameState));
      localStorage.setItem('privacyJenga_highScore', this.gameState.currentPlayer.highScore.toString());
    }
  }

  loadGameState(): void {
    const savedState = localStorage.getItem('privacyJenga_gameState');
    const highScore = localStorage.getItem('privacyJenga_highScore');
    
    if (savedState) {
      try {
        this.gameState = JSON.parse(savedState);
        if (highScore) {
          this.gameState!.currentPlayer.highScore = parseInt(highScore);
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }
}

export const mockGameService = new MockGameService();
