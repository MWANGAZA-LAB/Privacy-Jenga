import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Infinity, HelpCircle, BookOpen, Dice1, ChevronDown, ChevronUp, Settings, Brain } from 'lucide-react';
import { mockGameService } from '../services/mockGameService';
import { Block, Content, Player, GameState } from '../types';
import JengaTower from '../components/JengaTower';
import ContentModal from '../components/ContentModal';
import PlayerList from '../components/PlayerList';
import GameStats from '../components/GameStats';
import GameTutorial from '../components/GameTutorial';
import GameHelp from '../components/GameHelp';

const GamePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room') || 'demo';
  
  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showDiceResult, setShowDiceResult] = useState(false);
  
  // UI State Management
  const [showGameControls, setShowGameControls] = useState(true);
  const [showPlayerInfo, setShowPlayerInfo] = useState(true);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        console.log('🎮 Initializing unified Privacy Jenga learning experience');
        
        await mockGameService.createRoom();
        
        // Start unified learning mode (tower resets when it falls)
        console.log('🧠 Starting Unified Learning Mode');
        await mockGameService.startEndlessMode(); // Use endless mode for continuous learning
        
        const mockPlayers = mockGameService.getPlayers();
        
        // Convert MockPlayer[] to Player[]
        const convertedPlayers: Player[] = mockPlayers.map(mockPlayer => ({
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

        setPlayers(convertedPlayers);
        
        const gameStarted = await mockGameService.startGame();
        if (gameStarted) {
          const newGameState = mockGameService.getGameState();
          console.log(`🎮 Game state initialized:`, newGameState);
          setGameState(newGameState);
          
          // Mark player as having played before
          const hasPlayedBefore = localStorage.getItem('privacy-jenga-has-played');
          if (!hasPlayedBefore) {
            localStorage.setItem('privacy-jenga-has-played', 'true');
          }
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();
  }, [roomCode]);

  // Enhanced dice roll with animations
  const handleDiceRoll = async () => {
    if (!gameState) return;
    
    setDiceRolling(true);
    setDiceResult(null);
    setShowDiceResult(false);
    
    try {
      // Simulate dice rolling animation
      const rollDuration = 2000; // 2 seconds
      const rollInterval = setInterval(() => {
        setDiceResult(Math.floor(Math.random() * 6) + 1);
      }, 100);
      
      setTimeout(async () => {
        clearInterval(rollInterval);
        
        const actualDiceResult = await mockGameService.rollDice();
        setDiceResult(actualDiceResult.value);
        
        // Update game state immediately after dice roll
        const newGameState = mockGameService.getGameState();
        setGameState(newGameState);
        
        // Show enhanced dice result
        setShowDiceResult(true);
        
        // Auto-hide after 3 seconds
        setTimeout(() => setShowDiceResult(false), 3000);
      }, rollDuration);
      
    } catch (error) {
      console.error('Failed to roll dice:', error);
    } finally {
      setTimeout(() => setDiceRolling(false), 2000);
    }
  };

  // Handle block click
  const handleBlockClick = async (block: Block) => {
    if (!gameState) return;
    
    // Check if block is in allowed layers
    const maxAllowedLayer = Array.isArray(gameState.canPullFromLayers) 
      ? Math.max(...gameState.canPullFromLayers)
      : gameState.canPullFromLayers;
    
    if (block.layer > maxAllowedLayer) {
      alert(`You can only pull from layers 1-${maxAllowedLayer}. Roll the dice to change access!`);
      return;
    }

    try {
      const result = await mockGameService.pickBlock(block.id);
      if (result) {
        setCurrentContent(result.content);
        setShowContentModal(true);
        
        // Handle tower reset for continuous learning
        if (result.gameOver) {
          handleTowerReset();
        }
        
        // Update game state
        setGameState(result.gameState);
      }
    } catch (error) {
      console.error('Failed to pick block:', error);
    }
  };

  // Handle tower reset for continuous learning
  const handleTowerReset = async () => {
    try {
      await mockGameService.resetTower();
      const newGameState = mockGameService.getGameState();
      setGameState(newGameState);
      
      alert('🔄 Tower Reset!\n\nYour score has been preserved. Continue learning with a fresh tower!');
    } catch (error) {
      console.error('Failed to reset tower:', error);
    }
  };



  // Handle new game
  const handleNewGame = async () => {
    try {
      await mockGameService.resetGame();
      const newGameState = mockGameService.getGameState();
      setGameState(newGameState);
      setShowContentModal(false);
      setCurrentContent(null);
      
      alert('🎮 New learning session started!\n\nFocus on mastering privacy concepts and improving your skills!');
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = async (answerIndex: number) => {
    if (!currentContent || !gameState) return;
    
    try {
      const result = await mockGameService.answerQuiz(currentContent.id, answerIndex);
      
      // Update game state
      const newGameState = mockGameService.getGameState();
      setGameState(newGameState);
      
      // Update players
      const updatedPlayers = mockGameService.getPlayers();
      const convertedPlayers: Player[] = updatedPlayers.map(mockPlayer => ({
        nickname: mockPlayer.nickname,
        isHost: mockPlayer.id === '1',
        score: mockPlayer.score,
        achievements: mockPlayer.achievements,
        highScore: mockPlayer.highScore,
        gamesPlayed: mockPlayer.gamesPlayed,
        totalPoints: mockPlayer.totalPoints,
        totalBlocksRemoved: mockPlayer.totalBlocksRemoved,
        correctAnswers: mockPlayer.correctAnswers,
        incorrectAnswers: mockPlayer.incorrectAnswers
      }));
      setPlayers(convertedPlayers);
      
      setShowContentModal(false);
      setCurrentContent(null);
      
      // Show enhanced result
      if (result.correct) {
        alert(`✅ Correct! +${result.points} points\n🎉 Great job learning about privacy!`);
      } else {
        alert(`❌ Incorrect. The correct answer was: ${currentContent.quiz?.choices[currentContent.quiz.correctIndex]}\n💡 Keep learning - every mistake makes you stronger!`);
      }
    } catch (error) {
      console.error('Failed to answer quiz:', error);
    }
  };

  // Handle tutorial start
  const handleTutorialStart = () => {
    setShowTutorial(true);
  };

  // Handle help open
  const handleHelpOpen = () => {
    setShowHelp(true);
  };

  // Handle stats open
  const handleStatsOpen = () => {
    setShowGameStats(true);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-teal-400 text-lg font-semibold">Loading Game...</div>
          <div className="text-gray-400 text-sm">Preparing your privacy adventure</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Header - Cleaner and More Organized */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </a>
            <div className="text-gray-400">|</div>
            <div className="text-gray-300">
              Room: <span className="text-teal-400 font-mono">{roomCode}</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Brain className="w-4 h-4" />
              Learning Mode
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleHelpOpen}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
            <button
              onClick={handleTutorialStart}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Tutorial
            </button>
            <button
              onClick={handleStatsOpen}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Stats
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Dice Result Modal */}
      {showDiceResult && diceResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 border-2 border-teal-400 shadow-2xl text-center animate-pulse">
            <div className="text-6xl mb-4">🎲</div>
            <div className="text-4xl font-bold text-teal-400 mb-2">{diceResult}</div>
            <div className="text-white text-lg mb-4">
              {diceResult === 1 && "Safe Zone (Layers 1-3)"}
              {diceResult === 2 && "Steady (Layers 1-6)"}
              {diceResult === 3 && "Risky (Layers 1-9)"}
              {diceResult === 4 && "Danger Zone (Layers 1-12)"}
              {diceResult === 5 && "Extreme (Layers 1-15)"}
              {diceResult === 6 && "Ultimate Challenge (All Layers)"}
            </div>
            <div className="text-gray-300 text-sm">
              New layer access granted!
            </div>
          </div>
        </div>
      )}



      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Left Sidebar - Consolidated Game Controls */}
          <div className="w-80 space-y-4">
            {/* Enhanced Dice Roll Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-1">🎲 Roll the Dice</h3>
                <p className="text-teal-100 text-sm">Change your layer access</p>
              </div>
              
              <div className="p-4">
                <button
                  onClick={handleDiceRoll}
                  disabled={diceRolling}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    diceRolling 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600 hover:scale-105 active:scale-95'
                  }`}
                >
                  {diceRolling ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rolling...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Dice1 className="w-5 h-5" />
                      Roll Dice
                    </div>
                  )}
                </button>

                {/* Current Dice Result Display */}
                {gameState.diceResult > 0 && (
                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="text-xs text-gray-400 mb-1">Current Dice</div>
                    <div className="text-white font-bold text-lg">
                      {gameState.diceResult} - {gameState.diceResult === 1 ? "Safe Zone" :
                                             gameState.diceResult === 2 ? "Steady" :
                                             gameState.diceResult === 3 ? "Risky" :
                                             gameState.diceResult === 4 ? "Danger" :
                                             gameState.diceResult === 5 ? "Extreme" : "Ultimate"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Consolidated Game Controls Panel */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowGameControls(!showGameControls)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-left hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-between text-white font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Game Controls
                </div>
                {showGameControls ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showGameControls && (
                <div className="p-4 space-y-4">
                  {/* Game Mode */}
                  <div className={`text-center p-3 rounded-lg border ${
                    gameState.gameMode === 'endless' 
                      ? 'bg-purple-500/10 border-purple-400/30' 
                      : 'bg-blue-500/10 border-blue-400/30'
                  }`}>
                    <div className={`text-lg font-semibold mb-1 ${
                      gameState.gameMode === 'endless' ? 'text-purple-300' : 'text-blue-300'
                    }`}>
                      Game Mode
                    </div>
                    <div className="text-white text-2xl font-bold">
                      {gameState.gameMode === 'endless' ? (
                        <span className="flex items-center justify-center gap-2 text-purple-400">
                          <Infinity className="w-6 h-6" />
                          Endless
                        </span>
                      ) : (
                        <span className="text-blue-400">Classic</span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm mt-2">
                      {gameState.gameMode === 'endless' 
                        ? 'Tower resets after collapse' 
                        : 'Game ends when tower falls'}
                    </div>
                  </div>

                  {/* Player Stats */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-teal-300 mb-3">Player Stats</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-gray-700/50 rounded border border-gray-600">
                        <div className="text-gray-400 text-xs">Score</div>
                        <div className="text-white font-bold text-lg">{gameState.currentScore}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/50 rounded border border-gray-600">
                        <div className="text-gray-400 text-xs">Blocks</div>
                        <div className="text-white font-bold text-lg">{gameState.blocksRemoved}/54</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/50 rounded border border-gray-600">
                        <div className="text-gray-400 text-xs">Height</div>
                        <div className="text-white font-bold text-lg">{gameState.towerHeight}/18</div>
                      </div>
                      <div className="text-center p-2 bg-gray-700/50 rounded border border-gray-600">
                        <div className="text-gray-400 text-xs">Learning</div>
                        <div className="text-white font-bold text-sm">Continuous</div>
                      </div>
                    </div>
                  </div>


                </div>
              )}
            </div>
          </div>

          {/* Main Game Area - Centered and Clean */}
          <div className="flex-1">
            <JengaTower
              blocks={mockGameService.getBlocks()}
              onBlockClick={handleBlockClick}
              gameState={gameState}
              selectedBlockId={currentContent?.id}
            />
          </div>

          {/* Right Sidebar - Consolidated Player Information */}
          <div className="w-80">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowPlayerInfo(!showPlayerInfo)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-left hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center justify-between text-white font-semibold"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Player Information
                </div>
                {showPlayerInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showPlayerInfo && (
                <div className="p-4">
                  <PlayerList
                    players={players}
                    currentTurn={players[0]?.nickname}
                    currentPlayerId={players[0]?.nickname}
                    gameState={gameState}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      {showContentModal && currentContent && (
        <ContentModal
          content={currentContent}
          isOpen={showContentModal}
          onClose={() => setShowContentModal(false)}
          onQuizAnswer={handleQuizAnswer}
          showQuiz={!!currentContent.quiz}
          gameState={gameState}
        />
      )}

      {showGameStats && (
        <GameStats
          gameState={gameState}
          onNewGame={handleNewGame}
        />
      )}

      {showTutorial && (
        <GameTutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          onStartTutorial={() => setShowTutorial(false)}
          onStartGame={() => setShowTutorial(false)}
        />
      )}

      {showHelp && (
        <GameHelp
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
};

export default GamePage;
