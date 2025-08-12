import { AdminUser } from '../types';
import { logger } from '../utils/logger';

class AdminService {
  private users: Map<string, AdminUser> = new Map();

  constructor() {
    this.initializeDefaultAdmin();
  }

  async login(username: string, password: string): Promise<{
    success: boolean;
    token?: string;
    user?: AdminUser;
    error?: string;
  }> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // In production, this would use bcrypt to verify password
    if (password === 'admin123') { // Default password for demo
      const token = `admin_token_${Date.now()}`;
      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: user.permissions
        }
      };
    }

    return { success: false, error: 'Invalid credentials' };
  }

  async createUser(userData: Omit<AdminUser, 'id'>): Promise<AdminUser> {
    const id = `admin_${Date.now()}`;
    const user: AdminUser = {
      id,
      ...userData
    };

    this.users.set(id, user);
    logger.info(`Admin user created: ${id}`);
    
    return user;
  }

  async getUsers(): Promise<AdminUser[]> {
    return Array.from(this.users.values());
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalRooms: number;
    activeGames: number;
    totalContent: number;
  }> {
    // Mock data for demo
    return {
      totalUsers: 150,
      totalRooms: 25,
      activeGames: 8,
      totalContent: 45
    };
  }

  async getContentForAdmin(options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{
    content: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Mock data for demo
    const total = 45;
    const totalPages = Math.ceil(total / options.limit);
    
    return {
      content: [],
      total,
      page: options.page,
      totalPages
    };
  }

  async getRoomsForAdmin(options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{
    rooms: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Mock data for demo
    const total = 25;
    const totalPages = Math.ceil(total / options.limit);
    
    return {
      rooms: [],
      total,
      page: options.page,
      totalPages
    };
  }

  async getAnalytics(options: {
    period: string;
    type?: string;
  }): Promise<any> {
    // Mock analytics data for demo
    return {
      period: options.period,
      type: options.type || 'overview',
      data: {
        totalPlayers: 150,
        totalGames: 89,
        averageScore: 75,
        topCategory: 'account-security'
      }
    };
  }

  private initializeDefaultAdmin(): void {
    const defaultAdmin: AdminUser = {
      id: 'admin_default',
      username: 'admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin']
    };

    this.users.set(defaultAdmin.id, defaultAdmin);
    logger.info('Initialized default admin user');
  }
}

export const adminService = new AdminService();
