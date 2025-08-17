import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BarChart3, 
  HelpCircle, 
  Brain
} from 'lucide-react';
import SimplifiedJengaTower from '../components/jenga/SimplifiedJengaTower';
import ContentModal from '../components/ContentModal';
import GameHelp from '../components/GameHelp';
import GameTutorial from '../components/GameTutorial';
import GameStats from '../components/GameStats';
import EndgameSummary from '../components/EndgameSummary';
import { MobileControls } from '../components/mobile/MobileControls';

// Import responsive design hooks
import { useResponsiveDesign } from '../hooks/useResponsiveDesign';

// Import enhanced game service
import enhancedGameService from '../services/simplifiedGameService';
import { Block, BlockContent, GameState, Achievement } from '../types';

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
  const [currentContent, setCurrentContent] = useState<BlockContent | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEndgameSummary, setShowEndgameSummary] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  
  // Quiz system state
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Achievement notification state
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
  const [lastAchievement, setLastAchievement] = useState<Achievement | null>(null);
  
  // Mobile responsiveness
  const { isMobile, isSmallMobile } = useResponsiveDesign();

  // Initialize game
  useEffect(() => {
    const initializeGame = () => {
      try {
        const newGameState = enhancedGameService.initializeGame();
        const newBlocks = enhancedGameService.getBlocks();
        
        setGameState(newGameState);
        setBlocks(newBlocks);
        
        console.log('🎮 Game initialized:', { gameState: newGameState, blocks: newBlocks.length });
      } catch (error) {
        console.error('🚨 Error initializing game:', error);
      }
    };

    initializeGame();
  }, []);

  // Handle block click
  const handleBlockClick = useCallback(async (block: Block) => {
    if (!gameState || block.isRemoved) return;

    try {
      console.log('🎯 Block clicked:', block.id, block.type);
      
      // Get block content
      const content = enhancedGameService.handleBlockClick(block.id);
      if (!content) {
        console.log('🚫 No content found for block:', block.id);
        return;
      }

      setCurrentContent(content);
      setSelectedBlockId(block.id);
      
      // Show quiz for question blocks
      if (content.type === 'QUESTION') {
        setShowQuiz(true);
        setShowContentModal(true);
        // Start timing for Fast Thinker achievement
        enhancedGameService.setAnswerStartTime();
      } else {
        // For tip blocks, show content directly
        setShowQuiz(false);
        setShowContentModal(true);
      }
      
    } catch (error) {
      console.error('🚨 Error handling block click:', error);
    }
  }, [gameState]);



  // Handle quiz answer
  const handleQuizAnswer = useCallback(async (blockId: string, selectedAnswer: number) => {
    if (!gameState) return;

    try {
      console.log('🧠 Quiz answer submitted:', { blockId, selectedAnswer });
      
      // Submit answer to game service
      const quizResult = enhancedGameService.handleQuizAnswer(blockId, selectedAnswer);
      
      // Update game state and blocks
      const updatedGameState = enhancedGameService.getGameState();
      const updatedBlocks = enhancedGameService.getBlocks();
      setGameState(updatedGameState);
      setBlocks(updatedBlocks);
      
      // Show quiz result
      setShowQuiz(false);
      
      console.log('✅ Quiz result:', quizResult);
      console.log('📊 Updated stability:', updatedGameState.towerStability);
      console.log('🧱 Blocks removed:', updatedGameState.blocksRemoved);
      
      // Check for new achievements
      const currentAchievements = updatedGameState.currentPlayer.achievements;
      const newAchievement = currentAchievements.find(a => 
        a.isUnlocked && a.unlockedAt && 
        Date.now() - a.unlockedAt.getTime() < 5000 // Show if unlocked in last 5 seconds
      );
      
      if (newAchievement) {
        setLastAchievement(newAchievement);
        setShowAchievementNotification(true);
        setTimeout(() => setShowAchievementNotification(false), 4000);
      }
      
      // Check if tower collapsed - don't auto-rebuild, let the popup show
      if (updatedGameState.gamePhase === 'collapsed') {
        console.log('💥 Tower collapsed! Game end popup should show now.');
        // Don't auto-rebuild - let the user see the game end popup first
      }
      
    } catch (error) {
      console.error('🚨 Error handling quiz answer:', error);
    }
  }, [gameState]);

  // Close content modal
  const handleCloseContentModal = useCallback(() => {
    setShowContentModal(false);
    setShowQuiz(false);
    setSelectedBlockId(undefined);
    setCurrentContent(null);
  }, []);

  // Reset game
  const handleResetGame = useCallback(() => {
    try {
      const newGameState = enhancedGameService.resetGame();
      const newBlocks = enhancedGameService.getBlocks();
      
      setGameState(newGameState);
      setBlocks(newBlocks);
      setShowContentModal(false);
      setShowQuiz(false);
      setShowEndgameSummary(false);
      setSelectedBlockId(undefined);
      setCurrentContent(null);
      
      console.log('🔄 Game reset successfully');
    } catch (error) {
      console.error('🚨 Error resetting game:', error);
    }
  }, []);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    setShowEndgameSummary(false);
    handleResetGame();
  }, [handleResetGame]);

  // Handle game restart from collapse popup
  const handleGameRestart = useCallback(() => {
    console.log('🔄 Restarting game from collapse popup');
    handleResetGame();
  }, [handleResetGame]);

  // Get category icon for progress display (unused but kept for future reference)
  // const getCategoryIcon = (category: PrivacyCategory) => {
  //   const icons: Record<PrivacyCategory, React.ReactNode> = {
  //     'on-chain': <Shield className="w-4 h-4" />,
  //     'off-chain': <Zap className="w-4 h-4" />,
  //     'coin-mixing': <Target className="w-4 h-4" />,
  //     'wallet-setup': <BookOpen className="w-4 h-4" />,
  //     'lightning': <Zap className="w-4 h-4" />,
  //     'regulatory': <Award className="w-4 h-4" />,
  //     'best-practices': <Star className="w-4 h-4" />
  //   };
  //   return icons[category];
  // };

  // Loading state
  if (!gameState || !blocks.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-teal-400 text-lg font-semibold">Loading Privacy Jenga...</div>
          <div className="text-gray-400 text-sm">Preparing your privacy education journey</div>
        </div>
      </div>
    );
  }

  return (
    <GameErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <header className="relative z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className={`flex items-center gap-2 text-white hover:text-teal-300 transition-colors ${
                  isSmallMobile ? 'text-sm' : ''
                }`}
              >
                <ArrowLeft className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                {!isSmallMobile && "Back to Menu"}
              </motion.button>

              {/* Game Title */}
              <div className="text-center">
                <h1 className={`font-bold text-white ${
                  isSmallMobile ? 'text-lg' : 'text-2xl'
                }`}>Privacy Jenga</h1>
                <p className={`text-gray-300 ${
                  isSmallMobile ? 'text-xs' : 'text-sm'
                }`}>Learn Bitcoin Privacy Through Play</p>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center gap-2 ${
                isSmallMobile ? 'gap-1' : ''
              }`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStats(true)}
                  className={`text-white hover:text-yellow-300 transition-colors ${
                    isSmallMobile ? 'p-1' : 'p-2'
                  }`}
                  title="Game Statistics"
                >
                  <BarChart3 className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHelp(true)}
                  className={`text-white hover:text-blue-300 transition-colors ${
                    isSmallMobile ? 'p-1' : 'p-2'
                  }`}
                  title="Game Help"
                >
                  <HelpCircle className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTutorial(true)}
                  className={`text-white hover:text-green-300 transition-colors ${
                    isSmallMobile ? 'p-1' : 'p-2'
                  }`}
                  title="Game Tutorial"
                >
                  <Brain className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Game Progress Bar */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span>Learning Progress</span>
              <span>{gameState.totalContentShown}/{gameState.totalContentAvailable} concepts</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(gameState.totalContentShown / gameState.totalContentAvailable) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="bg-black/10 backdrop-blur-sm px-4 py-3">
          <div className="container mx-auto">
            <div className={`grid gap-4 text-center ${
              isSmallMobile ? 'grid-cols-2 gap-2' : 
              isMobile ? 'grid-cols-2 gap-3' : 
              'grid-cols-2 md:grid-cols-4 gap-4'
            }`}>
              <div>
                <div className={`font-bold text-yellow-400 ${
                  isSmallMobile ? 'text-base' : 'text-lg'
                }`}>{gameState.currentScore}</div>
                <div className={`text-gray-400 ${
                  isSmallMobile ? 'text-xs' : 'text-xs'
                }`}>Score</div>
              </div>
              <div>
                <div className={`font-bold text-green-400 ${
                  isSmallMobile ? 'text-base' : 'text-lg'
                }`}>{gameState.towerStability}%</div>
                <div className={`text-gray-400 ${
                  isSmallMobile ? 'text-xs' : 'text-xs'
                }`}>Stability</div>
              </div>
              {!isSmallMobile && (
                <>
                  <div>
                    <div className={`font-bold text-blue-400 ${
                      isMobile ? 'text-base' : 'text-lg'
                    }`}>{gameState.currentDifficulty}</div>
                    <div className="text-xs text-gray-400">Difficulty</div>
                  </div>
                  <div>
                    <div className={`font-bold text-purple-400 ${
                      isMobile ? 'text-base' : 'text-lg'
                    }`}>{gameState.currentPlayer.totalAchievements}</div>
                    <div className="text-xs text-gray-400">Achievements</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <main className="flex-1 relative">
          {/* Simplified Jenga Tower */}
          <SimplifiedJengaTower
            blocks={blocks}
            onBlockClick={handleBlockClick}
            gameState={gameState}
            selectedBlockId={selectedBlockId}
            onGameRestart={handleGameRestart}
          />

          {/* Quick Help Button */}
          <div className="absolute bottom-4 left-4 z-20">
            <button
              onClick={() => setShowQuickHelp(!showQuickHelp)}
              className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 hover:bg-gray-700/80 transition-colors"
              title="Quick Help"
            >
              <div className="text-center">
                <div className="text-gray-300 text-sm font-semibold">?</div>
                <div className="text-gray-400 text-xs">Help</div>
              </div>
            </button>
            
                    {/* Quick help tooltip */}
        {showQuickHelp && (
          <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 max-w-xs z-30">
            <div className="text-gray-300 text-xs space-y-1">
              <div className="font-semibold text-white mb-2">Quick Tips:</div>
              <div>• Click on any block to reveal content</div>
              <div>• Answer questions correctly to maintain stability</div>
              <div>• Learn all 54 Bitcoin privacy concepts</div>
              <div>• Difficulty adapts to your performance</div>
              <div>• Green = Safe, Orange = Medium, Red = Risky</div>
            </div>
          </div>
        )}
          </div>

          {/* Tower Collapse Button removed - now handled by popup */}
        </main>

        {/* Achievement Notification */}
        {showAchievementNotification && lastAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/50 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{lastAchievement.icon}</div>
              <div>
                <div className="font-bold text-white">{lastAchievement.name}</div>
                <div className="text-sm text-yellow-100">{lastAchievement.description}</div>
                <div className="text-xs text-yellow-200">+{lastAchievement.points} points</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Modal */}
        <ContentModal
          content={currentContent}
          isOpen={showContentModal}
          onClose={handleCloseContentModal}
          onQuizAnswer={handleQuizAnswer}
          showQuiz={showQuiz}
          gameState={gameState}
          blockId={selectedBlockId}
        />

        {/* Game Help Modal */}
        {showHelp && (
          <GameHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
        )}

        {/* Game Tutorial Modal */}
        {showTutorial && (
          <GameTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
        )}

        {/* Game Stats Modal */}
        {showStats && (
          <GameStats
            player={gameState.currentPlayer}
            statistics={enhancedGameService.getGameStatistics()}
            onClose={() => setShowStats(false)}
          />
        )}

        {/* Endgame Summary Modal */}
        {showEndgameSummary && (
          <EndgameSummary
            gameState={gameState}
            gameHistory={gameState.gameHistory}
            achievements={gameState.currentPlayer.achievements}
            onPlayAgain={handlePlayAgain}
            onClose={() => setShowEndgameSummary(false)}
            isOpen={showEndgameSummary}
          />
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <MobileControls
            onReset={handleResetGame}
            onHelp={() => setShowHelp(true)}
            onTutorial={() => setShowTutorial(true)}
          />
        )}
      </div>
    </GameErrorBoundary>
  );
};

export default GamePage;
