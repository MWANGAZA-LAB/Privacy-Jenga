import React from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Trophy, BarChart3, Shield } from 'lucide-react';
import { GameStatsProps } from '../types';

const GameStats: React.FC<GameStatsProps> = ({ gameState, onNewGame }) => {
  const getGameModeInfo = () => {
    return {
      mode: 'Privacy Jenga Learning Mode',
      icon: <Brain className="w-6 h-6" />,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bitsacco-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {modeInfo.icon}
            <h2 className="text-2xl font-bold text-white">Game Statistics</h2>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Mode */}
          <div className={`bitsacco-card p-6 ${modeInfo.bgColor} border ${modeInfo.borderColor}`}>
            <div className="flex items-center gap-3 mb-4">
              {modeInfo.icon}
              <h3 className="text-xl font-semibold text-white">Game Mode</h3>
            </div>
            <div className="text-3xl font-bold mb-2 text-teal-300">
              🧠 Learning Mode
            </div>
            <p className="text-gray-300">Continuous</p>
          </div>

          {/* Current Score */}
          <div className="bitsacco-card p-6 bg-blue-500/10 border border-blue-400/30">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Current Score</h3>
            </div>
            <div className="text-3xl font-bold mb-2 text-blue-300">
              {gameState.currentScore}
            </div>
            <p className="text-gray-300">Points earned</p>
          </div>

          {/* Tower Status */}
          <div className="bitsacco-card p-6 bg-yellow-500/10 border border-yellow-400/30">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Tower Status</h3>
            </div>
            <div className="text-3xl font-bold mb-2 text-yellow-300">
              {gameState.towerHeight}/18
            </div>
            <p className="text-gray-300">Layers remaining</p>
          </div>

          {/* Blocks Removed */}
          <div className="bitsacco-card p-6 bg-red-500/10 border border-red-400/30">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Blocks Removed</h3>
            </div>
            <div className="text-3xl font-bold mb-2 text-red-300">
              {gameState.blocksRemoved}/54
            </div>
            <p className="text-gray-300">Privacy concepts learned</p>
          </div>
        </div>

        {/* Learning Mode Rules */}
        <div className="bitsacco-card p-6 mt-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-teal-400" />
            Learning Mode Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Tower automatically resets when it becomes unstable for continuous learning</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Score accumulates across multiple tower resets</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Focus on mastering all 54 privacy concepts</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
              <p className="text-gray-300">Perfect for extended learning and skill development</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            🧠 Continuous learning mode - your progress is preserved
          </p>
          <button
            onClick={onNewGame}
            className="bitsacco-btn-primary px-6 py-3"
          >
            <Trophy className="w-5 h-5 mr-2" />
            New Learning Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameStats;
