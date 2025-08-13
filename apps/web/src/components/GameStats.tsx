import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, RefreshCw, Infinity, Gamepad2, BarChart3, Award, Brain } from 'lucide-react';
import { GameState } from '../types';

interface GameStatsProps {
  gameState: GameState;
  onNewGame: () => void;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  gameState, 
  onNewGame
}) => {
  const totalBlocks = gameState.totalBlocks;
  const blocksRemoved = gameState.blocksRemoved;
  const remainingBlocks = totalBlocks - blocksRemoved;
  const completionPercentage = (blocksRemoved / totalBlocks) * 100;

  const getGameModeInfo = () => {
    return {
      name: 'Privacy Jenga Learning Mode',
      description: 'Continuous learning with tower resets',
      icon: <Brain className="w-6 h-6 text-teal-400" />,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-400/30'
    };
  };

  const modeInfo = getGameModeInfo();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bitsacco-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-teal-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Game Statistics</h2>
              <div className="text-gray-400">Privacy Jenga Performance Overview</div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
                     {/* Game Mode Section */}
           <div className={`p-4 rounded-lg bitsacco-border-accent ${modeInfo.bgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {modeInfo.icon}
                <div>
                  <h3 className={`text-lg font-semibold ${modeInfo.color}`}>{modeInfo.name}</h3>
                  <p className="text-gray-300 text-sm">{modeInfo.description}</p>
                </div>
              </div>
              

            </div>
          </div>

          {/* Score and Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Current Score */}
             <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/10 bitsacco-border-accent rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2">{gameState.currentScore}</div>
              <div className="text-teal-300 font-semibold">Current Score</div>
              <div className="text-teal-200 text-sm mt-1">
                High Score: {gameState.currentPlayer.highScore}
              </div>
            </div>

                         {/* Progress */}
             <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 bitsacco-border-accent rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{blocksRemoved}</div>
              <div className="text-blue-300 font-semibold">Blocks Removed</div>
              <div className="text-blue-200 text-sm mt-1">
                {remainingBlocks} remaining
              </div>
            </div>
          </div>

                     {/* Progress Bar */}
           <div className="bg-gray-700/50 bitsacco-border-subtle rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-semibold">Game Progress</span>
              <span className="text-gray-400 text-sm">{completionPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-blue-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-center text-gray-400 text-sm mt-2">
              {blocksRemoved} of {totalBlocks} blocks removed
            </div>
          </div>

                     {/* Tower Status */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-gray-700/50 bitsacco-border-subtle rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-white mb-1">{gameState.towerHeight}</div>
               <div className="text-gray-300 text-sm">Tower Height</div>
               <div className="text-gray-400 text-xs">Layers remaining</div>
             </div>
             
             <div className="bg-gray-700/50 bitsacco-border-subtle rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-white mb-1">{gameState.diceResult || 0}</div>
               <div className="text-gray-300 text-sm">Current Dice</div>
               <div className="text-gray-400 text-xs">Layer access</div>
             </div>
             
             <div className="bg-gray-700/50 bitsacco-border-subtle rounded-lg p-4 text-center">
               <div className="text-2xl font-bold text-white mb-1">
                 🧠
               </div>
               <div className="text-gray-300 text-sm">Learning Mode</div>
               <div className="text-gray-400 text-xs">Continuous</div>
             </div>
           </div>

                     {/* Player Achievements */}
           {gameState.currentPlayer.achievements.length > 0 && (
             <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 bitsacco-border-warning rounded-lg p-4">
               <div className="flex items-center gap-2 mb-3">
                 <Award className="w-5 h-5 text-yellow-400" />
                 <h3 className="text-lg font-semibold text-yellow-300">Achievements Unlocked</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {gameState.currentPlayer.achievements.map((achievement, index) => (
                   <div key={index} className="bg-yellow-500/20 bitsacco-border-warning rounded-lg p-3">
                     <div className="flex items-center gap-2">
                       <span className="text-yellow-300 text-lg">{achievement.icon}</span>
                       <div>
                         <div className="text-yellow-200 font-medium">{achievement.name}</div>
                         <div className="text-yellow-300 text-xs">+{achievement.points} points</div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

                     {/* Learning Mode Rules */}
           <div className="bg-gray-700/50 bitsacco-border-subtle rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Learning Mode Rules</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Infinity className="w-4 h-4 text-teal-400" />
                <span>Tower automatically resets when unstable for continuous learning</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Score accumulates across multiple tower resets</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-400" />
                <span>Focus on mastering all 54 privacy concepts</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>Perfect for extended learning and skill development</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="text-sm text-gray-400">
            🧠 Continuous learning mode - your progress is preserved
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onNewGame}
              className="bitsacco-btn bitsacco-btn-primary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Learning Session
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameStats;
