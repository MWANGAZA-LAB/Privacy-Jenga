import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Copy, 
  Share2, 
  Settings, 
  LogOut, 
  Play, 
  Timer,
  Trophy,
  Users
} from 'lucide-react';

import { useSocket } from '@/hooks/useSocket';
import JengaTower from '@/components/JengaTower';
import ContentModal from '@/components/ContentModal';
import PlayerList from '@/components/PlayerList';
import Chat from '@/components/Chat';
import { Block } from '@/types';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    room,
    currentPlayer,
    chatMessages,
    selectedContent,
    isMyTurn,
    turnTimeLeft,
    leaveRoom,
    startGame,
    pickBlock,
    answerQuiz,
    sendChatMessage,
    setSelectedContent,
    connected
  } = useSocket();

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect if not in a room
  useEffect(() => {
    if (!room && connected) {
      navigate('/');
    }
  }, [room, connected, navigate]);

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
      toast.error("It's not your turn or block is unavailable");
      return;
    }

    setSelectedBlock(block);
    
    try {
      await pickBlock(block.id);
    } catch (error) {
      toast.error('Failed to pick block');
    }
  };

  const handleQuizAnswer = async (selectedIndex: number) => {
    if (selectedBlock && selectedContent) {
      try {
        await answerQuiz(selectedBlock.id, selectedIndex);
      } catch (error) {
        toast.error('Failed to submit quiz answer');
      }
    }
  };

  const handleStartGame = async () => {
    if (!currentPlayer?.isHost) {
      toast.error('Only the host can start the game');
      return;
    }

    try {
      await startGame();
    } catch (error) {
      toast.error('Failed to start game');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast.success('Room code copied!');
  };

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Privacy Jenga game!',
        text: `Room code: ${room.code}`,
        url: window.location.href
      });
    } else {
      copyRoomCode();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gameStats = {
    blocksRemoved: room.blocks.filter(b => b.removed).length,
    totalBlocks: room.blocks.length,
    topPlayer: room.players.reduce((top, player) => 
      player.points > top.points ? player : top, room.players[0]
    )
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Room Info */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Privacy Jenga
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Room:</span>
                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm font-semibold">
                  {room.code}
                </code>
                <button
                  onClick={copyRoomCode}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy room code"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={shareRoom}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Share room"
                >
                  <Share2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Game Status */}
            <div className="flex items-center gap-4">
              {room.gameState === 'playing' && (
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatTime(turnTimeLeft)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {room.players.length}/{room.settings.maxPlayers}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="btn-secondary text-sm"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Status Banner */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {room.gameState === 'lobby' && 'Waiting for players...'}
                    {room.gameState === 'playing' && (
                      isMyTurn ? "It's your turn!" : `${room.players.find(p => p.id === room.currentTurn)?.nickname}&apos;s turn`
                    )}
                    {room.gameState === 'finished' && 'Game finished!'}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Blocks: {gameStats.blocksRemoved}/{gameStats.totalBlocks}</span>
                    <span>Leader: {gameStats.topPlayer.nickname} ({gameStats.topPlayer.points} pts)</span>
                  </div>
                </div>

                {/* Game Actions */}
                <div className="flex items-center gap-2">
                  {room.gameState === 'lobby' && currentPlayer.isHost && (
                    <button
                      onClick={handleStartGame}
                      disabled={room.players.length < 2}
                      className="btn-success"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Game
                    </button>
                  )}
                  
                  {room.gameState === 'finished' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">
                        {room.winner === currentPlayer.id ? 'You won!' : 'Game over'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Turn Timer */}
            {room.gameState === 'playing' && isMyTurn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-primary-50 border-primary-200"
              >
                <div className="flex items-center justify-center gap-3">
                  <Timer className="w-5 h-5 text-primary-600" />
                  <span className="text-lg font-semibold text-primary-900">
                    Your turn - {formatTime(turnTimeLeft)} remaining
                  </span>
                </div>
                <div className="mt-3 bg-primary-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-600"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(turnTimeLeft / room.settings.turnTimeoutSeconds) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Jenga Tower */}
            <div className="card p-0 overflow-hidden">
              <JengaTower
                blocks={room.blocks}
                onBlockClick={handleBlockClick}
                isInteractive={room.gameState === 'playing' && isMyTurn}
                selectedBlockId={selectedBlock?.id}
              />
            </div>

            {/* Game Instructions */}
            {room.gameState === 'lobby' && (
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  How to Play
                </h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Take turns removing blocks from the tower</li>
                  <li>• Each block contains a privacy lesson and quiz</li>
                  <li>• Answer quizzes correctly to earn points</li>
                  <li>• Don&apos;t let the tower collapse!</li>
                  <li>• Learn privacy best practices while having fun</li>
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player List */}
            <PlayerList
              players={room.players}
              currentTurn={room.currentTurn}
              currentPlayerId={currentPlayer.id}
            />

            {/* Chat */}
            {room.settings.allowChat && (
              <Chat
                messages={chatMessages}
                onSendMessage={sendChatMessage}
                disabled={room.gameState !== 'playing'}
                currentPlayerId={currentPlayer.id}
              />
            )}

            {/* Game Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Game Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Blocks Removed</span>
                  <span className="font-medium">{gameStats.blocksRemoved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Blocks</span>
                  <span className="font-medium">{gameStats.totalBlocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {Math.round((gameStats.blocksRemoved / gameStats.totalBlocks) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Content Modal */}
      <ContentModal
        content={selectedContent}
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setSelectedContent(null);
          setSelectedBlock(null);
        }}
        onQuizAnswer={handleQuizAnswer}
        showQuiz={true}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Room Settings
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Players</span>
                  <span>{room.settings.maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Turn Timeout</span>
                  <span>{room.settings.turnTimeoutSeconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chat Enabled</span>
                  <span>{room.settings.allowChat ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="capitalize">{room.settings.difficulty}</span>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="btn-primary w-full mt-6"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;
