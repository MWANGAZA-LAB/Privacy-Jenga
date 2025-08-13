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
    console.log('MockGameService constructor called');
    this.initializeMockData();
    this.initializeAchievements();
    this.initializeSpecialActions();
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
    // Comprehensive privacy education tips - 54 unique prompts
    const tips = {
      'on-chain-privacy': [
        'Never reuse Bitcoin addresses - each transaction should use a new address to prevent address clustering.',
        'Be aware that transaction amounts are publicly visible on the blockchain - consider using CoinJoin for large amounts.',
        'Change addresses in transactions can reveal your spending patterns - use wallets that generate new change addresses.',
        'Transaction timing can reveal your location and habits - vary the timing of your transactions.',
        'Multiple inputs to a transaction can link different addresses to the same user - consolidate carefully.',
        'Public transaction memos can reveal sensitive information - avoid adding personal notes to transactions.',
        'Address reuse makes it easier for surveillance companies to track your entire financial history.',
        'Large transactions attract more attention - consider breaking them into smaller, less noticeable amounts.',
        'Using the same address for receiving multiple payments creates a clear spending pattern.',
        'Change address reuse can reveal your total balance and spending habits to observers.',
        'Transaction fees can reveal your urgency and potentially your location based on fee market conditions.',
        'Public key reuse in different contexts can link your various online identities together.',
        'Address clustering algorithms can group addresses that likely belong to the same user.',
        'Timing analysis of transactions can reveal your daily routines and travel patterns.',
        'UTXO consolidation can create a clear picture of your total holdings and spending patterns.'
      ],
      'off-chain-practices': [
        'Use a VPN when broadcasting transactions to prevent IP address correlation with your Bitcoin addresses.',
        'Operate different wallets for different purposes - never mix personal and business funds.',
        'Use Tor or other privacy networks when accessing Bitcoin services to hide your location.',
        'Avoid using the same device for both your Bitcoin wallet and social media accounts.',
        'Use different email addresses for different Bitcoin services to prevent cross-service tracking.',
        'Consider using a dedicated device for Bitcoin transactions to avoid browser fingerprinting.',
        'Use cash or privacy-focused payment methods to acquire Bitcoin when possible.',
        'Avoid sharing your Bitcoin addresses on public social media platforms.',
        'Use different usernames across Bitcoin services to prevent identity correlation.',
        'Consider the privacy implications of using centralized exchanges for Bitcoin transactions.'
      ],
      'coin-mixing': [
        'CoinJoin combines multiple users\' transactions to break the link between inputs and outputs.',
        'CoinJoin effectiveness depends on the number of participants - larger groups provide better privacy.',
        'Regular CoinJoin usage makes it harder for surveillance to distinguish your transactions from others.',
        'CoinJoin transactions may have higher fees but provide significant privacy benefits.',
        'Using CoinJoin regularly creates a consistent privacy pattern that\'s harder to analyze.',
        'CoinJoin can be combined with other privacy techniques for enhanced protection.',
        'The effectiveness of CoinJoin decreases if you frequently consolidate mixed coins.',
        'CoinJoin participants should avoid revealing their participation to maintain privacy.',
        'Regular CoinJoin usage makes it harder for blockchain analysis companies to track your funds.',
        'CoinJoin is most effective when used as part of a broader privacy strategy.'
      ],
      'wallet-setup': [
        'Use hierarchical deterministic (HD) wallets to generate unlimited addresses from a single seed phrase.',
        'Store your seed phrase offline in multiple secure locations - never store it digitally.',
        'Consider using a hardware wallet for large amounts to protect against malware and theft.',
        'Use different wallets for different purposes to prevent address correlation.',
        'Regularly rotate your wallet addresses to maintain privacy and security.'
      ],
      'lightning-network': [
        'Lightning Network channels can provide near-instant, low-fee transactions with enhanced privacy.',
        'Channel routing can reveal some information about your network position and connections.',
        'Opening and closing channels are on-chain transactions that can be analyzed for patterns.',
        'Lightning payments are not directly visible on the blockchain, providing transaction privacy.',
        'Channel capacity and routing patterns can reveal information about your Lightning usage.'
      ],
      'regulatory': [
        'KYC/AML requirements at exchanges can create permanent records linking your identity to Bitcoin addresses.',
        'Public records and subpoenas can force disclosure of your Bitcoin holdings and transactions.',
        'Tax reporting requirements may force you to reveal your Bitcoin transaction history.',
        'Regulatory compliance can conflict with privacy goals - understand the trade-offs involved.',
        'Legal requirements vary by jurisdiction - understand the privacy implications in your area.'
      ],
      'best-practices': [
        'Use Tor or other privacy networks when accessing Bitcoin services to hide your location.',
        'Consider using multisig wallets for enhanced security and privacy.',
        'Split large amounts across multiple addresses to avoid creating obvious large holdings.',
        'Regularly review and update your privacy practices as new threats and solutions emerge.'
      ]
    };

    const categoryTips = tips[category as keyof typeof tips] || tips['best-practices'];
    // Use blockId to get unique tip for each block
    const tipIndex = (blockId - 1) % categoryTips.length;
    return categoryTips[tipIndex];
  }

  private getQuizForBlock(blockId: number, category: string): any {
    // Enhanced quizzes for each category with more variety
    const quizzes = {
      'on-chain-privacy': [
        {
          question: 'What is address clustering and why is it a concern?',
          choices: ['It\'s a common feature of Bitcoin wallets', 'It makes it easier for users to consolidate UTXOs', 'It reveals your total balance and spending habits', 'It\'s a feature of all blockchain networks'],
          correctIndex: 2,
          explanation: 'Address clustering makes it easier for surveillance companies to track your entire financial history by grouping addresses that likely belong to the same user.'
        },
        {
          question: 'How can transaction amounts reveal your location?',
          choices: ['Blockchain explorers show transaction details', 'Transaction fees can indicate your location', 'Transaction timing is always random', 'All of the above'],
          correctIndex: 1,
          explanation: 'Transaction fees can reveal your urgency and potentially your location based on fee market conditions.'
        },
        {
          question: 'What is the purpose of change addresses in transactions?',
          choices: ['To obfuscate the true source of funds', 'To make transactions look more legitimate', 'To prevent address reuse', 'To increase transaction size'],
          correctIndex: 2,
          explanation: 'Change addresses make it harder for surveillance to track your entire financial history by using new addresses for each transaction.'
        },
        {
          question: 'How can public transaction memos be used to reveal sensitive information?',
          choices: ['They are always encrypted', 'They can be used to add personal notes', 'They are visible to everyone', 'They are only visible to the sender and receiver'],
          correctIndex: 1,
          explanation: 'Public transaction memos can reveal sensitive information if they contain personal notes or sensitive data.'
        },
        {
          question: 'What is the most effective way to prevent address reuse?',
          choices: ['Always use new addresses', 'Change addresses only when necessary', 'Use the same address for all transactions', 'Never reuse addresses'],
          correctIndex: 0,
          explanation: 'Never reusing addresses is the most effective way to prevent address reuse.'
        }
      ],
      'off-chain-practices': [
        {
          question: 'Which of the following is the most effective way to hide your Bitcoin address on social media?',
          choices: ['Use a pseudonym', 'Never share your address', 'Use a different address for each post', 'Share your address openly'],
          correctIndex: 1,
          explanation: 'Never sharing your address is the most effective way to hide it on social media.'
        },
        {
          question: 'What is operational security (OPSEC)?',
          choices: ['It\'s a type of encryption', 'It\'s the practice of securing your digital devices', 'It\'s a type of wallet', 'It\'s a type of coin'],
          correctIndex: 1,
          explanation: 'Operational security is the practice of securing your digital devices and online accounts.'
        },
        {
          question: 'Why is it important to use different wallets for different purposes?',
          choices: ['To prevent address correlation', 'To manage multiple accounts', 'To increase transaction fees', 'To make transactions faster'],
          correctIndex: 0,
          explanation: 'Using different wallets for different purposes prevents address correlation and makes it harder for surveillance to track your entire financial history.'
        },
        {
          question: 'What is the best way to acquire Bitcoin without revealing your address?',
          choices: ['Use a centralized exchange', 'Use a privacy-focused wallet', 'Use a cash payment method', 'Share your address openly'],
          correctIndex: 2,
          explanation: 'Using a privacy-focused wallet and cash payment methods is the most effective way to acquire Bitcoin without revealing your address.'
        },
        {
          question: 'Why is it important to use different email addresses for different services?',
          choices: ['To prevent cross-service tracking', 'To increase transaction fees', 'To make transactions faster', 'To manage multiple accounts'],
          correctIndex: 0,
          explanation: 'Using different email addresses for different services prevents cross-service tracking and makes it harder for surveillance to link your various online identities.'
        }
      ],
      'coin-mixing': [
        {
          question: 'What is CoinJoin and how does it work?',
          choices: ['It\'s a type of encryption', 'It\'s a privacy-focused wallet', 'It combines multiple users\' transactions to break input-output links', 'It\'s a type of coin'],
          correctIndex: 2,
          explanation: 'CoinJoin combines multiple users\' transactions to break the link between inputs and outputs.'
        },
        {
          question: 'How does the number of CoinJoin participants affect privacy?',
          choices: ['More participants = better privacy', 'Fewer participants = better privacy', 'It doesn\'t matter', 'More participants = worse privacy'],
          correctIndex: 0,
          explanation: 'Larger groups of participants provide better privacy through the combined efforts of multiple users.'
        },
        {
          question: 'What is the main benefit of regular CoinJoin usage?',
          choices: ['It makes transactions look more legitimate', 'It reduces fees', 'It creates consistent privacy patterns', 'It increases transaction speed'],
          correctIndex: 2,
          explanation: 'Regular CoinJoin usage creates a consistent privacy pattern that\'s harder to analyze.'
        },
        {
          question: 'How does CoinJoin affect the effectiveness of other privacy techniques?',
          choices: ['It makes other techniques less effective', 'It enhances the effectiveness of other techniques', 'It has no effect', 'It replaces other techniques'],
          correctIndex: 1,
          explanation: 'CoinJoin can be combined with other privacy techniques for enhanced protection.'
        },
        {
          question: 'What is the main drawback of frequent CoinJoin consolidation?',
          choices: ['It makes transactions look suspicious', 'It reduces privacy benefits', 'It increases fees', 'It slows down transactions'],
          correctIndex: 1,
          explanation: 'Frequent consolidation of mixed coins reduces the privacy benefits of CoinJoin.'
        }
      ],
      'wallet-setup': [
        {
          question: 'What is a seed phrase and why is it important?',
          choices: ['It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin', 'It\'s a type of transaction'],
          correctIndex: 1,
          explanation: 'A seed phrase is a set of words that can be used to restore your wallet, making it crucial for wallet security.'
        },
        {
          question: 'How should you store your seed phrase?',
          choices: ['Write it down on a piece of paper', 'Store it digitally', 'Memorize it', 'Share it with a friend'],
          correctIndex: 0,
          explanation: 'You should write down your seed phrase on a piece of paper and store it in multiple secure locations.'
        },
        {
          question: 'What is a hardware wallet and why is it recommended?',
          choices: ['It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin', 'It\'s a type of transaction'],
          correctIndex: 1,
          explanation: 'A hardware wallet is a physical device that stores your private keys securely, making it highly recommended for large amounts.'
        },
        {
          question: 'Why is it important to rotate your wallet addresses?',
          choices: ['To prevent address correlation', 'To increase transaction fees', 'To make transactions faster', 'To manage multiple accounts'],
          correctIndex: 0,
          explanation: 'Regularly rotating your wallet addresses is crucial for maintaining privacy and security.'
        }
      ],
      'lightning-network': [
        {
          question: 'What is the main advantage of the Lightning Network?',
          choices: ['It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin', 'It\'s a type of transaction'],
          correctIndex: 3,
          explanation: 'The Lightning Network provides near-instant, low-fee transactions with enhanced privacy.'
        },
        {
          question: 'How does channel routing reveal information?',
          choices: ['It reveals your network position and connections', 'It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin'],
          correctIndex: 0,
          explanation: 'Channel routing can reveal some information about your network position and connections.'
        },
        {
          question: 'What is the purpose of opening and closing channels?',
          choices: ['To increase transaction fees', 'To provide transaction privacy', 'To make transactions faster', 'To manage multiple accounts'],
          correctIndex: 1,
          explanation: 'Opening and closing channels are on-chain transactions that can be analyzed for patterns.'
        },
        {
          question: 'How does Lightning payment privacy compare to Bitcoin blockchain privacy?',
          choices: ['It\'s more private', 'It\'s less private', 'It\'s the same', 'It\'s a type of encryption'],
          correctIndex: 0,
          explanation: 'Lightning payments are not directly visible on the blockchain, providing transaction privacy.'
        }
      ],
      'regulatory': [
        {
          question: 'What are KYC/AML requirements and why are they controversial?',
          choices: ['They are a type of encryption', 'They are a type of wallet', 'They are a type of coin', 'They are a type of transaction'],
          correctIndex: 1,
          explanation: 'KYC/AML requirements are mandatory identification and verification processes for cryptocurrency exchanges, which can create permanent records linking your identity to Bitcoin addresses.'
        },
        {
          question: 'How can public records and subpoenas force disclosure of your Bitcoin holdings?',
          choices: ['They can force exchanges to reveal your identity', 'They can force you to reveal your private keys', 'They can force you to pay taxes', 'They can force you to delete your wallet'],
          correctIndex: 0,
          explanation: 'Public records and subpoenas can force exchanges to reveal your identity, which can then be linked to your Bitcoin addresses.'
        },
        {
          question: 'What is tax reporting and why is it important?',
          choices: ['It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin', 'It\'s a type of transaction'],
          correctIndex: 2,
          explanation: 'Tax reporting requirements may force you to reveal your Bitcoin transaction history, which can then be linked to your identity.'
        },
        {
          question: 'How do regulatory compliance and privacy goals conflict?',
          choices: ['They are mutually exclusive', 'They are complementary', 'They are the same thing', 'They are a type of encryption'],
          correctIndex: 1,
          explanation: 'Regulatory compliance and privacy goals often conflict, as regulations may require disclosure of sensitive information.'
        }
      ],
      'best-practices': [
        {
          question: 'What is operational security (OPSEC) and why is it important?',
          choices: ['It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin', 'It\'s a type of transaction'],
          correctIndex: 1,
          explanation: 'Operational security is the practice of securing your digital devices and online accounts to prevent unauthorized access.'
        },
        {
          question: 'How does multisig enhance security and privacy?',
          choices: ['It makes transactions faster', 'It\'s a type of encryption', 'It\'s a type of wallet', 'It\'s a type of coin'],
          correctIndex: 2,
          explanation: 'Multisig requires multiple signatures for transactions, making it more secure and private.'
        },
        {
          question: 'Why is fund splitting important?',
          choices: ['It makes transactions look suspicious', 'It reduces privacy benefits', 'It\'s a type of encryption', 'It\'s a type of wallet'],
          correctIndex: 1,
          explanation: 'Fund splitting is crucial for privacy, as it makes it harder for blockchain analysis companies to track your funds.'
        },
        {
          question: 'How often should you review and update your privacy practices?',
          choices: ['Never', 'Once a year', 'Monthly', 'Daily'],
          correctIndex: 2,
          explanation: 'Regularly reviewing and updating your privacy practices is essential as new threats and solutions emerge.'
        }
      ]
    };

    const categoryQuizzes = quizzes[category as keyof typeof quizzes] || quizzes['best-practices'];
    // Use a more random approach to prevent predictable repetition
    const randomSeed = (blockId * 7 + category.length * 13) % categoryQuizzes.length;
    return categoryQuizzes[randomSeed];
  }

  private getPrivacyFact(category: string): string {
    // Comprehensive privacy education facts for each category
    const facts = {
      'on-chain-privacy': [
        'Every Bitcoin transaction is permanently recorded on a public blockchain, visible to anyone worldwide.',
        'Address reuse is one of the biggest privacy mistakes - it creates a clear trail of all your financial activity.',
        'Transaction amounts are always public and can reveal your financial situation and spending patterns.',
        'Change addresses in transactions can reveal your total balance and spending habits to observers.',
        'Multiple inputs to a transaction can link different addresses to the same user, creating address clusters.',
        'Transaction timing can reveal your daily routines, travel patterns, and even approximate location.',
        'Public transaction memos can contain sensitive information that becomes permanently public.',
        'Large transactions attract more attention and are more likely to be analyzed by surveillance companies.',
        'UTXO consolidation can create a clear picture of your total holdings and financial patterns.',
        'Public key reuse in different contexts can link your various online identities together.',
        'Address clustering algorithms can group addresses that likely belong to the same user.',
        'Fee analysis can reveal your urgency and potentially your location based on fee market conditions.',
        'Transaction patterns can reveal your spending habits, income sources, and financial relationships.',
        'Blockchain analysis companies use sophisticated algorithms to track and profile Bitcoin users.',
        'Once information is revealed on-chain, it becomes part of permanent public record.'
      ],
      'off-chain-practices': [
        'Your IP address can be correlated with your Bitcoin addresses when broadcasting transactions.',
        'Using the same device for Bitcoin and other online activities can create identity correlations.',
        'Browser fingerprinting can link your Bitcoin activity to your online identity.',
        'Email addresses used for Bitcoin services can be cross-referenced across platforms.',
        'Social media posts about Bitcoin can reveal your addresses and spending patterns.',
        'VPNs and Tor can help hide your location when accessing Bitcoin services.',
        'Different wallets for different purposes can prevent address correlation.',
        'Operational security practices are crucial for maintaining Bitcoin privacy.',
        'Device isolation can prevent cross-contamination of privacy-sensitive activities.',
        'Regular privacy audits can help identify and fix privacy vulnerabilities.'
      ],
      'coin-mixing': [
        'CoinJoin is a privacy technique that combines multiple users\' transactions to break input-output links.',
        'The effectiveness of CoinJoin depends on the number of participants and mixing patterns.',
        'Regular CoinJoin usage creates consistent privacy patterns that are harder to analyze.',
        'CoinJoin transactions may have higher fees but provide significant privacy benefits.',
        'Mixing effectiveness decreases if you frequently consolidate mixed coins.',
        'CoinJoin can be combined with other privacy techniques for enhanced protection.',
        'Participants should avoid revealing their participation to maintain privacy.',
        'CoinJoin makes it harder for blockchain analysis companies to track individual users.',
        'The privacy benefits of CoinJoin increase with regular usage over time.',
        'CoinJoin is most effective when used as part of a broader privacy strategy.'
      ],
      'wallet-setup': [
        'HD wallets generate unlimited addresses from a single seed phrase, improving privacy and security.',
        'Seed phrases should be stored offline in multiple secure locations for disaster recovery.',
        'Hardware wallets provide enhanced security against malware and theft.',
        'Different wallets for different purposes prevent address correlation.',
        'Regular address rotation helps maintain privacy and security over time.'
      ],
      'lightning-network': [
        'Lightning Network provides near-instant, low-fee transactions with enhanced privacy.',
        'Individual Lightning payments are not directly visible on the blockchain.',
        'Channel opening and closing are on-chain transactions that can be analyzed.',
        'Channel routing can reveal some network position information.',
        'Lightning can be combined with other privacy techniques for enhanced protection.'
      ],
      'regulatory': [
        'KYC/AML requirements create permanent records linking identities to Bitcoin addresses.',
        'Public records and subpoenas can force disclosure of Bitcoin holdings and transactions.',
        'Tax reporting requirements may force revelation of Bitcoin transaction history.',
        'Regulatory compliance often conflicts with privacy goals.',
        'Privacy regulations vary significantly by jurisdiction.'
      ],
      'best-practices': [
        'Privacy is an ongoing process that requires regular attention and updates.',
        'Multiple privacy techniques work best when combined together.',
        'Regular privacy audits can identify and fix vulnerabilities.',
        'Staying informed about new threats and solutions is crucial for maintaining privacy.'
      ]
    };

    const categoryFacts = facts[category as keyof typeof facts] || facts['best-practices'];
    // Return a random fact from the category
    const randomIndex = Math.floor(Math.random() * categoryFacts.length);
    return categoryFacts[randomIndex];
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
    console.log('startLearningMode called, gameState exists:', !!this.gameState);
    // Game state is already initialized in constructor
    if (this.gameState) {
      this.gameState.gameMode = 'learning';
      console.log('Learning mode started - tower will reset for continuous learning');
    } else {
      console.error('Game state not initialized when starting learning mode');
    }
  }

  async resetGame(): Promise<void> {
    // Reset all blocks
    this.blocks.forEach(block => {
      block.removed = false;
    });

    // Reset game state to FRESH START
    if (this.gameState) {
      this.gameState.towerHeight = 18;
      this.gameState.blocksRemoved = 0;
      this.gameState.currentScore = 0;
      this.gameState.diceResult = 0;
      this.gameState.canPullFromLayers = []; // Start with NO available layers until dice is rolled
      this.gameState.gameHistory = [];
      this.gameState.layerStats = this.initializeLayerStats();
      this.gameState.blockTypeStats = this.initializeBlockTypeStats();
    }

    console.log('Game reset - new learning session started with fresh state');
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

  public getCategoryProgress(category: string): number {
    // Only count blocks that have been REMOVED (not remaining blocks)
    const removedBlocks = this.blocks.filter(block => 
      block.removed && block.content.category === category
    );
    return removedBlocks.length;
  }

  public getTotalCategoryProgress(): { [key: string]: { completed: number; total: number } } {
    const categoryTotals = {
      'on-chain-privacy': 15,
      'off-chain-practices': 10,
      'coin-mixing': 10,
      'wallet-setup': 5,
      'lightning-network': 5,
      'regulatory': 5,
      'best-practices': 4
    };

    const result: { [key: string]: { completed: number; total: number } } = {};
    
    for (const [category, total] of Object.entries(categoryTotals)) {
      result[category] = {
        completed: this.getCategoryProgress(category),
        total
      };
    }

    return result;
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
