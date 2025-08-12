import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Infinity, HelpCircle, BookOpen } from 'lucide-react';
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

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        await mockGameService.createRoom();
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
          setGameState(newGameState);
        }
        
        // Check if this is the first time playing
        const hasPlayedBefore = localStorage.getItem('privacy-jenga-has-played');
        if (!hasPlayedBefore) {
          setShowTutorial(true);
          localStorage.setItem('privacy-jenga-has-played', 'true');
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();
  }, [roomCode]);

  // Handle dice roll
  const handleDiceRoll = async () => {
    if (!gameState) return;
    
    setDiceRolling(true);
    try {
      const diceResult = await mockGameService.rollDice();
      
      // Update game state
      const newGameState = mockGameService.getGameState();
      setGameState(newGameState);
      
      // Show dice result alert
      let message = '';
      switch (diceResult.value) {
        case 1: message = '🎲 Dice: 1 - Safe Zone (Layers 1-3)'; break;
        case 2: message = '🎲 Dice: 2 - Steady (Layers 1-6)'; break;
        case 3: message = '🎲 Dice: 3 - Risky (Layers 1-9)'; break;
        case 4: message = '🎲 Dice: 4 - Danger Zone (Layers 1-12)'; break;
        case 5: message = '🎲 Dice: 5 - Extreme (Layers 1-15)'; break;
        case 6: message = '🎲 Dice: 6 - Ultimate Challenge (All Layers)'; break;
        default: message = '🎲 Dice rolled!';
      }
      alert(message);
    } catch (error) {
      console.error('Failed to roll dice:', error);
    } finally {
      setDiceRolling(false);
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
      }
    } catch (error) {
      console.error('Failed to pick block:', error);
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
      
      // Show result
      if (result.correct) {
        alert(`✅ Correct! +${result.points} points`);
      } else {
        alert(`❌ Incorrect. The correct answer was: ${currentContent.quiz?.choices[currentContent.quiz.correctIndex]}`);
      }
    } catch (error) {
      console.error('Failed to answer quiz:', error);
    }
  };

  // Handle new game
  const handleNewGame = async () => {
    try {
      mockGameService.resetGame();
      const gameStarted = await mockGameService.startGame();
      if (gameStarted) {
        const newGameState = mockGameService.getGameState();
        setGameState(newGameState);
      }
      setShowContentModal(false);
      setCurrentContent(null);
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  // Handle endless mode
  const handleEndlessMode = async () => {
    try {
      mockGameService.resetGame();
      const gameStarted = await mockGameService.startGame();
      if (gameStarted) {
        const newGameState = mockGameService.getGameState();
        setGameState(newGameState);
      }
      setShowContentModal(false);
      setCurrentContent(null);
    } catch (error) {
      console.error('Failed to start endless mode:', error);
    }
  };

  // Handle tutorial start
  const handleStartTutorial = () => {
    // Tutorial logic can be implemented here
    console.log('Starting interactive tutorial...');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </a>
              <div className="h-6 w-px bg-gray-600"></div>
              <div className="text-sm text-gray-400">
                Room: <span className="text-teal-400 font-mono">{roomCode}</span>
              </div>
            </div>

            {/* Center - Game Mode */}
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-teal-500/20 border border-teal-400/50 rounded-full">
                <span className="text-teal-300 text-sm font-medium">
                  {gameState.gameMode === 'endless' ? 'Endless Mode' : 'Classic Mode'}
                </span>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Help Button */}
              <button
                onClick={() => setShowHelp(true)}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
                title="Game Help & Rules"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
              
              {/* Tutorial Button */}
              <button
                onClick={() => setShowTutorial(true)}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
                title="Game Tutorial"
              >
                <BookOpen className="w-4 h-4" />
                Tutorial
              </button>
              
              {/* Game Stats Toggle */}
              <button
                onClick={() => setShowGameStats(!showGameStats)}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
                title="Game Statistics"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex">
        {/* Left Sidebar - Game Stats */}
        {showGameStats && (
          <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-gray-700 overflow-y-auto">
            <GameStats
              gameState={gameState}
              onNewGame={handleNewGame}
              onEndlessMode={handleEndlessMode}
            />
          </div>
        )}

        {/* Center - Jenga Tower */}
        <div className="flex-1 flex flex-col">
          {/* Game Controls */}
          <div className="p-4 bg-black/10 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Dice Roll */}
                <button
                  onClick={handleDiceRoll}
                  disabled={diceRolling}
                  className="bitsacco-btn bitsacco-btn-primary flex items-center gap-2"
                >
                  <div className={`w-5 h-5 ${diceRolling ? 'animate-spin' : ''}`}>
                    ⚄
                  </div>
                  {diceRolling ? 'Rolling...' : 'Roll Dice'}
                </button>

                {/* Current Dice Result */}
                {gameState.diceResult && (
                  <div className="px-3 py-2 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="text-xs text-gray-400">Current Dice</div>
                    <div className="text-white font-bold">
                      {gameState.diceResult} - Available Layers
                    </div>
                  </div>
                )}
              </div>

              {/* Game Mode Display */}
              <div className="text-right">
                <div className="text-sm text-gray-400">Game Mode</div>
                <div className="text-white font-semibold">
                  {gameState.gameMode === 'endless' ? (
                    <span className="flex items-center gap-1">
                      <Infinity className="w-4 h-4" />
                      Endless
                    </span>
                  ) : (
                    'Classic'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Jenga Tower */}
          <div className="flex-1 p-4">
            <JengaTower
              blocks={mockGameService.getBlocks()}
              onBlockClick={handleBlockClick}
              gameState={gameState}
              selectedBlockId={currentContent?.id}
            />
          </div>
        </div>

        {/* Right Sidebar - Player List */}
        <div className="w-80 bg-black/20 backdrop-blur-sm border-l border-gray-700 overflow-y-auto">
          <PlayerList
            players={players}
            gameState={gameState}
            currentTurn={gameState.currentPlayer?.nickname}
          />
        </div>
      </main>

      {/* Content Modal */}
      {showContentModal && currentContent && (
        <ContentModal
          content={currentContent}
          isOpen={showContentModal}
          onClose={() => setShowContentModal(false)}
          onQuizAnswer={handleQuizAnswer}
          gameState={gameState}
        />
      )}

      {/* Tutorial Modal */}
      <GameTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartTutorial={handleStartTutorial}
      />

      {/* Help Modal */}
      <GameHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};

export default GamePage;
