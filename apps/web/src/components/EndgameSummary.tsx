import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  X, 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen, 
  BarChart3,
  Star,
  Award,
  Zap,
  Shield,
  // Map
} from 'lucide-react';
import { GameState, GameMove, Achievement } from '../types';

interface EndgameSummaryProps {
  gameState: GameState;
  gameHistory: GameMove[];
  achievements: Achievement[];
  onPlayAgain: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const EndgameSummary: React.FC<EndgameSummaryProps> = ({
  gameState,
  gameHistory,
  achievements,
  onPlayAgain,
  onClose,
  isOpen
}) => {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const totalAchievements = achievements.length;
  const completionRate = (gameState.totalContentShown / gameState.totalContentAvailable) * 100;
  
  // Calculate session statistics
  const sessionDuration = gameState.currentPlayer.totalPlayTime;
  const averageScore = gameHistory.length > 0 ? 
    gameHistory.reduce((sum, move) => sum + move.points, 0) / gameHistory.length : 0;

  // Get category progress
  const categoryProgress = Object.entries(gameState.learningProgress).map(([category, progress]) => ({
    category: category as any,
    progress,
    maxProgress: 15 // Approximate max per category
  }));

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'on-chain': <Shield className="w-4 h-4" />,
      'off-chain': <Zap className="w-4 h-4" />,
      'coin-mixing': <Target className="w-4 h-4" />,
      'wallet-setup': <BookOpen className="w-4 h-4" />,
      'lightning': <Zap className="w-4 h-4" />,
      'regulatory': <Award className="w-4 h-4" />,
      'best-practices': <Star className="w-4 h-4" />
    };
    return icons[category] || <BookOpen className="w-4 h-4" />;
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'on-chain': 'On-Chain Privacy',
      'off-chain': 'Off-Chain Solutions',
      'coin-mixing': 'Coin Mixing',
      'wallet-setup': 'Wallet Setup',
      'lightning': 'Lightning Network',
      'regulatory': 'Regulatory',
      'best-practices': 'Best Practices'
    };
    return names[category] || category;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {gameState.gamePhase === 'completed' ? 'Privacy Master!' : 'Game Summary'}
                  </h2>
                  <p className="text-gray-300">
                    {gameState.gamePhase === 'completed' 
                      ? 'Congratulations! You\'ve learned all privacy concepts!' 
                      : 'Here\'s how you performed'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Game Statistics */}
              <div className="space-y-6">
                {/* Score and Performance */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{gameState.currentScore}</div>
                      <div className="text-sm text-gray-300">Total Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{gameState.correctAnswers}</div>
                      <div className="text-sm text-gray-300">Correct Answers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{gameState.blocksRemoved}</div>
                      <div className="text-sm text-gray-300">Blocks Removed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{Math.round(completionRate)}%</div>
                      <div className="text-sm text-gray-300">Completion</div>
                    </div>
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Progress
                  </h3>
                  <div className="space-y-3">
                    {categoryProgress.map(({ category, progress, maxProgress }) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          {getCategoryIcon(category)}
                          <span>{getCategoryName(category)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(progress / maxProgress) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">
                            {progress}/{maxProgress}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Stats */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Session Statistics
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Session Duration:</span>
                      <span className="text-white">{Math.round(sessionDuration)} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average Score:</span>
                      <span className="text-white">{Math.round(averageScore)} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tower Rebuilds:</span>
                      <span className="text-white">{gameState.rebuildCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Final Stability:</span>
                      <span className="text-white">{gameState.towerStability}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Achievements */}
              <div className="space-y-6">
                {/* Achievements Summary */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements ({unlockedAchievements.length}/{totalAchievements})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: achievement.isUnlocked ? 0.1 : 0 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                          achievement.isUnlocked 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                            : 'bg-gray-800/50 border border-gray-700/50'
                        }`}
                      >
                        <div className={`text-2xl ${achievement.isUnlocked ? 'opacity-100' : 'opacity-30'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${achievement.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.name}
                          </div>
                          <div className={`text-sm ${achievement.isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                            {achievement.description}
                          </div>
                          {achievement.isUnlocked && (
                            <div className="text-xs text-yellow-400 mt-1">
                              +{achievement.points} points
                            </div>
                          )}
                        </div>
                        {achievement.isUnlocked && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Special Recognition */}
                {gameState.gamePhase === 'completed' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏆</div>
                      <h3 className="text-xl font-bold text-white mb-2">Privacy Master</h3>
                      <p className="text-gray-300 text-sm">
                        You've successfully learned all 54 Bitcoin privacy concepts! 
                        You're now equipped with comprehensive knowledge about Bitcoin privacy.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPlayAgain}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200"
                  >
                    {gameState.gamePhase === 'completed' ? 'Play Again' : 'Continue Learning'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EndgameSummary;
