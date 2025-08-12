import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Dice1, 
  Play, 
  Trophy,
  BarChart3,
  Infinity
} from 'lucide-react';
import { mockGameService } from '../services/mockGameService';
import { Block, Content, Player, GameState } from '../types';
import JengaTower from '../components/JengaTower';
import Chat from '../components/Chat';
import ContentModal from '../components/ContentModal';
import PlayerList from '../components/PlayerList';
import GameStats from '../components/GameStats';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // Initialize game state
      await mockGameService.startGame();
      
      // Get initial data
      const initialBlocks = mockGameService.getBlocks();
      const initialMockPlayers = mockGameService.getPlayers();
      const initialGameState = mockGameService.getGameState();
      
      // Convert MockPlayer to Player
      const initialPlayers: Player[] = initialMockPlayers.map(mockPlayer => ({
        nickname: mockPlayer.nickname,
        isHost: mockPlayer.id === '1', // First player is host
        score: mockPlayer.score,
        achievements: mockPlayer.achievements,
        highScore: mockPlayer.highScore,
        gamesPlayed: mockPlayer.gamesPlayed,
        totalPoints: mockPlayer.totalPoints,
        totalBlocksRemoved: mockPlayer.totalBlocksRemoved,
        correctAnswers: mockPlayer.correctAnswers,
        incorrectAnswers: mockPlayer.incorrectAnswers
      }));
      
      setBlocks(initialBlocks);
      setPlayers(initialPlayers);
      setGameState(initialGameState);
      
      // Create mock room if needed
      if (roomCode) {
        // Note: We don't need to store the room in state for single player
        // Room code is used for display purposes only
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  };

  const handleBlockClick = async (block: Block) => {
    if (gameState && !gameState.canPullFromLayers.includes(block.layer)) {
      alert(`You can only pull from layers: ${gameState.canPullFromLayers.join(', ')}`);
      return;
    }

    try {
      const result = await mockGameService.pickBlock(block.id);
      if (result) {
        setCurrentContent(result.content);
        setShowContentModal(true);
        setShowQuiz(result.content.quiz ? true : false);
        
        // Update game state
        setGameState(result.gameState);
        
        // Update blocks
        const updatedBlocks = mockGameService.getBlocks();
        setBlocks(updatedBlocks);
        
        // Check if game is over
        if (result.gameState.towerHeight <= 1) {
          setTimeout(() => {
            alert('Game Over! The tower has fallen!');
            handleNewGame();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to pick block:', error);
      alert(error instanceof Error ? error.message : 'Failed to pick block');
    }
  };

  const handleQuizAnswer = async (selectedAnswer: number) => {
    if (!currentContent) return;
    
    try {
      // Find the block that corresponds to the current content
      const block = blocks.find(b => b.content.id === currentContent.id);
      if (!block) return;
      
      const result = await mockGameService.answerQuiz(block.id, selectedAnswer);
      
      // Update game state
      setGameState(result.gameState);
      
      // Update players
      const updatedMockPlayers = mockGameService.getPlayers();
      const updatedPlayers: Player[] = updatedMockPlayers.map(mockPlayer => ({
        nickname: mockPlayer.nickname,
        isHost: mockPlayer.id === '1', // First player is host
        score: mockPlayer.score,
        achievements: mockPlayer.achievements,
        highScore: mockPlayer.highScore,
        gamesPlayed: mockPlayer.gamesPlayed,
        totalPoints: mockPlayer.totalPoints,
        totalBlocksRemoved: mockPlayer.totalBlocksRemoved,
        correctAnswers: mockPlayer.correctAnswers,
        incorrectAnswers: mockPlayer.incorrectAnswers
      }));
      setPlayers(updatedPlayers);
      
      // Close modal
      setShowContentModal(false);
      setShowQuiz(false);
      setCurrentContent(null);
      
      // Show result
      if (result.correct) {
        alert(`Correct! +${result.points} points`);
      } else {
        alert(`Incorrect! ${result.points} points`);
      }
      
    } catch (error) {
      console.error('Failed to answer quiz:', error);
    }
  };

  const handleDiceRoll = async () => {
    if (diceRolling) return;
    
    setDiceRolling(true);
    try {
      const result = await mockGameService.rollDice();
      
      // Update game state
      const updatedGameState = mockGameService.getGameState();
      setGameState(updatedGameState);
      
      // Show dice result
      setTimeout(() => {
        alert(`Dice: ${result.value}\nEffect: ${result.effect}`);
        setDiceRolling(false);
      }, 500);
      
    } catch (error) {
      console.error('Failed to roll dice:', error);
      setDiceRolling(false);
    }
  };

  const handleNewGame = () => {
    mockGameService.resetGame();
    initializeGame();
  };

  const handleEndlessMode = () => {
    mockGameService.startEndlessMode();
    initializeGame();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-300">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-teal-300">Privacy Jenga</h1>
                <p className="text-sm text-gray-400">Room: {roomCode || 'Local Game'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-gray-400">Score</div>
                <div className="text-xl font-bold text-teal-400">{gameState.currentScore}</div>
              </div>
              
              <button
                onClick={() => setShowGameStats(!showGameStats)}
                className="bitsacco-btn bitsacco-btn-secondary flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
              
              <button
                onClick={handleDiceRoll}
                disabled={diceRolling}
                className="bitsacco-btn bitsacco-btn-primary flex items-center gap-2"
              >
                {diceRolling ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Dice1 className="w-4 h-4" />
                )}
                Roll Dice
              </button>
            </div>
          </div>
          
          {/* Game Mode and Dice Info */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Mode:</span>
              <span className="px-3 py-1 bg-teal-600/20 border border-teal-400/30 rounded-full text-teal-300">
                {gameState.gameMode === 'endless' ? 'Endless Mode' : 'Classic Mode'}
              </span>
              
              <span className="text-gray-400">Tower:</span>
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-400/30 rounded-full text-blue-300">
                {gameState.towerHeight}/18 layers
              </span>
            </div>
            
            {gameState.diceResult > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Dice:</span>
                <span className="px-3 py-1 bg-purple-600/20 border border-purple-400/30 rounded-full text-purple-300">
                  {gameState.diceResult}
                </span>
                <span className="text-gray-400">Available layers: {gameState.canPullFromLayers.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Game Stats */}
          <div className="lg:col-span-1">
            <div className="bitsacco-card p-4 mb-6">
              <h3 className="text-lg font-semibold text-teal-300 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Game Controls
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleNewGame}
                  className="bitsacco-btn bitsacco-btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  New Game
                </button>
                
                <button
                  onClick={handleEndlessMode}
                  className="bitsacco-btn bitsacco-btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Infinity className="w-4 h-4" />
                  Endless Mode
                </button>
              </div>
            </div>
            
            {/* Game Stats Toggle */}
            {showGameStats && (
              <GameStats
                gameState={gameState}
                onNewGame={handleNewGame}
                onEndlessMode={handleEndlessMode}
              />
            )}
          </div>

          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="bitsacco-card p-6">
              <JengaTower
                blocks={blocks}
                onBlockClick={handleBlockClick}
                isInteractive={true}
                selectedBlockId={currentContent?.id}
                gameState={gameState}
              />
            </div>
          </div>

          {/* Right Sidebar - Players and Chat */}
          <div className="lg:col-span-1 space-y-6">
            {/* Player List */}
            <PlayerList
              players={players}
              currentTurn={gameState.currentPlayer?.nickname}
              currentPlayerId={gameState.currentPlayer?.nickname}
              gameState={gameState}
            />
            
            {/* Chat */}
            <Chat
              messages={[]}
              onSendMessage={() => {}}
              disabled={false}
              currentPlayerId={gameState.currentPlayer?.nickname}
            />
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal
        content={currentContent}
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setShowQuiz(false);
          setCurrentContent(null);
        }}
        onQuizAnswer={handleQuizAnswer}
        showQuiz={showQuiz}
        gameState={gameState}
      />
    </div>
  );
};

export default GamePage;
