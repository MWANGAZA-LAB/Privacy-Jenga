import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  Play, 
  Timer,
  Users
} from 'lucide-react';

import { mockGameService } from '../services/mockGameService';
import JengaTower from '../components/JengaTower';
import ContentModal from '../components/ContentModal';
import PlayerList from '../components/PlayerList';
import Chat from '../components/Chat';

interface Player {
  nickname: string;
  isHost: boolean;
}

interface Room {
  id: string;
  code: string;
}

interface Block {
  id: string;
  removed: boolean;
}

interface Content {
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

interface ChatMessage {
  id: number;
  text: string;
  player: string;
  timestamp: string;
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isMyTurn] = useState(true);
  const [turnTimeLeft] = useState(60);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get current room and player from localStorage
  useEffect(() => {
    const roomId = localStorage.getItem('currentRoomId');
    const nickname = localStorage.getItem('playerNickname');
    
    if (!roomId || !nickname) {
      navigate('/');
      return;
    }

    const currentRoom = mockGameService.getCurrentRoom();
    if (currentRoom) {
      setRoom(currentRoom);
      setCurrentPlayer({ nickname, isHost: true });
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Handle content display when block is removed
  useEffect(() => {
    if (selectedContent) {
      setShowContentModal(true);
    }
  }, [selectedContent]);

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  const handleBlockClick = async (block: Block) => {
    if (!isMyTurn || block.removed) {
      alert("It's not your turn or block is unavailable");
      return;
    }

    setSelectedBlock(block);
    
    try {
      const result = await mockGameService.pickBlock(block.id);
      if (result && result.content) {
        setSelectedContent(result.content);
      }
    } catch (error) {
      alert('Failed to pick block');
    }
  };

  const handleQuizAnswer = async (selectedIndex: number) => {
    if (selectedBlock && selectedContent) {
      try {
        // Mock quiz answer handling
        alert(`Quiz answered! You selected option ${selectedIndex + 1}`);
        setShowContentModal(false);
        setSelectedContent(null);
        setSelectedBlock(null);
      } catch (error) {
        alert('Failed to submit quiz answer');
      }
    }
  };

  const handleStartGame = async () => {
    if (!currentPlayer?.isHost) {
      alert('Only the host can start the game');
      return;
    }

    try {
      // Mock game start
      alert('Game started!');
    } catch (error) {
      alert('Failed to start game');
    }
  };

  const leaveRoom = () => {
    localStorage.removeItem('currentRoomId');
    localStorage.removeItem('playerNickname');
    navigate('/');
  };

  const sendChatMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      text,
      player: currentPlayer.nickname,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Game Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">Privacy Jenga</h1>
              <div className="bg-teal-500 px-3 py-1 rounded-full text-sm">
                Room: {room?.code || 'DEMO'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Turn Timer */}
              <div className="flex items-center space-x-2 bg-teal-500 px-3 py-1 rounded-full">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">{turnTimeLeft}s</span>
              </div>
              
              {/* Player Info */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{currentPlayer.nickname}</span>
              </div>
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-teal-500 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Leave Room */}
              <button
                onClick={leaveRoom}
                className="p-2 hover:bg-red-500 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Player List */}
          <div className="lg:col-span-1">
            <PlayerList 
              players={[currentPlayer]}
              currentTurn={currentPlayer.nickname}
            />
          </div>
          
          {/* Center - Jenga Tower */}
          <div className="lg:col-span-2">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Privacy Jenga Tower
              </h2>
              <p className="text-gray-600">
                Click on a block to remove it and learn about privacy!
              </p>
            </div>
            
            <JengaTower 
              blocks={mockGameService.getBlocks()}
              onBlockClick={handleBlockClick}
              isInteractive={isMyTurn}
              selectedBlockId={selectedBlock?.id}
            />
            
            {/* Start Game Button */}
            {currentPlayer?.isHost && (
              <div className="text-center mt-6">
                <button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center mx-auto space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Game</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Right Sidebar - Chat */}
          <div className="lg:col-span-1">
            <Chat 
              messages={chatMessages}
              onSendMessage={sendChatMessage}
              currentPlayerId={currentPlayer.nickname}
            />
          </div>
        </div>
      </main>

      {/* Content Modal */}
      <AnimatePresence>
        {showContentModal && selectedContent && (
          <ContentModal
            content={selectedContent}
            isOpen={showContentModal}
            onClose={() => {
              setShowContentModal(false);
              setSelectedContent(null);
            }}
            onQuizAnswer={handleQuizAnswer}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;
