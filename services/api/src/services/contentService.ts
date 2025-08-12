import { Content } from '../types';
import { logger } from '../utils/logger';

class ContentService {
  private content: Map<string, Content> = new Map();

  constructor() {
    this.initializeDefaultContent();
  }

  async getAllContent(options: { locale?: string; category?: string; difficulty?: string } = {}): Promise<Content[]> {
    let filteredContent = Array.from(this.content.values());

    if (options.locale) {
      filteredContent = filteredContent.filter(c => c.locale === options.locale);
    }

    if (options.category) {
      filteredContent = filteredContent.filter(c => c.category === options.category);
    }

    if (options.difficulty) {
      filteredContent = filteredContent.filter(c => c.tags.includes(options.difficulty!));
    }

    return filteredContent;
  }

  async getContentById(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async createContent(contentData: Omit<Content, 'id'>): Promise<Content> {
    const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const content: Content = {
      id,
      ...contentData
    };

    this.content.set(id, content);
    logger.info(`Content created: ${id}`);
    
    return content;
  }

  async updateContent(id: string, updates: Partial<Content>): Promise<Content | undefined> {
    const content = this.content.get(id);
    if (!content) {
      return undefined;
    }

    const updatedContent = { ...content, ...updates };
    this.content.set(id, updatedContent);
    
    logger.info(`Content updated: ${id}`);
    return updatedContent;
  }

  async deleteContent(id: string): Promise<boolean> {
    const deleted = this.content.delete(id);
    if (deleted) {
      logger.info(`Content deleted: ${id}`);
    }
    return deleted;
  }

  async getRandomContent(count: number): Promise<Content[]> {
    const allContent = Array.from(this.content.values());
    const shuffled = allContent.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private initializeDefaultContent(): void {
    const defaultContent: Omit<Content, 'id'>[] = [
      {
        title: "Password Security",
        text: "Use strong, unique passwords for each account. Consider using a password manager to generate and store secure passwords.",
        severity: "warning",
        quiz: {
          question: "What makes a password strong?",
          choices: [
            "Using your name and birth year",
            "Using a mix of letters, numbers, and symbols",
            "Using the same password everywhere",
            "Using only lowercase letters"
          ],
          correctIndex: 1,
          explanation: "Strong passwords should include uppercase and lowercase letters, numbers, and special symbols.",
          points: 10
        },
        tags: ["security", "passwords", "authentication"],
        locale: "en",
        category: "account-security"
      },
      {
        title: "Two-Factor Authentication",
        text: "Enable two-factor authentication (2FA) on your accounts for an extra layer of security beyond just passwords.",
        severity: "critical",
        quiz: {
          question: "What is two-factor authentication?",
          choices: [
            "Using two passwords",
            "A second verification method after password",
            "Having two accounts",
            "Using two devices"
          ],
          correctIndex: 1,
          explanation: "2FA requires a second verification method, like a code from your phone, in addition to your password.",
          points: 15
        },
        tags: ["security", "2fa", "authentication"],
        locale: "en",
        category: "account-security"
      },
      {
        title: "Public WiFi Safety",
        text: "Be cautious when using public WiFi networks. Avoid accessing sensitive accounts or entering passwords on unsecured networks.",
        severity: "warning",
        quiz: {
          question: "What should you avoid on public WiFi?",
          choices: [
            "Checking the weather",
            "Reading news articles",
            "Online banking",
            "Playing games"
          ],
          correctIndex: 2,
          explanation: "Avoid accessing sensitive accounts like banking on public WiFi as your data could be intercepted.",
          points: 10
        },
        tags: ["wifi", "security", "public-networks"],
        locale: "en",
        category: "network-security"
      },
      {
        title: "Social Media Privacy",
        text: "Review your social media privacy settings regularly. Be mindful of what personal information you share publicly.",
        severity: "tip",
        quiz: {
          question: "How often should you review privacy settings?",
          choices: [
            "Never",
            "Only when you create an account",
            "Regularly, at least yearly",
            "Only when you get hacked"
          ],
          correctIndex: 2,
          explanation: "Privacy settings should be reviewed regularly as platforms often update their policies and features.",
          points: 5
        },
        tags: ["social-media", "privacy", "settings"],
        locale: "en",
        category: "social-privacy"
      },
      {
        title: "Data Backup",
        text: "Regularly backup your important data. Use multiple backup methods including cloud storage and external drives.",
        severity: "warning",
        quiz: {
          question: "What's the best backup strategy?",
          choices: [
            "Only cloud backup",
            "Only external drive backup",
            "Multiple backup methods",
            "No backup needed"
          ],
          correctIndex: 2,
          explanation: "Using multiple backup methods (cloud + external drives) provides redundancy and better protection.",
          points: 10
        },
        tags: ["backup", "data", "storage"],
        locale: "en",
        category: "data-protection"
      }
    ];

    defaultContent.forEach((content, index) => {
      const id = `default_${index}`;
      this.content.set(id, { id, ...content });
    });

    logger.info(`Initialized ${defaultContent.length} default content items`);
  }
}

export const contentService = new ContentService();
