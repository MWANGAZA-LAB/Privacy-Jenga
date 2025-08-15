import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  BarChart3, 
  HelpCircle, 
  X,
  Brain,
  ChevronUp,
  ChevronDown,
  Dice1,
  BookOpen,
  Gamepad2,
  Menu
} from 'lucide-react';
import { JengaTowerRefactored } from '../components/jenga/JengaTowerRefactored';
import { PerformanceMonitor } from '../components/jenga/PerformanceMonitor';
import JengaTower from '../components/JengaTower'; // Fallback for comparison
import ContentModal from '../components/ContentModal';
import GameHelp from '../components/GameHelp';
import GameTutorial from '../components/GameTutorial';
import GameStats from '../components/GameStats';
import { MobileControls } from '../components/mobile/MobileControls';

// Import responsive design hooks
import { useResponsiveDesign } from '../hooks/useResponsiveDesign';

// Import game service
import mockGameService from '../services/mockGameService';
import { Block, Content, GameState } from '../types';

// Error Boundary Component to prevent crashes
class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Game Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center border border-white/20">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-white mb-4">Game Error Detected</h2>
            <p className="text-gray-300 mb-6">
              Something went wrong with the game. Don&apos;t worry, your progress is safe!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Reload Game
            </button>
            <div className="mt-4 text-xs text-gray-400">
              Error: {this.state.error?.message}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const GamePage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(true);
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [isInteractive, setIsInteractive] = useState(true);
  
  // Enhanced dice rolling state
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  
  // Tower stability synchronization
  const [towerStability, setTowerStability] = useState(100);
  
  // Quiz system state
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [lastQuizResult, setLastQuizResult] = useState<any>(null);
  
  // Strategic enhancement: Component architecture toggle
  const [useRefactoredTower, setUseRefactoredTower] = useState(true);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(process.env.NODE_ENV === 'development');

  // 📱 MOBILE RESPONSIVENESS STATE
  const { isMobile, isTablet } = useResponsiveDesign();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FIX 2: Rename to avoid circular reference and fix validation
  const gameService = useMemo(() => {
    console.log('🔧 Using mockGameService instance...');
    const service = mockGameService;
    
    // CRITICAL: Validate that all required methods exist
    console.log('🔍 Service validation:', {
      hasGetGameState: typeof service.getGameState === 'function',
      hasRollDice: typeof service.rollDice === 'function',
      hasGetBlocks: typeof service.getBlocks === 'function',
      hasRemoveBlock: typeof service.removeBlock === 'function',
      hasResetGame: typeof service.resetGame === 'function',
      serviceInstance: service
    });
    
    return service;
  }, []);

  // Fix: Memoize the initializeGame function with stable dependencies
  const initializeGame = useCallback(async () => {
    try {
      console.log('🚀 EMERGENCY DEBUG: Starting game initialization...');
      console.log('gameService instance:', gameService);
      
      const state = await gameService.getGameState();
      const blocksData = await gameService.getBlocks();
      console.log('📊 Game state after initialization:', state);
      console.log('🔍 State details:', {
        hasState: !!state,
        canPullFromLayers: state?.canPullFromLayers,
        diceResult: state?.diceResult,
        blocksRemoved: state?.blocksRemoved,
        gameMode: state?.gameMode,
        blocksCount: blocksData.length
      });
      
      if (state) {
        setGameState(state);
        setBlocks(blocksData);
        setIsInteractive(true);
        console.log('🎯 Game initialized successfully, isInteractive set to:', true);
      } else {
        console.error('❌ CRITICAL: Failed to get game state after initialization');
        alert('Game initialization failed! Check console for details.');
      }
    } catch (error) {
      console.error('💥 CRITICAL ERROR during game initialization:', error);
      alert('Game initialization error! Check console for details.');
    }
  }, [gameService]);

  // Fix: Use useEffect with stable dependencies to prevent infinite loops
  useEffect(() => {
    // Only initialize once when component mounts
    if (!gameState) {
      console.log('🎯 Component mounted, initializing game...');
      initializeGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  // Debug: Log current game state for troubleshooting
  useEffect(() => {
    if (gameState) {
      const fetchBlocks = async () => {
        const blocksData = await gameService.getBlocks();
        setBlocks(blocksData);
        console.log('🎮 Current game state being used:', {
          hasGameState: !!gameState,
          canPullFromLayers: gameState.canPullFromLayers,
          diceResult: gameState.diceResult,
          blocksRemoved: gameState.blocksRemoved,
          isInteractive,
          totalBlocks: blocksData.length,
          removedBlocks: blocksData.filter((b: Block) => b.removed).length,
          availableBlocks: blocksData.filter((b: Block) => !b.removed).length
        });
      };
      fetchBlocks();
    }
  }, [gameState, isInteractive, gameService]);

  // Enhanced handleTowerReset with proper state cleanup
  const handleTowerReset = useCallback(async () => {
    if (!gameState) return;
    
    try {
      await gameService.resetGame();
      const newState = await gameService.getGameState();
      const newBlocks = await gameService.getBlocks();
      
      if (newState && newBlocks) {
        setGameState(newState);
        setBlocks(newBlocks);
        
        // Reset dice animation states
        setIsDiceRolling(false);
        
        alert('Tower reset! Stability restored to 100%');
      }
    } catch (error) {
      console.error('Error resetting tower:', error);
    }
  }, [gameState, gameService]);

  // Handle tower regeneration after collapse
  const handleTowerRegeneration = useCallback(async () => {
    try {
      await gameService.regenerateTower();
      const updatedGameState = await gameService.getGameState();
      const updatedBlocks = await gameService.getBlocks();
      setGameState(updatedGameState);
      setBlocks(updatedBlocks);
      setTowerStability(100);
      
      console.log('🔄 Tower regenerated successfully');
    } catch (error) {
      console.error('💥 Error regenerating tower:', error);
    }
  }, [gameService]);

  // Handle quiz answer submission
  const handleQuizAnswer = useCallback(async (blockId: string, selectedAnswer: number) => {
    try {
      const quizResult = await gameService.answerQuiz(blockId, selectedAnswer);
      setLastQuizResult(quizResult);
      setShowQuizResult(true);
      
      // Update game state and tower stability
      const updatedGameState = await gameService.getGameState();
      setGameState(updatedGameState);
      setTowerStability(updatedGameState?.towerStability || 100);
      
      // Check for game over conditions
      if (updatedGameState?.gamePhase === 'collapsed') {
        setTimeout(() => {
          alert('Tower collapsed due to incorrect answer! Regenerating tower...');
          handleTowerRegeneration();
        }, 2000);
      } else if (updatedGameState?.gamePhase === 'complete') {
        alert('Congratulations! You have successfully completed the Privacy Jenga game!');
      }
      
      console.log('📝 Quiz answered:', quizResult);
    } catch (error) {
      console.error('💥 Error answering quiz:', error);
    }
  }, [gameService, handleTowerRegeneration]);

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
      if (!gameState.canPullFromLayers?.includes(block.layer)) {
        console.log('❌ Block not accessible:', {
          blockLayer: block.layer,
          accessibleLayers: gameState.canPullFromLayers || []
        });
        alert(`Cannot remove this block from layer ${block.layer}. Available layers: ${gameState.canPullFromLayers?.join(', ') || 'none'}`);
        return;
      }

      const result = await gameService.removeBlock(block.id);
      console.log('📦 Pick block result:', result);
      
      // The result is a GameMove object, get content from the block
      console.log('✅ Block picked successfully:', {
        contentTitle: block.content.title,
        contentCategory: block.content.category,
        points: block.content.points,
        gameMove: result
      });
      
      setCurrentContent(block.content);
      setShowContentModal(true);
      setSelectedBlockId(block.id);
      
      // Get updated game state and blocks
      const updatedGameState = await gameService.getGameState();
      const updatedBlocks = await gameService.getBlocks();
      setGameState(updatedGameState);
      setBlocks(updatedBlocks);
      
      // Check if tower collapsed due to quiz answer consequences
      if (updatedGameState?.gamePhase === 'collapsed') {
        alert('Tower collapsed! The tower will regenerate for a new attempt.');
        await handleTowerRegeneration();
      }
      
      // Re-enable dice rolling if all accessible blocks are removed
      if (updatedGameState && updatedGameState.blocksRemoved > 0) {
        // Check if we should reset dice result to allow new roll
        const remainingBlocksInLayers = updatedBlocks.filter(b => 
          !b.removed && updatedGameState.canPullFromLayers?.includes(b.layer)
        );
        
        if (remainingBlocksInLayers.length === 0) {
          // All accessible blocks removed, reset dice to allow new roll
          setGameState(prevState => {
            if (!prevState) return prevState;
            return {
              ...prevState,
              diceResult: 0,
              canPullFromLayers: [],
              gamePhase: 'rolling' as const
            };
          });
          console.log('✅ All accessible blocks removed, dice roll re-enabled');
          
          // Show feedback to user
          setTimeout(() => {
            alert('All accessible blocks in this layer have been explored! Roll the dice again to unlock new layers.');
          }, 500);
        }
      }
      
      // Tower stability is managed by the service internally
    } catch (error) {
      console.error('💥 Error picking block:', error);
      alert('Error removing block. Please try again.');
    }
  }, [gameState, isInteractive, gameService, handleTowerRegeneration]);

  // SIMPLIFIED: Basic dice roll without complex animations
  const handleDiceRoll = useCallback(async () => {
    if (!gameState || !isInteractive || isDiceRolling) {
      console.log('🚨 Dice roll blocked - gameState:', !!gameState, 'isInteractive:', isInteractive, 'isDiceRolling:', isDiceRolling);
      return;
    }

    try {
      // Simple dice roll state
      setIsDiceRolling(true);
      
      console.log('🎲 Rolling dice...');
      
      // Get dice result and accessible layers
      const result = await gameService.rollDice();
      console.log('🎲 Dice roll result:', result);
      
      const updatedState = await gameService.getGameState();
      const updatedBlocks = await gameService.getBlocks();
      
      if (updatedState && updatedBlocks) {
        // Update state immediately
        setGameState(updatedState);
        setBlocks(updatedBlocks);
        
        console.log('✅ Game state updated after dice roll');
        console.log('🔍 New state details:', {
          canPullFromLayers: updatedState.canPullFromLayers || [],
          diceResult: updatedState.diceResult,
          blocksRemoved: updatedState.blocksRemoved
        });
      } else {
        console.error('❌ Failed to get updated game state after dice roll');
        alert('Dice roll failed! Please try again.');
      }
    } catch (error) {
      console.error('💥 Error rolling dice:', error);
      alert('Error rolling dice! Please try again.');
    } finally {
      setIsDiceRolling(false);
    }
  }, [gameState, isInteractive, isDiceRolling, gameService]);

  const handleNewGame = async () => {
    try {
      await gameService.resetGame();
      const newState = await gameService.getGameState();
      if (newState) {
        setGameState(newState);
        setBlocks(await gameService.getBlocks()); // Ensure blocks are refreshed
        setShowStats(false); // Ensure stats panel is closed
        setShowContentModal(false); // Ensure content modal is closed
        setCurrentContent(null);
        setSelectedBlockId(undefined);
        
        // Reset dice animation states
        setIsDiceRolling(false);
        
        alert('New learning session started! Tower stability: 100%');
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
    <GameErrorBoundary>
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

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {gameState.correctAnswers || 0}
                </div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {gameState.incorrectAnswers || 0}
                </div>
                <div className="text-xs text-gray-400">Incorrect</div>
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
        <div className={`${isMobile ? 'flex flex-col' : 'flex'} h-[calc(100vh-80px)]`}>
          
          {/* 📱 Mobile Header Controls */}
          {isMobile && (
            <div className="bg-gray-800 border-b border-gray-700 p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Privacy Jenga</h2>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Mobile Quick Stats */}
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-gray-300">Stability: {Math.round(towerStability)}%</span>
                <button
                  onClick={handleDiceRoll}
                  disabled={isDiceRolling || !isInteractive}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    isDiceRolling || !isInteractive
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  }`}
                >
                  {isDiceRolling ? 'Rolling...' : 'Roll Dice'}
                </button>
              </div>
              
              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 p-3 bg-gray-700 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowHelp(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bitsacco-btn-secondary p-2 text-sm"
                    >
                      <HelpCircle className="w-4 h-4 mr-1" />
                      Help
                    </button>
                    <button
                      onClick={() => {
                        setShowStats(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bitsacco-btn-secondary p-2 text-sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Stats
                    </button>
                    <button
                      onClick={() => {
                        handleTowerReset();
                        setMobileMenuOpen(false);
                      }}
                      className="bitsacco-btn-secondary p-2 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        setShowTutorial(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bitsacco-btn-secondary p-2 text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      Tutorial
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Left Panel - Game Information (Hidden on mobile) */}
          <div className={`${
            isMobile ? 'hidden' : isTablet ? 'w-72' : 'w-64'
          } bg-gray-800 border-r border-gray-700 overflow-y-auto`}>
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
                      <p className="text-gray-400 text-xs mt-1">Layers: {gameState.canPullFromLayers?.join(', ') || 'none'}</p>
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

                  {/* Enhanced Tower Stability with Synchronized Calculation */}
                  <div className={`text-center p-3 rounded-lg border transition-all duration-300 ${
                    towerStability >= 100 
                      ? 'bg-green-500/10 border-green-400/30' // Perfect condition
                      : towerStability >= 70 
                        ? 'bg-yellow-500/10 border-yellow-400/30' // Good
                        : towerStability >= 40 
                          ? 'bg-orange-500/10 border-orange-400/30 tower-stability-warning' // Warning with animation
                          : 'bg-red-500/10 border-red-400/30 tower-stability-warning' // Critical with animation
                  }`}>
                    <div className="text-sm font-semibold mb-1">
                      <span className={`${
                        towerStability >= 100 ? 'text-green-300' :
                        towerStability >= 70 ? 'text-yellow-300' :
                        towerStability >= 40 ? 'text-orange-300' : 'text-red-300'
                      }`}>
                        Tower Stability
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${
                      towerStability >= 100 ? 'text-green-400' :
                      towerStability >= 70 ? 'text-yellow-400' :
                      towerStability >= 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {Math.round(towerStability)}%
                    </div>
                    <p className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-1">
                      {towerStability >= 100 ? (
                        <><span className="text-green-400">●</span> Perfect</>
                      ) : towerStability >= 70 ? (
                        <><span className="text-yellow-400">●</span> Good</>
                      ) : towerStability >= 40 ? (
                        <><span className="text-orange-400">⚠</span> Warning</>
                      ) : (
                        <><span className="text-red-400">⚠</span> Critical</>
                      )}
                    </p>
                    {gameState.blocksRemoved > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {gameState.blocksRemoved} blocks removed
                      </div>
                    )}
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
                            Available: {gameState.canPullFromLayers?.length || 0} layers
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {gameState.canPullFromLayers?.map((layer) => (
                              <div key={layer} className="w-6 h-6 bg-green-500/20 border border-green-400/40 rounded text-xs text-green-300 flex items-center justify-center">
                                {layer}
                              </div>
                            )) || null}
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

                {/* Enhanced Dice Roll with Animation */}
                <div className="space-y-2">
                  <button
                    onClick={handleDiceRoll}
                    disabled={!isInteractive || isDiceRolling || gameState.diceResult > 0}
                    className={`w-full p-3 text-base font-semibold transition-all duration-300 interactive-feedback ${
                      gameState.diceResult === 0 
                        ? 'bitsacco-btn-primary text-lg' 
                        : 'bitsacco-btn-secondary'
                    } ${isDiceRolling || gameState.diceResult > 0 ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center">
                      <Dice1 
                        className={`w-5 h-5 mr-2 transition-transform duration-150 ${
                          isDiceRolling ? 'animate-spin' : ''
                        }`} 
                      />
                      {isDiceRolling 
                        ? 'Rolling...' 
                        : gameState.diceResult === 0 
                          ? 'Start Game - Roll Dice!' 
                          : 'Layers Unlocked - Pick Blocks!'
                      }
                    </div>
                  </button>
                  
                  {/* Dice Result Display */}
                  {gameState.diceResult > 0 && (
                    <div className="text-center p-3 rounded-lg border bg-gray-700/50 border-gray-600">
                      <div className="text-2xl font-bold text-white mb-1">🎲 {gameState.diceResult}</div>
                      <div className="text-sm text-gray-300">
                        Can pull from layers 1-{gameState.diceResult}
                      </div>
                      {gameState.canPullFromLayers && gameState.canPullFromLayers.length > 0 && (
                        <div className="text-xs text-green-400 mt-1">
                          Available layers: {gameState.canPullFromLayers.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

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

          {/* Center - 3D Tower (Main focal point) */}
          <div className={`flex-1 relative bg-gray-900 ${
            isMobile ? 'min-h-[60vh] pb-20' : ''
          }`}>
            {!gameState ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-white text-lg">Loading Privacy Jenga...</p>
                  <p className="text-gray-400 text-sm mt-2">Initializing game components</p>
                </div>
              </div>
            ) : (
              <>
                {/* Strategic Enhancement: Component Toggle */}
                {useRefactoredTower ? (
                  <JengaTowerRefactored
                    blocks={blocks}
                    onBlockClick={handleBlockClick}
                    gameState={gameState}
                    onStabilityChange={setTowerStability}
                  />
                ) : (
                  <JengaTower
                    blocks={blocks}
                    onBlockClick={handleBlockClick}
                    gameState={gameState}
                    selectedBlockId={selectedBlockId}
                  />
                )}
                
                {/* Performance Monitor for Development */}
                {showPerformanceMonitor && (
                  <PerformanceMonitor 
                    enabled={true}
                    position="bottom-right"
                  />
                )}
              </>
            )}
          </div>

          {/* Right Panel - Game Info & Help (Hidden on mobile) */}
          <div className={`${
            isMobile ? 'hidden' : isTablet ? 'w-64' : 'w-56'
          } bg-gray-800 border-l border-gray-700 overflow-y-auto`}>
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
              </div>
              
              {/* Category Progress (Compact) */}
              <div className="mt-3 pt-3 border-t border-gray-600">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Privacy Categories</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">On-Chain:</span>
                    <span className="text-blue-400">{Math.floor(gameState.blocksRemoved * 0.28)}/15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Off-Chain:</span>
                    <span className="text-green-400">{Math.floor(gameState.blocksRemoved * 0.19)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coin Mixing:</span>
                    <span className="text-purple-400">{Math.floor(gameState.blocksRemoved * 0.19)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wallet Setup:</span>
                    <span className="text-yellow-400">{Math.floor(gameState.blocksRemoved * 0.09)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lightning:</span>
                    <span className="text-orange-400">{Math.floor(gameState.blocksRemoved * 0.09)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Regulatory:</span>
                    <span className="text-red-400">{Math.floor(gameState.blocksRemoved * 0.09)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Practices:</span>
                    <span className="text-teal-400">{Math.floor(gameState.blocksRemoved * 0.07)}/4</span>
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

            {/* Development Controls - Only in development mode */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bitsacco-card p-3 m-3 border border-orange-500/30">
                <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Dev Controls
                </h3>
                <div className="space-y-3 text-sm">
                  {/* Component Toggle */}
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useRefactoredTower}
                        onChange={(e) => setUseRefactoredTower(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-300">Use Refactored Tower</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {useRefactoredTower ? 'Modular architecture' : 'Original monolithic'}
                    </p>
                  </div>

                  {/* Performance Monitor Toggle */}
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showPerformanceMonitor}
                        onChange={(e) => setShowPerformanceMonitor(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-300">Performance Monitor</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Shows FPS, memory usage, render count
                    </p>
                  </div>

                  {/* Component Info */}
                  <div className="pt-2 border-t border-gray-600">
                    <div className="text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Architecture:</span>
                        <span className={useRefactoredTower ? 'text-green-400' : 'text-yellow-400'}>
                          {useRefactoredTower ? 'Modular' : 'Monolithic'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Component Size:</span>
                        <span className={useRefactoredTower ? 'text-green-400' : 'text-red-400'}>
                          {useRefactoredTower ? '<200 LOC' : '672 LOC'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hooks Used:</span>
                        <span className={useRefactoredTower ? 'text-green-400' : 'text-yellow-400'}>
                          {useRefactoredTower ? 'Custom' : 'Built-in'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 📱 MOBILE CONTROLS - Bottom Sheet */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-10">
            <MobileControls
              onBlockSelect={(direction: 'up' | 'down' | 'left' | 'right') => {
                // Handle directional block selection for mobile
                console.log('Mobile block selection:', direction);
              }}
              onConfirmSelection={() => {
                if (selectedBlockId) {
                  const block = blocks.find(b => b.id === selectedBlockId);
                  if (block) {
                    handleBlockClick(block);
                  }
                }
              }}
              onCancelSelection={() => {
                setSelectedBlockId(undefined);
              }}
              onToggleInfo={() => {
                setShowHelp(!showHelp);
              }}
              onToggleSettings={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              onResetView={handleTowerReset}
              onGoHome={() => window.history.back()}
              isGamePaused={!isInteractive}
              onTogglePause={() => setIsInteractive(!isInteractive)}
              selectedBlockId={selectedBlockId || null}
            />
          </div>
        )}

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
          blockId={selectedBlockId}
        />

        {/* Quiz Result Modal */}
        {showQuizResult && lastQuizResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuizResult(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`
                relative max-w-md w-full rounded-xl p-6 backdrop-blur-md
                ${lastQuizResult.isCorrect 
                  ? 'bg-green-500/90 border-2 border-green-400' 
                  : 'bg-red-500/90 border-2 border-red-400'
                }
              `}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">
                  {lastQuizResult.isCorrect ? '✅' : '❌'}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {lastQuizResult.isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                <p className="text-lg mb-4">
                  {lastQuizResult.isCorrect 
                    ? `Great job! +${lastQuizResult.pointsAwarded} points` 
                    : `Tower stability ${lastQuizResult.stabilityChange}%`
                  }
                </p>
                <button
                  onClick={() => setShowQuizResult(false)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
    </GameErrorBoundary>
  );
};

export default GamePage;
