import React from 'react';
import { motion } from 'framer-motion';
import { X, Brain } from 'lucide-react';
import { GameTutorialProps } from '../types';

const GameTutorial: React.FC<GameTutorialProps> = ({ isOpen, onClose, onStartTutorial, onStartGame }) => {
  if (!isOpen) return null;
  
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
            <Brain className="w-8 h-8 text-teal-400" />
            <h2 className="text-2xl font-bold text-white">Privacy Jenga Tutorial</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tutorial Content */}
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">How to Play</h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Click on any block in the 3D tower to reveal a Bitcoin privacy question</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Answer the question correctly to maintain tower stability</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Wrong answers reduce stability and can cause the tower to collapse</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Learn all 54 Bitcoin privacy concepts through interactive questions</p>
              </div>
            </div>
          </section>

                     <section>
             <h3 className="text-xl font-semibold text-white mb-4">Block Types</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                 <h4 className="text-lg font-semibold text-green-300 mb-2">Green Blocks</h4>
                 <p className="text-green-200 text-sm">Safe blocks</p>
               </div>
               <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4">
                 <h4 className="text-lg font-semibold text-orange-300 mb-2">Orange Blocks</h4>
                 <p className="text-orange-200 text-sm">Medium difficulty</p>
               </div>
               <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                 <h4 className="text-lg font-semibold text-red-300 mb-2">Red Blocks</h4>
                 <p className="text-red-200 text-sm">Risky blocks</p>
               </div>
             </div>
           </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">Game Mechanics</h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Tower stability starts at 100%</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Correct answers: +8 to +20 stability (based on difficulty)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Wrong answers: -15 to -35 stability (based on difficulty)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Tower collapses when stability reaches 0%</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Difficulty adapts based on your performance</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <p className="text-gray-300">Tougher questions give bigger rewards but bigger penalties!</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onStartTutorial && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartTutorial}
                className="bitsacco-btn bitsacco-btn-outline px-6 py-3"
              >
                Interactive Tutorial
              </motion.button>
            )}
            {onStartGame && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartGame}
                className="bitsacco-btn bitsacco-btn-primary px-8 py-3"
              >
                Start Game
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bitsacco-btn bitsacco-btn-outline px-6 py-3"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameTutorial;
