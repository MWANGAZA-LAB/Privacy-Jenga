// Game Types
export interface Block {
  id: string;
  content: Content;
  removed: boolean;
  removedBy?: string;
}

export interface Content {
  id: string;
  title: string;
  text: string;
  severity: 'tip' | 'warning' | 'critical';
  quiz?: {
    question: string;
    choices: string[];
    correctIndex: number;
  };
}

export interface ChatMessage {
  id: number;
  text: string;
  player: string;
  timestamp: string;
  playerId?: string;
  nickname?: string;
}

export interface Player {
  nickname: string;
  isHost: boolean;
}

export interface Room {
  id: string;
  code: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  currentTurn?: string;
  blocks: Block[];
  settings?: {
    maxPlayers: number;
    turnTimeoutSeconds: number;
    allowChat: boolean;
    difficulty: string;
  };
}

// Component Props Types
export interface JengaTowerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  isInteractive: boolean;
  selectedBlockId?: string;
}

export interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  currentPlayerId?: string;
}

export interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => void;
  showQuiz?: boolean;
}

export interface PlayerListProps {
  players: Player[];
  currentTurn?: string;
  currentPlayerId?: string;
}
