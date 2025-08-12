import { AnalyticsEvent, LeaderboardEntry } from '../types';
import { logger } from '../utils/logger';

class AnalyticsService {
  private events: Map<string, AnalyticsEvent> = new Map();
  private leaderboard: Map<string, LeaderboardEntry> = new Map();

  async getEvents(options: {
    roomId?: string;
    playerId?: string;
    eventType?: string;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
  }): Promise<{
    events: AnalyticsEvent[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let filteredEvents = Array.from(this.events.values());

    if (options.roomId) {
      filteredEvents = filteredEvents.filter(e => e.roomId === options.roomId);
    }

    if (options.playerId) {
      filteredEvents = filteredEvents.filter(e => e.playerId === options.playerId);
    }

    if (options.eventType) {
      filteredEvents = filteredEvents.filter(e => e.eventType === options.eventType);
    }

    if (options.startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= options.startDate!);
    }

    if (options.endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= options.endDate!);
    }

    const total = filteredEvents.length;
    const totalPages = Math.ceil(total / options.limit);
    const startIndex = (options.page - 1) * options.limit;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + options.limit);

    return {
      events: paginatedEvents,
      total,
      page: options.page,
      totalPages
    };
  }

  async getLeaderboard(options: {
    period: string;
    limit: number;
    category?: string;
  }): Promise<LeaderboardEntry[]> {
    let entries = Array.from(this.leaderboard.values());

    // Filter by period if needed
    if (options.period !== 'all') {
      const cutoffDate = this.getCutoffDate(options.period);
      entries = entries.filter(e => e.lastSeen >= cutoffDate);
    }

    // Sort by points (descending)
    entries.sort((a, b) => b.pointsTotal - a.pointsTotal);

    return entries.slice(0, options.limit);
  }

  async getGameStats(options: {
    period: string;
    roomId?: string;
  }): Promise<{
    totalGames: number;
    totalPlayers: number;
    averageScore: number;
    topCategory: string;
    gameDuration: number;
  }> {
    // Mock data for demo
    return {
      totalGames: 89,
      totalPlayers: 150,
      averageScore: 75,
      topCategory: 'account-security',
      gameDuration: 15 // minutes
    };
  }

  async getContentPerformance(options: {
    period: string;
    category?: string;
    difficulty?: string;
  }): Promise<{
    totalViews: number;
    averageQuizScore: number;
    topPerformingContent: string[];
    categoryBreakdown: Record<string, number>;
  }> {
    // Mock data for demo
    return {
      totalViews: 1250,
      averageQuizScore: 78,
      topPerformingContent: [
        'Two-Factor Authentication',
        'Password Security',
        'Public WiFi Safety'
      ],
      categoryBreakdown: {
        'account-security': 45,
        'network-security': 30,
        'social-privacy': 25
      }
    };
  }

  async getPlayerInsights(options: {
    period: string;
    playerId?: string;
  }): Promise<{
    totalGames: number;
    averageScore: number;
    favoriteCategory: string;
    improvementTrend: number;
    badges: string[];
  }> {
    // Mock data for demo
    return {
      totalGames: 12,
      averageScore: 82,
      favoriteCategory: 'account-security',
      improvementTrend: 15, // percentage improvement
      badges: ['Security Expert', 'Quiz Master', 'Privacy Champion']
    };
  }

  async trackEvent(eventData: {
    roomId: string;
    playerId: string;
    eventType: string;
    metadata: Record<string, any>;
  }): Promise<void> {
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId: eventData.roomId,
      playerId: eventData.playerId,
      eventType: eventData.eventType,
      metadata: eventData.metadata,
      timestamp: new Date(),
      sessionId: `session_${eventData.playerId}`
    };

    this.events.set(event.id, event);
    logger.info(`Analytics event tracked: ${event.eventType} for player ${event.playerId}`);
  }

  async updateLeaderboard(playerId: string, points: number): Promise<void> {
    const existing = this.leaderboard.get(playerId);
    
    if (existing) {
      existing.pointsTotal += points;
      existing.lastSeen = new Date();
      existing.blocksCompleted += 1;
    } else {
      const entry: LeaderboardEntry = {
        id: `leaderboard_${playerId}`,
        playerIdentifier: playerId,
        pointsTotal: points,
        gamesPlayed: 1,
        blocksCompleted: 1,
        lastSeen: new Date()
      };
      this.leaderboard.set(playerId, entry);
    }
  }

  private getCutoffDate(period: string): Date {
    const now = new Date();
    
    switch (period) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // Beginning of time
    }
  }
}

export const analyticsService = new AnalyticsService();
