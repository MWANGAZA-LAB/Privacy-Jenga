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
    this.initializeMockData();
    this.initializeAchievements();
    this.initializeSpecialActions();
  }

  private initializeMockData() {
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

    // Create enhanced blocks with complete 54-block system
    this.blocks = this.createComplete54BlockSystem();
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
    const contentLibrary = this.getCompleteContentLibrary();
    const category = this.getCategoryForLayer(layer);
    const content = contentLibrary[category as keyof typeof contentLibrary][Math.floor(Math.random() * contentLibrary[category as keyof typeof contentLibrary].length)];
    
    return {
      ...content,
      id: id.toString(),
      points: this.calculatePoints(type, layer),
      category: category as 'password' | 'social-media' | 'wifi' | 'data-sharing' | 'encryption' | 'general' | 'phishing' | 'backup',
      fact: content.fact,
      impact: content.impact
    };
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
        },
        {
          title: 'Password Recovery Security',
          text: 'Use secure recovery methods like backup codes or authenticator apps instead of easily guessable security questions.',
          severity: 'warning' as const,
          fact: 'Security questions like "mother\'s maiden name" can often be found through social media research.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is the most secure password recovery method?',
            choices: ['Security questions', 'Backup codes', 'Email recovery', 'Phone recovery'],
            correctIndex: 1,
            explanation: 'Backup codes are the most secure recovery method as they cannot be guessed or socially engineered.'
          }
        },
        {
          title: 'Password Expiration Strategy',
          text: 'Change passwords regularly, especially for critical accounts like banking and email.',
          severity: 'tip' as const,
          fact: 'The average time for a password breach to be discovered is 197 days.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you change critical account passwords?',
            choices: ['Never', 'Every 5 years', 'Every 6 months', 'Every month'],
            correctIndex: 2,
            explanation: 'Changing critical passwords every 6 months reduces the risk of long-term exposure.'
          }
        },
        {
          title: 'Password Sharing Risks',
          text: 'Never share passwords with others, even family members or colleagues.',
          severity: 'critical' as const,
          fact: 'Shared passwords are the leading cause of account compromises in organizations.',
          impact: 'negative' as const,
          quiz: {
            question: 'Is it safe to share passwords with trusted family members?',
            choices: ['Yes, always', 'Only for streaming services', 'Never', 'Only for work accounts'],
            correctIndex: 2,
            explanation: 'Never share passwords, as it creates multiple security vulnerabilities and makes tracking impossible.'
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
        },
        {
          title: 'Social Media Addiction Awareness',
          text: 'Be mindful of how much time you spend on social media and its impact on mental health.',
          severity: 'warning' as const,
          fact: 'The average person spends 2 hours and 27 minutes per day on social media.',
          impact: 'negative' as const,
          quiz: {
            question: 'How much time does the average person spend on social media daily?',
            choices: ['30 minutes', '1 hour', '2.5 hours', '4 hours'],
            correctIndex: 2,
            explanation: 'The average person spends 2 hours and 27 minutes per day on social media platforms.'
          }
        },
        {
          title: 'Fake News Recognition',
          text: 'Verify information before sharing and be skeptical of sensational headlines.',
          severity: 'warning' as const,
          fact: 'False news spreads 6 times faster than true news on social media.',
          impact: 'positive' as const,
          quiz: {
            question: 'How much faster does false news spread compared to true news?',
            choices: ['2 times', '4 times', '6 times', '10 times'],
            correctIndex: 2,
            explanation: 'False news spreads 6 times faster than true news on social media platforms.'
          }
        },
        {
          title: 'Social Media Cleanup',
          text: 'Regularly review and remove old posts that may contain sensitive information.',
          severity: 'tip' as const,
          fact: 'Social media posts from years ago can still be found and used against you.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you review old social media posts?',
            choices: ['Never', 'Once a year', 'Every 6 months', 'Monthly'],
            correctIndex: 1,
            explanation: 'Reviewing old posts annually helps remove potentially embarrassing or sensitive content.'
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
        },
        {
          title: 'WiFi Network Naming',
          text: 'Avoid using personal information in your WiFi network name (SSID).',
          severity: 'warning' as const,
          fact: 'Network names like "JohnsHouse" can reveal your identity to nearby devices.',
          impact: 'positive' as const,
          quiz: {
            question: 'What should you avoid in your WiFi network name?',
            choices: ['Random numbers', 'Personal names', 'Technical terms', 'Color names'],
            correctIndex: 1,
            explanation: 'Avoid using personal names in WiFi network names as they can reveal your identity.'
          }
        },
        {
          title: 'Guest Network Setup',
          text: 'Create a separate guest network for visitors to keep your main network secure.',
          severity: 'tip' as const,
          fact: 'Guest networks isolate visitor devices from your personal devices and data.',
          impact: 'positive' as const,
          quiz: {
            question: 'Why should you use a guest WiFi network?',
            choices: ['To save money', 'To isolate visitors', 'To get faster speeds', 'To share passwords'],
            correctIndex: 1,
            explanation: 'Guest networks isolate visitor devices from your personal network for security.'
          }
        },
        {
          title: 'WiFi Router Updates',
          text: 'Keep your WiFi router firmware updated to patch security vulnerabilities.',
          severity: 'warning' as const,
          fact: 'Router firmware updates often include critical security patches.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you update your WiFi router firmware?',
            choices: ['Never', 'Once a year', 'Every 6 months', 'Monthly'],
            correctIndex: 1,
            explanation: 'Updating router firmware annually helps patch security vulnerabilities.'
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
        },
        {
          title: 'Cookie Management',
          text: 'Regularly clear cookies and use browser settings to limit tracking.',
          severity: 'tip' as const,
          fact: 'Cookies can track your browsing history across multiple websites.',
          impact: 'positive' as const,
          quiz: {
            question: 'What can cookies track across websites?',
            choices: ['Nothing', 'Only current site', 'Browsing history', 'Passwords'],
            correctIndex: 2,
            explanation: 'Cookies can track your browsing history and behavior across multiple websites.'
          }
        },
        {
          title: 'Data Retention Policies',
          text: 'Understand how long companies keep your data and request deletion when possible.',
          severity: 'warning' as const,
          fact: 'Many companies keep your data indefinitely unless you specifically request deletion.',
          impact: 'positive' as const,
          quiz: {
            question: 'How long do most companies keep your personal data?',
            choices: ['1 year', '5 years', 'Indefinitely', 'Until you ask'],
            correctIndex: 2,
            explanation: 'Many companies keep your data indefinitely unless you specifically request deletion.'
          }
        },
        {
          title: 'Data Portability Rights',
          text: 'Exercise your right to download and transfer your data between services.',
          severity: 'tip' as const,
          fact: 'GDPR and other privacy laws give you the right to download your personal data.',
          impact: 'positive' as const,
          quiz: {
            question: 'What right do privacy laws give you regarding your data?',
            choices: ['Nothing', 'Download your data', 'Delete companies', 'Get paid'],
            correctIndex: 1,
            explanation: 'Privacy laws give you the right to download and transfer your personal data.'
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
        },
        {
          title: 'Browser Encryption',
          text: 'Always use HTTPS websites to ensure your data is encrypted in transit.',
          severity: 'critical' as const,
          fact: 'HTTP websites send data in plain text that anyone can intercept.',
          impact: 'positive' as const,
          quiz: {
            question: 'What does HTTPS protect?',
            choices: ['Nothing', 'Data in transit', 'Stored data', 'Your identity'],
            correctIndex: 1,
            explanation: 'HTTPS encrypts data as it travels between your device and the website.'
          }
        },
        {
          title: 'Email Encryption',
          text: 'Use encrypted email services for sensitive communications.',
          severity: 'tip' as const,
          fact: 'Standard email is sent in plain text and can be read by anyone who intercepts it.',
          impact: 'positive' as const,
          quiz: {
            question: 'How is standard email sent?',
            choices: ['Encrypted', 'Plain text', 'Compressed', 'Hidden'],
            correctIndex: 1,
            explanation: 'Standard email is sent in plain text and can be read by anyone who intercepts it.'
          }
        },
        {
          title: 'Disk Encryption',
          text: 'Enable full disk encryption on your devices to protect all stored data.',
          severity: 'critical' as const,
          fact: 'Full disk encryption protects all your data if your device is lost or stolen.',
          impact: 'positive' as const,
          quiz: {
            question: 'What does full disk encryption protect?',
            choices: ['Only files', 'Only folders', 'All data', 'Nothing'],
            correctIndex: 2,
            explanation: 'Full disk encryption protects all data stored on your device.'
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
        },
        {
          title: 'Physical Security',
          text: 'Lock your devices when not in use and be aware of shoulder surfing.',
          severity: 'warning' as const,
          fact: 'Shoulder surfing attacks can capture passwords and PINs in under 10 seconds.',
          impact: 'positive' as const,
          quiz: {
            question: 'What is shoulder surfing?',
            choices: ['A sport', 'Looking over someone\'s shoulder', 'A type of malware', 'A security feature'],
            correctIndex: 1,
            explanation: 'Shoulder surfing is when someone looks over your shoulder to see your passwords or PINs.'
          }
        },
        {
          title: 'Social Engineering Awareness',
          text: 'Be suspicious of unsolicited requests for personal information.',
          severity: 'critical' as const,
          fact: 'Social engineering attacks rely on human psychology rather than technical vulnerabilities.',
          impact: 'positive' as const,
          quiz: {
            question: 'What do social engineering attacks target?',
            choices: ['Computer systems', 'Human psychology', 'Network security', 'Software bugs'],
            correctIndex: 1,
            explanation: 'Social engineering attacks manipulate human psychology to gain access to information.'
          }
        },
        {
          title: 'Incident Response Planning',
          text: 'Have a plan for what to do if your accounts are compromised.',
          severity: 'tip' as const,
          fact: 'Having a response plan can reduce the damage from a security incident by 50%.',
          impact: 'positive' as const,
          quiz: {
            question: 'How much can a response plan reduce incident damage?',
            choices: ['10%', '25%', '50%', '75%'],
            correctIndex: 2,
            explanation: 'Having a response plan can reduce the damage from a security incident by 50%.'
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
        },
        {
          title: 'Vishing Awareness',
          text: 'Be cautious of phone calls requesting personal information or urgent action.',
          severity: 'critical' as const,
          fact: 'Voice phishing (vishing) attacks increased by 350% in recent years.',
          impact: 'negative' as const,
          quiz: {
            question: 'What is vishing?',
            choices: ['Video phishing', 'Voice phishing', 'Visual phishing', 'Virtual phishing'],
            correctIndex: 1,
            explanation: 'Vishing is voice phishing, where attackers call to steal personal information.'
          }
        },
        {
          title: 'Smishing Protection',
          text: 'Be suspicious of text messages asking for personal information or containing suspicious links.',
          severity: 'warning' as const,
          fact: 'SMS phishing (smishing) attacks have a 45% success rate.',
          impact: 'negative' as const,
          quiz: {
            question: 'What is smishing?',
            choices: ['Social media phishing', 'SMS phishing', 'Software phishing', 'Secure phishing'],
            correctIndex: 1,
            explanation: 'Smishing is SMS phishing, where attackers use text messages to steal information.'
          }
        },
        {
          title: 'Phishing Reporting',
          text: 'Report phishing attempts to help protect others and improve security systems.',
          severity: 'tip' as const,
          fact: 'Reporting phishing helps security teams identify and block new attack patterns.',
          impact: 'positive' as const,
          quiz: {
            question: 'Why should you report phishing attempts?',
            choices: ['To get revenge', 'To help protect others', 'To get money back', 'To avoid spam'],
            correctIndex: 1,
            explanation: 'Reporting phishing helps security teams protect others from similar attacks.'
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
        },
        {
          title: 'Backup Frequency',
          text: 'Backup important data regularly, with critical files backed up daily.',
          severity: 'tip' as const,
          fact: 'The average person loses 1,000 photos and 500 documents due to device failure.',
          impact: 'positive' as const,
          quiz: {
            question: 'How often should you backup critical files?',
            choices: ['Never', 'Monthly', 'Weekly', 'Daily'],
            correctIndex: 3,
            explanation: 'Critical files should be backed up daily to minimize data loss.'
          }
        },
        {
          title: 'Backup Location Strategy',
          text: 'Use multiple backup locations including local, cloud, and offsite options.',
          severity: 'warning' as const,
          fact: 'Having backups in multiple locations protects against natural disasters and theft.',
          impact: 'positive' as const,
          quiz: {
            question: 'Why use multiple backup locations?',
            choices: ['To save money', 'To protect from disasters', 'To get faster access', 'To organize files'],
            correctIndex: 1,
            explanation: 'Multiple backup locations protect against natural disasters, theft, and other risks.'
          }
        },
        {
          title: 'Backup Verification',
          text: 'Verify backup integrity by checking file sizes and performing test restores.',
          severity: 'tip' as const,
          fact: 'Corrupted backups are often discovered only when trying to restore data.',
          impact: 'positive' as const,
          quiz: {
            question: 'What should you verify about your backups?',
            choices: ['Nothing', 'File sizes only', 'Integrity and restorability', 'Cost only'],
            correctIndex: 2,
            explanation: 'Verify both backup integrity and ability to restore data when needed.'
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
      canPullFromLayers: [1, 2, 3], // Start with bottom 3 layers for better gameplay balance
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

  async pickBlock(blockId: string): Promise<{ content: Content; gameState: GameState; gameOver?: boolean; mode?: string } | null> {
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

      // Check for game over conditions
      const gameOverResult = this.checkGameOverConditions();
      
      return { 
        content: block.content, 
        gameState: this.gameState,
        gameOver: gameOverResult.gameOver,
        mode: gameOverResult.mode
      };
    }
    return null;
  }

  // Enhanced game over logic for different modes
  private checkGameOverConditions(): { gameOver: boolean; mode: string; reason?: string } {
    if (!this.gameState) {
      return { gameOver: false, mode: 'unknown' };
    }

    const { gameMode, blocksRemoved, towerHeight } = this.gameState;

    // Classic Mode: Game ends when tower becomes unstable or all blocks are removed
    if (gameMode === 'classic') {
      // Tower collapse condition (tower height becomes too low)
      if (towerHeight <= 3) {
        return { 
          gameOver: true, 
          mode: 'classic', 
          reason: 'Tower collapsed! Game over in Classic mode.' 
        };
      }

      // All blocks removed condition
      if (blocksRemoved >= 54) {
        return { 
          gameOver: true, 
          mode: 'classic', 
          reason: 'All blocks removed! Perfect victory in Classic mode!' 
        };
      }

      // Stability threshold condition
      if (this.calculateTowerStability() <= 20) {
        return { 
          gameOver: true, 
          mode: 'classic', 
          reason: 'Tower became too unstable! Game over in Classic mode.' 
        };
      }
    }

    // Endless Mode: Tower resets when it becomes unstable, but game continues
    if (gameMode === 'endless') {
      // Check if tower needs reset
      if (towerHeight <= 3 || this.calculateTowerStability() <= 20) {
        // Auto-reset tower in endless mode
        this.resetTowerForEndlessMode();
        return { 
          gameOver: false, 
          mode: 'endless', 
          reason: 'Tower reset in Endless mode! Continue playing!' 
        };
      }
    }

    return { gameOver: false, mode: gameMode };
  }

  // Calculate tower stability based on remaining blocks and their positions
  private calculateTowerStability(): number {
    if (!this.gameState) return 100;

    const remainingBlocks = this.blocks.filter(b => !b.removed);
    let stability = 100;

    // Reduce stability based on blocks removed
    stability -= this.gameState.blocksRemoved * 1.5;

    // Additional stability reduction for removing blocks from higher layers
    const highLayerBlocks = remainingBlocks.filter(b => b.layer > 12);
    stability -= highLayerBlocks.length * 2;

    // Stability boost for having blocks in lower layers
    const lowLayerBlocks = remainingBlocks.filter(b => b.layer <= 6);
    stability += lowLayerBlocks.length * 0.5;

    return Math.max(0, Math.min(100, stability));
  }

  // Reset tower specifically for endless mode
  private resetTowerForEndlessMode(): void {
    // Reset all blocks
    this.blocks.forEach(block => {
      block.removed = false;
      block.removedBy = undefined;
    });

    // Create new random blocks
    this.blocks = this.createComplete54BlockSystem();

    // Update game state for endless mode
    if (this.gameState) {
      this.gameState.towerHeight = 18;
      this.gameState.blocksRemoved = 0;
      this.gameState.canPullFromLayers = [1, 2, 3]; // Reset to initial layer access
      this.gameState.diceResult = 0;
      
      // Keep the score and achievements
      // Update stats
      this.gameState.layerStats = this.calculateLayerStats();
      this.gameState.blockTypeStats = this.calculateBlockTypeStats();

      console.log('Tower reset in Endless mode. Score maintained:', this.gameState.currentScore);
    }
  }

  // Enhanced mode switching with proper state management
  async switchGameMode(mode: 'classic' | 'endless' | 'learning'): Promise<void> {
    if (!this.gameState) {
      throw new Error('No active game to switch modes');
    }

    const previousMode = this.gameState.gameMode;
    
    if (previousMode === mode) {
      console.log(`Already in ${mode} mode`);
      return;
    }

    // Save current progress if switching from endless to classic
    if (previousMode === 'endless' && mode === 'classic') {
      // In endless mode, we can switch to classic and keep current progress
      this.gameState.gameMode = mode;
      console.log(`Switched from Endless to Classic mode. Current score: ${this.gameState.currentScore}`);
    } else if (previousMode === 'classic' && mode === 'endless') {
      // Switching to endless mode - reset tower but keep score
      this.gameState.gameMode = mode;
      this.resetTowerForEndlessMode();
      console.log(`Switched from Classic to Endless mode. Tower reset, score maintained: ${this.gameState.currentScore}`);
    }

    // Update high score if applicable
    if (this.gameState.currentScore > this.gameState.currentPlayer.highScore) {
      this.gameState.currentPlayer.highScore = this.gameState.currentScore;
      console.log(`New high score achieved: ${this.gameState.currentScore}`);
    }
  }

  // Enhanced unified learning mode support
  async startEndlessMode(): Promise<void> {
    this.initializeGameState();
    if (this.gameState) {
      this.gameState.gameMode = 'learning';
      console.log('Unified learning mode started - tower will reset for continuous learning');
    }
  }

  // Enhanced classic mode support
  async startClassicMode(): Promise<void> {
    this.initializeGameState();
    if (this.gameState) {
      this.gameState.gameMode = 'classic';
      console.log('Classic mode started - game ends when tower falls');
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

    // Reset game state but keep score and mode preference
    if (this.gameState) {
      const currentScore = this.gameState.currentScore;
      const currentMode = this.gameState.gameMode;
      this.initializeGameState();
      if (this.gameState) {
        this.gameState.currentScore = currentScore;
        this.gameState.gameMode = currentMode; // Maintain the current mode
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
        this.gameState.gameMode = 'learning'; // This method is for unified learning mode
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

  // Get current game mode information
  getGameModeInfo(): { mode: string; description: string; rules: string[] } {
    if (!this.gameState) {
      return {
        mode: 'unknown',
        description: 'No active game',
        rules: []
      };
    }

    if (this.gameState.gameMode === 'classic') {
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
    } else if (this.gameState.gameMode === 'learning') {
      return {
        mode: 'Learning',
        description: 'Unified learning experience - tower resets for continuous education',
        rules: [
          'Tower automatically resets when it becomes unstable',
          'Score accumulates across multiple tower resets',
          'Focus on mastering all 54 privacy concepts',
          'Perfect for continuous learning and skill development'
        ]
      };
    } else {
      return {
        mode: 'Endless',
        description: 'Continuous gameplay - tower resets when unstable',
        rules: [
          'Tower automatically resets when it becomes unstable',
          'Score accumulates across multiple tower resets',
          'Perfect for extended learning sessions',
          'No pressure - focus on learning and improving'
        ]
      };
    }
  }

  // Check if game can continue in current mode
  canContinueGame(): boolean {
    if (!this.gameState) return false;

    if (this.gameState.gameMode === 'classic') {
      // In classic mode, check if tower is still stable
      return this.calculateTowerStability() > 20 && this.gameState.towerHeight > 3;
    } else if (this.gameState.gameMode === 'learning') {
      // In learning mode, game can always continue (tower resets)
      return true;
    } else {
      // In endless mode, game can always continue
      return true;
    }
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
      console.log(`Dice rolled: ${diceValue}, New layer access: ${result.layerRestrictions.join(', ')}`);
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

  getBlocks(): Block[] {
    return this.blocks;
  }

  getCurrentRoom(): MockRoom | null {
    return this.currentRoom;
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
}

export const mockGameService = new MockGameService();
