import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Brain, ChevronUp, ChevronDown, Dice1, Trophy, BookOpen, HelpCircle, BarChart3, ArrowLeft, Gamepad2 } from 'lucide-react';
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
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [isInteractive, setIsInteractive] = useState(true);

  // Fix: Memoize the service instance to prevent recreation on every render
  const mockGameService = useMemo(() => new MockGameService(), []);

  // Fix: Memoize the initializeGame function with stable dependencies
  const initializeGame = useCallback(async () => {
    try {
      console.log('Initializing game...');
      await mockGameService.startLearningMode();
      const state = mockGameService.getGameState();
      console.log('Game state after initialization:', state);
      
      if (state) {
        setGameState(state);
        setIsInteractive(true);
        console.log('Game initialized successfully');
      } else {
        console.error('Failed to get game state after initialization');
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }, [mockGameService]);

  // Fix: Use useEffect with stable dependencies to prevent infinite loops
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Fix: Memoize handleTowerReset with stable dependencies
  const handleTowerReset = useCallback(async () => {
    if (!gameState) return;
    
    await mockGameService.resetGame();
    const newState = mockGameService.getGameState();
    if (newState) {
      setGameState(newState);
      alert('Tower reset! New learning session started.');
    }
  }, [gameState, mockGameService]);

  // Fix: Memoize handleBlockClick with stable dependencies
  const handleBlockClick = useCallback(async (block: Block) => {
    if (!gameState || !isInteractive) {
      console.log('Block click blocked:', {
        hasGameState: !!gameState,
        isInteractive,
        blockId: block.id,
        blockType: block.type,
        blockLayer: block.layer
      });
      return;
    }

    try {
      console.log('🎯 Block clicked:', {
        blockId: block.id,
        blockType: block.type,
        blockLayer: block.layer,
        canPullFromLayers: gameState.canPullFromLayers,
        isInteractive,
        gameState: {
          blocksRemoved: gameState.blocksRemoved,
          currentScore: gameState.currentScore,
          diceResult: gameState.diceResult
        }
      });

      // Check if block is in an accessible layer
      if (!gameState.canPullFromLayers.includes(block.layer)) {
        console.log('❌ Block not accessible:', {
          blockLayer: block.layer,
          accessibleLayers: gameState.canPullFromLayers
        });
        alert(`Cannot remove this block from layer ${block.layer}. Available layers: ${gameState.canPullFromLayers.join(', ')}`);
        return;
      }

      const result = await mockGameService.pickBlock(block.id);
      console.log('📦 Pick block result:', result);
      
      if (result.success && result.content) {
        console.log('✅ Block picked successfully:', {
          contentTitle: result.content.title,
          contentCategory: result.content.category,
          points: result.content.points
        });
        
        setCurrentContent(result.content);
        setShowContentModal(true);
        setSelectedBlockId(block.id);
        
        // Update game state
        setGameState(result.gameState);
        
        // Check if tower needs reset
        if (mockGameService.calculateTowerStability() < 20) {
          console.log('⚠️ Tower becoming unstable, resetting...');
          handleTowerReset();
        }
      } else {
        console.log('❌ Block pick failed:', result);
        alert('Cannot remove this block. Make sure you\'ve rolled the dice and the block is in an available layer.');
      }
    } catch (error) {
      console.error('💥 Error picking block:', error);
      alert('Error removing block. Please try again.');
    }
  }, [gameState, isInteractive, mockGameService, handleTowerReset]);

  // Fix: Memoize handleDiceRoll with stable dependencies
  const handleDiceRoll = useCallback(async () => {
    if (!gameState || !isInteractive) {
      console.log('Dice roll blocked - gameState:', !!gameState, 'isInteractive:', isInteractive);
      return;
    }

    try {
      console.log('Rolling dice...');
      const result = await mockGameService.rollDice();
      console.log('Dice roll result:', result);
      
      const updatedState = mockGameService.getGameState();
      if (updatedState) {
        setGameState(updatedState);
        console.log('Game state updated after dice roll');
      } else {
        console.error('Failed to get updated game state after dice roll');
      }
    } catch (error) {
      console.error('Error rolling dice:', error);
      alert('Error rolling dice. Please try again.');
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
        setShowStats(false); // Ensure stats panel is closed
        setShowContentModal(false); // Ensure content modal is closed
        setCurrentContent(null);
        setSelectedBlockId(undefined);
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

  // Fix: Add a function to properly close the stats panel
  const handleCloseStats = useCallback(() => {
    console.log('Closing stats panel');
    setShowStats(false);
  }, []);

  // Fix: Add a function to properly open the stats panel
  const handleOpenStats = useCallback(() => {
    console.log('Opening stats panel');
    setShowStats(true);
  }, []);

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
              onClick={handleOpenStats}
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
        {/* Left Panel - Game Information (Reduced width for better proportions) */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          {/* Game Information */}
          <div className="bitsacco-panel p-3">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
              Game Information
              <button onClick={() => setShowGameInfo(!showGameInfo)} className="text-gray-400 hover:text-white">
                {showGameInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </h3>
            {showGameInfo && (
              <div className="space-y-3">
                {/* Current Player */}
                <div className="text-center p-2 rounded-lg border bg-teal-500/10 border-teal-400/30">
                  <div className="text-sm font-semibold mb-1 text-teal-300">
                    Current Player
                  </div>
                  <div className="text-white text-lg font-bold">
                    {gameState.currentPlayer.nickname}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">Learning privacy concepts</p>
                </div>

                {/* Dice Result */}
                {gameState.diceResult > 0 ? (
                  <div className="text-center p-2 rounded-lg border bg-blue-500/10 border-blue-400/30">
                    <div className="text-sm font-semibold mb-1 text-blue-300">
                      Dice Result
                    </div>
                    <div className="text-white text-2xl font-bold">
                      <Dice1 className="w-8 h-8 mx-auto mb-1 text-blue-400" />
                      {gameState.diceResult}
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Layers: {gameState.canPullFromLayers.join(', ')}</p>
                  </div>
                ) : (
                  <div className="text-center p-2 rounded-lg border bg-gray-500/10 border-gray-400/30">
                    <div className="text-sm font-semibold mb-1 text-gray-300">
                      Game Status
                    </div>
                    <div className="text-white text-lg font-bold">
                      Ready to Start
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Roll dice to begin</p>
                  </div>
                )}

                {/* Tower Stability */}
                <div className="text-center p-2 rounded-lg border bg-yellow-500/10 border-yellow-400/30">
                  <div className="text-sm font-semibold mb-1 text-yellow-300">
                    Tower Status
                  </div>
                  <div className="text-white text-xl font-bold">
                    {gameState.blocksRemoved === 0 ? '100%' : mockGameService.calculateTowerStability().toFixed(0) + '%'}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {gameState.blocksRemoved === 0 ? 'Perfect' : 
                     mockGameService.calculateTowerStability() > 70 ? 'Stable' : 
                     mockGameService.calculateTowerStability() > 40 ? 'Warning' : 'Danger'}
                  </p>
                </div>

                {/* Block Accessibility Status */}
                {gameState.diceResult > 0 && (
                  <div className="bitsacco-card p-3 m-3">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <ChevronDown className="w-5 h-5 text-green-400" />
                      Accessible Layers
                    </h3>
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="text-green-400 text-sm font-semibold mb-2">
                          Available: {gameState.canPullFromLayers.length} layers
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {gameState.canPullFromLayers.map((layer) => (
                            <div key={layer} className="w-6 h-6 bg-green-500/20 border border-green-400/40 rounded text-xs text-green-300 flex items-center justify-center">
                              {layer}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 text-center mt-2">
                        💡 Click on blocks in these layers to learn
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Help Toggle */}
                <button
                  onClick={() => setShowQuickHelp(!showQuickHelp)}
                  className="bitsacco-btn-secondary w-full p-2 text-sm"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showQuickHelp ? 'Hide Help' : 'Quick Help'}
                </button>

                {showQuickHelp && (
                  <div className="p-2 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h4 className="font-semibold text-teal-300 mb-2 text-sm">Quick Tips:</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Roll dice to determine available layers</li>
                      <li>• Click blocks to learn privacy concepts</li>
                      <li>• Answer quizzes correctly for bonus points</li>
                      <li>• Watch tower stability indicator</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Game Controls Panel (Streamlined) */}
          <div className="bitsacco-panel p-3 mt-3">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-teal-400" />
              Game Controls
            </h3>
            <div className="space-y-3">
              {/* Learning Experience */}
              <div className="text-center p-2 rounded-lg border bg-teal-500/10 border-teal-400/30">
                <div className="text-sm font-semibold mb-1 text-teal-300">
                  Learning Experience
                </div>
                <span className="flex items-center justify-center gap-2 text-teal-400 text-sm">
                  <Brain className="w-4 h-4" />
                  Continuous
                </span>
                <p className="text-gray-400 text-xs mt-1">Tower resets for uninterrupted learning</p>
              </div>

              {/* Dice Roll */}
              <button
                onClick={handleDiceRoll}
                disabled={!isInteractive}
                className={`w-full p-3 text-base font-semibold ${
                  gameState.diceResult === 0 
                    ? 'bitsacco-btn-primary text-lg' 
                    : 'bitsacco-btn-secondary'
                }`}
              >
                <Dice1 className="w-5 h-5 mr-2" />
                {gameState.diceResult === 0 ? 'Start Game - Roll Dice!' : 'Roll Dice Again'}
              </button>

              {/* New Game */}
              <button
                onClick={handleNewGame}
                className="bitsacco-btn-secondary w-full p-2 text-sm"
              >
                <Trophy className="w-4 h-4 mr-2" />
                New Session
              </button>

              {/* Game Stats */}
              <button
                onClick={handleOpenStats}
                className="bitsacco-btn-secondary w-full p-2 text-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Statistics
              </button>
            </div>
          </div>
        </div>

        {/* Center - 3D Tower (Main focal point - takes most space) */}
        <div className="flex-1 relative bg-gray-900">
          <JengaTower
            blocks={mockGameService.getAllBlocks()}
            onBlockClick={handleBlockClick}
            selectedBlockId={selectedBlockId}
            gameState={gameState}
          />
        </div>

        {/* Right Panel - Game Info & Help (Compact sidebar) */}
        <div className="w-56 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          {/* Game Info */}
          <div className="bitsacco-card p-3 m-3">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              Game Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mode:</span>
                <span className="text-teal-400 font-semibold">Learning</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Blocks:</span>
                <span className="text-blue-400 font-semibold">{gameState?.blocksRemoved}/54</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Layers:</span>
                <span className="text-yellow-400 font-semibold">{gameState?.towerHeight}/18</span>
              </div>
            </div>
            
            {/* Category Progress (Compact) */}
            <div className="mt-3 pt-3 border-t border-gray-600">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Privacy Categories</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">On-Chain:</span>
                  <span className="text-blue-400">{mockGameService.getCategoryProgress('on-chain-privacy')}/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Off-Chain:</span>
                  <span className="text-green-400">{mockGameService.getCategoryProgress('off-chain-practices')}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coin Mixing:</span>
                  <span className="text-purple-400">{mockGameService.getCategoryProgress('coin-mixing')}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet Setup:</span>
                  <span className="text-yellow-400">{mockGameService.getCategoryProgress('wallet-setup')}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lightning:</span>
                  <span className="text-orange-400">{mockGameService.getCategoryProgress('lightning-network')}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Regulatory:</span>
                  <span className="text-red-400">{mockGameService.getCategoryProgress('regulatory')}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Practices:</span>
                  <span className="text-teal-400">{mockGameService.getCategoryProgress('best-practices')}/4</span>
                </div>
              </div>
              
              {/* Progress Summary */}
              {gameState.blocksRemoved === 0 ? (
                <div className="mt-3 p-2 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-xs text-gray-300 text-center">
                    🎯 Ready to learn! Roll dice to start exploring privacy concepts
                  </p>
                </div>
              ) : (
                <div className="mt-3 p-2 bg-teal-500/10 rounded-lg border border-teal-400/30">
                  <p className="text-xs text-teal-300 text-center">
                    📚 Learning in progress: {gameState.blocksRemoved}/54 concepts explored
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Help */}
          <div className="bitsacco-card p-3 m-3">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              Quick Help
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Green = Safe blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Red = Risky blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">Yellow = Quiz blocks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Roll dice first</span>
              </div>
            </div>
          </div>

          {/* How to Play Instructions */}
          <div className="bitsacco-card p-3 m-3">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
              How to Play
            </h3>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Roll the dice to unlock layers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Click on colored blocks to learn privacy concepts</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Read tips, learn facts, or answer quiz questions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Earn points and track your learning progress</span>
              </div>
              <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-400/30">
                <p className="text-xs text-blue-300 text-center">
                  💡 <strong>Tip:</strong> Use arrow keys to navigate between blocks, Enter to select
                </p>
              </div>
            </div>
          </div>
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

      {/* Fix: Only render GameStats when showStats is true */}
      {showStats && (
        <GameStats
          gameState={gameState}
          onNewGame={handleNewGame}
          onClose={handleCloseStats}
        />
      )}
    </div>
  );
};

export default GamePage;
