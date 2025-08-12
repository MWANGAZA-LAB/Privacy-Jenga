// Mock Game Service - Frontend-only implementation
export interface MockRoom {
  id: string;
  code: string;
  players: string[];
  status: 'waiting' | 'playing' | 'finished';
  currentTurn: number;
}

export interface MockPlayer {
  id: string;
  nickname: string;
  avatar: string;
  points: number;
}

export interface MockBlock {
  id: string;
  content: string;
  removed: boolean;
  removedBy?: string;
}

class MockGameService {
  private rooms: MockRoom[] = [];
  private currentRoom: MockRoom | null = null;
  private players: MockPlayer[] = [];
  private blocks: MockBlock[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock rooms
    this.rooms = [
      {
        id: '1',
        code: 'ABC123',
        players: ['Player1', 'Player2'],
        status: 'waiting',
        currentTurn: 0
      },
      {
        id: '2',
        code: 'XYZ789',
        players: ['Player3'],
        status: 'waiting',
        currentTurn: 0
      }
    ];

    // Create mock players
    this.players = [
      { id: '1', nickname: 'Player1', avatar: '🎮', points: 0 },
      { id: '2', nickname: 'Player2', avatar: '🚀', points: 0 },
      { id: '3', nickname: 'Player3', avatar: '🌟', points: 0 }
    ];

    // Create mock blocks with privacy content
    this.blocks = [
      { id: '1', content: 'Two-Factor Authentication: Always enable 2FA for your accounts', removed: false },
      { id: '2', content: 'Password Security: Use strong, unique passwords for each account', removed: false },
      { id: '3', content: 'Public WiFi: Never access sensitive information on public networks', removed: false },
      { id: '4', content: 'Social Media Privacy: Review and adjust your privacy settings regularly', removed: false },
      { id: '5', content: 'Data Sharing: Be cautious about what personal information you share online', removed: false }
    ];
  }

  // Mock API methods
  async createRoom(): Promise<MockRoom> {
    const newRoom: MockRoom = {
      id: Date.now().toString(),
      code: Math.random().toString(36).substr(2, 6).toUpperCase(),
      players: ['Player1'],
      status: 'waiting',
      currentTurn: 0
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
    if (this.currentRoom) {
      this.currentRoom.status = 'playing';
      return true;
    }
    return false;
  }

  async pickBlock(blockId: string): Promise<MockBlock | null> {
    const block = this.blocks.find(b => b.id === blockId && !b.removed);
    if (block) {
      block.removed = true;
      block.removedBy = 'currentPlayer';
      return block;
    }
    return null;
  }

  getCurrentRoom(): MockRoom | null {
    return this.currentRoom;
  }

  getBlocks(): MockBlock[] {
    return this.blocks;
  }

  getPlayers(): MockPlayer[] {
    return this.players;
  }
}

export const mockGameService = new MockGameService();
