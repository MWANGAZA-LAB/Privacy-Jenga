import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Brain, ChevronUp, ChevronDown, Dice1, Trophy, BookOpen, HelpCircle, BarChart3, ArrowLeft } from 'lucide-react';
import JengaTower from '../components/JengaTower';
import ContentModal from '../components/ContentModal';
import GameHelp from '../components/GameHelp';
import GameTutorial from '../components/GameTutorial';
import GameStats from '../components/GameStats';
import MockGameService from '../services/mockGameService';
import { Block, Content, GameState } from '../types';

const GamePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [isInteractive, setIsInteractive] = useState(true);

  const mockGameService = useMemo(() => new MockGameService(), []);

  const initializeGame = useCallback(async () => {
    try {
      await mockGameService.startLearningMode();
      const state = mockGameService.getGameState();
      if (state) {
        setGameState(state);
        setIsInteractive(true);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }, [mockGameService]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleTowerReset = useCallback(async () => {
    if (!gameState) return;
    
    await mockGameService.resetGame();
    const newState = mockGameService.getGameState();
    if (newState) {
      setGameState(newState);
      alert('Tower reset! New learning session started.');
    }
  }, [gameState, mockGameService]);

  const handleBlockClick = useCallback(async (block: Block) => {
    if (!gameState || !isInteractive) return;

    try {
      const result = await mockGameService.pickBlock(block.id);
      
      if (result.success && result.content) {
        setCurrentContent(result.content);
        setShowContentModal(true);
        setSelectedBlockId(block.id);
        
        // Update game state
        setGameState(result.gameState);
        
        // Check if tower needs reset
        if (mockGameService.calculateTowerStability() < 20) {
          handleTowerReset();
        }
      }
    } catch (error) {
      console.error('Error picking block:', error);
    }
  }, [gameState, isInteractive, mockGameService, handleTowerReset]);

  const handleDiceRoll = useCallback(async () => {
    if (!gameState || !isInteractive) return;

    try {
      await mockGameService.rollDice();
      const updatedState = mockGameService.getGameState();
      if (updatedState) {
        setGameState(updatedState);
      }
    } catch (error) {
      console.error('Error rolling dice:', error);
    }
  }, [gameState, isInteractive, mockGameService]);

  const handleQuizAnswer = async (selectedAnswer: number) => {
    if (!selectedBlockId || !currentContent) return;

    try {
      const result = await mockGameService.answerQuiz(selectedBlockId, selectedAnswer);
      
      if (result.correct) {
        alert(`Correct! +${result.points} points. ${result.explanation}`);
      } else {
        alert(`Incorrect. ${result.explanation}`);
      }

      // Update game state
      const updatedState = mockGameService.getGameState();
      if (updatedState) {
        setGameState(updatedState);
      }

      setShowContentModal(false);
      setCurrentContent(null);
      setSelectedBlockId(undefined);
    } catch (error) {
      console.error('Error answering quiz:', error);
    }
  };

  const handleNewGame = async () => {
    try {
      await mockGameService.resetGame();
      const newState = mockGameService.getGameState();
      if (newState) {
        setGameState(newState);
        setShowStats(false);
        alert('New learning session started!');
      }
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleStartTutorial = () => {
    setShowTutorial(false);
    setShowHelp(true);
  };

  const handleStartGame = () => {
    setShowTutorial(false);
    setIsInteractive(true);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-teal-400 text-lg">Loading Privacy Jenga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="bitsacco-btn-secondary p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-teal-400" />
              <div>
                <h1 className="text-xl font-bold text-teal-300">Privacy Jenga</h1>
                <p className="text-sm text-gray-400">Learning Mode</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">
                {gameState.currentScore}
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {gameState.towerHeight}/18
              </div>
              <div className="text-xs text-gray-400">Layers</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {gameState.blocksRemoved}/54
              </div>
              <div className="text-xs text-gray-400">Removed</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bitsacco-btn-secondary p-2"
              title="Game Statistics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="bitsacco-btn-secondary p-2"
              title="Game Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="bitsacco-btn-secondary p-2"
              title="Tutorial"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Game Information */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {/* Game Information */}
          <div className="bitsacco-panel p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
              Game Information
              <button onClick={() => setShowGameInfo(!showGameInfo)} className="text-gray-400 hover:text-white">
                {showGameInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </h3>
            {showGameInfo && (
              <div className="space-y-4">
                {/* Current Player */}
                <div className="text-center p-3 rounded-lg border bg-teal-500/10 border-teal-400/30">
                  <div className="text-lg font-semibold mb-1 text-teal-300">
                    Current Player
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {gameState.currentPlayer.nickname}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Learning privacy concepts</p>
                </div>

                {/* Dice Result */}
                {gameState.diceResult > 0 && (
                  <div className="text-center p-3 rounded-lg border bg-blue-500/10 border-blue-400/30">
                    <div className="text-lg font-semibold mb-1 text-blue-300">
                      Dice Result
                    </div>
                    <div className="text-white text-4xl font-bold">
                      <Dice1 className="w-12 h-12 mx-auto mb-2 text-blue-400" />
                      {gameState.diceResult}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Available layers: {gameState.canPullFromLayers.join(', ')}</p>
                  </div>
                )}

                {/* Tower Stability */}
                <div className="text-center p-3 rounded-lg border bg-yellow-500/10 border-yellow-400/30">
                  <div className="text-lg font-semibold mb-1 text-yellow-300">
                    Tower Stability
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {mockGameService.calculateTowerStability().toFixed(0)}%
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {mockGameService.calculateTowerStability() > 70 ? 'Stable' : 
                     mockGameService.calculateTowerStability() > 40 ? 'Warning' : 'Danger'}
                  </p>
                </div>

                {/* Quick Help Toggle */}
                <button
                  onClick={() => setShowQuickHelp(!showQuickHelp)}
                  className="bitsacco-btn-secondary w-full p-3"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  {showQuickHelp ? 'Hide Quick Help' : 'Show Quick Help'}
                </button>

                {showQuickHelp && (
                  <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-teal-300 mb-2">Quick Tips:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Roll dice to determine available layers</li>
                      <li>• Click blocks to learn privacy concepts</li>
                      <li>• Answer quizzes correctly for bonus points</li>
                      <li>• Watch tower stability indicator</li>
                      <li>• Tower resets automatically when unstable</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="bitsacco-panel p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
              Game Controls
              <button onClick={() => setShowControls(!showControls)} className="text-gray-400 hover:text-white">
                {showControls ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </h3>
            {showControls && (
              <div className="space-y-4">
                {/* Learning Experience */}
                <div className="text-center p-3 rounded-lg border bg-teal-500/10 border-teal-400/30">
                  <div className="text-lg font-semibold mb-1 text-teal-300">
                    Learning Experience
                  </div>
                  <div className="text-white text-2xl font-bold">
                    <span className="flex items-center justify-center gap-2 text-teal-400">
                      <Brain className="w-6 h-6" />
                      Continuous
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Tower resets for uninterrupted learning</p>
                </div>

                {/* Dice Roll */}
                <button
                  onClick={handleDiceRoll}
                  disabled={!isInteractive}
                  className="bitsacco-btn-primary w-full p-4 text-lg font-semibold"
                >
                  <Dice1 className="w-6 h-6 mr-2" />
                  Roll Dice
                </button>

                {/* New Game */}
                <button
                  onClick={handleNewGame}
                  className="bitsacco-btn-secondary w-full p-3"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  New Learning Session
                </button>

                {/* Game Stats */}
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="bitsacco-btn-secondary w-full p-3"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Statistics
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center - 3D Tower */}
        <div className="flex-1 relative">
          <JengaTower
            blocks={mockGameService.getAllBlocks()}
            onBlockClick={handleBlockClick}
            selectedBlockId={selectedBlockId}
            gameState={gameState}
          />
        </div>
      </div>

      {/* Modals */}
      <ContentModal
        content={currentContent}
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false);
          setCurrentContent(null);
          setSelectedBlockId(undefined);
        }}
        onQuizAnswer={handleQuizAnswer}
        showQuiz={!!currentContent?.quiz}
        gameState={gameState}
      />

      <GameHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <GameTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartTutorial={handleStartTutorial}
        onStartGame={handleStartGame}
      />

      <GameStats
        gameState={gameState}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

export default GamePage;
