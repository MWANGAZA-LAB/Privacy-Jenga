import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, BookOpen, Target, Trophy, Zap, Shield, AlertTriangle, Dice1, Info, Star, Brain } from 'lucide-react';

interface GameHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameHelp: React.FC<GameHelpProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('rules');

  const tabs = [
    { id: 'rules', label: 'Game Rules', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'scoring', label: 'Scoring', icon: <Trophy className="w-5 h-5" /> },
    { id: 'strategy', label: 'Strategy', icon: <Target className="w-5 h-5" /> },
    { id: 'tips', label: 'Tips & Tricks', icon: <Star className="w-5 h-5" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <div className="space-y-6">
            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Basic Rules
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>Objective:</strong> Remove blocks while learning about privacy</li>
                <li>• <strong>Game End:</strong> Tower collapses when unstable</li>
                <li>• <strong>Turn Order:</strong> Roll dice → Choose block → Learn → Continue</li>
                <li>• <strong>Block Removal:</strong> Only from layers specified by dice</li>
                <li>• <strong>Learning:</strong> Each block teaches privacy concepts</li>
              </ul>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Dice1 className="w-5 h-5" />
                Dice Mechanics
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span className="text-gray-300">Safe Zone (Layers 1-3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">2</span>
                    <span className="text-gray-300">Steady (Layers 1-6)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-yellow-500 rounded text-white text-xs font-bold flex items-center justify-center">3</span>
                    <span className="text-gray-300">Risky (Layers 1-9)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-bold flex items-center justify-center">4</span>
                    <span className="text-gray-300">Danger (Layers 1-12)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-500 rounded text-white text-xs font-bold flex items-center justify-center">5</span>
                    <span className="text-gray-300">Extreme (Layers 1-15)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 rounded text-white text-xs font-bold flex items-center justify-center">6</span>
                    <span className="text-gray-300">Ultimate (All Layers)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Block Types
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-green-300">Safe Blocks</div>
                    <div className="text-green-200">Good privacy practices, earn points, stabilize tower</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-red-300">Risky Blocks</div>
                    <div className="text-red-200">Bad practices, cost points, destabilize tower</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <div>
                    <div className="font-semibold text-yellow-300">Challenge Blocks</div>
                    <div className="text-yellow-200">Quiz questions, correct = points, wrong = penalty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6">
            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Point System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                    <div className="font-semibold text-green-300 mb-1">Safe Blocks</div>
                    <div className="text-green-200">Base: 15-30 points</div>
                    <div className="text-green-200">Effect: +stability</div>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                    <div className="font-semibold text-red-300 mb-1">Risky Blocks</div>
                    <div className="text-red-200">Base: 25-50 points</div>
                    <div className="text-red-200">Effect: -stability</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                    <div className="font-semibold text-yellow-300 mb-1">Challenge Blocks</div>
                    <div className="text-yellow-200">Base: 35-70 points</div>
                    <div className="text-yellow-200">Correct: +bonus, +stability</div>
                    <div className="text-yellow-200">Wrong: -penalty, -stability</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="font-semibold text-blue-300 mb-1">Layer Multiplier</div>
                    <div className="text-blue-200">Higher layers = more points</div>
                    <div className="text-blue-200">Risk vs. reward balance</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">First Steps</span>
                    <span className="text-teal-400">+10 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Privacy Pro</span>
                    <span className="text-teal-400">+50 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Tower Master</span>
                    <span className="text-teal-400">+100 pts</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">High Scorer</span>
                    <span className="text-teal-400">+200 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Layer Explorer</span>
                    <span className="text-teal-400">+150 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <span className="text-gray-300">Quiz Champion</span>
                    <span className="text-teal-400">+300 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Beginner Strategy
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>Start Safe:</strong> Focus on layers 1-6 for stability</li>
                <li>• <strong>Green First:</strong> Remove safe blocks to build foundation</li>
                <li>• <strong>Learn Patterns:</strong> Understand block type distribution</li>
                <li>• <strong>Quiz Carefully:</strong> Take time with challenge blocks</li>
                <li>• <strong>Monitor Stability:</strong> Watch tower health indicators</li>
              </ul>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Strategy
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>Risk Management:</strong> Balance safe vs. risky for optimal scoring</li>
                <li>• <strong>Dice Planning:</strong> Save high dice for difficult layers</li>
                <li>• <strong>Streak Building:</strong> Chain correct answers for multipliers</li>
                <li>• <strong>Layer Timing:</strong> Access higher layers when stable</li>
                <li>• <strong>Endgame Planning:</strong> Prepare for tower instability</li>
              </ul>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Common Mistakes
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>Rushing:</strong> Don&apos;t remove blocks without reading content</li>
                <li>• <strong>Ignoring Dice:</strong> Always check allowed layers</li>
                <li>• <strong>Risk Overload:</strong> Too many red blocks too quickly</li>
                <li>• <strong>Quiz Guessing:</strong> Take time to think through answers</li>
                <li>• <strong>Stability Ignorance:</strong> Monitor tower health constantly</li>
              </ul>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-6">
            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-teal-500/10 border border-teal-400/30 rounded-lg">
                  <div className="font-semibold text-teal-300 mb-1">🎯 Perfect Start</div>
                  <div className="text-teal-200">Begin with 3-4 safe blocks to build stability before taking risks</div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">🎲 Dice Strategy</div>
                  <div className="text-blue-200">Save dice roll 6 for when you need access to all layers</div>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                  <div className="font-semibold text-purple-300 mb-1">📚 Learning Focus</div>
                  <div className="text-purple-200">Read every block&apos;s content - knowledge is more valuable than points</div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <div className="font-semibold text-yellow-300 mb-1">⚖️ Risk Balance</div>
                  <div className="text-yellow-200">Mix 2 safe blocks for every 1 risky block to maintain stability</div>
                </div>
              </div>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Game Mode
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-teal-500/10 border border-teal-400/30 rounded-lg">
                  <div className="font-semibold text-teal-300 mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Learning Mode
                  </div>
                  <div className="text-teal-200">Continuous learning experience with automatic tower resets. Perfect for mastering all 54 privacy concepts without interruption.</div>
                </div>
              </div>
            </div>

            <div className="bitsacco-card p-4">
              <h3 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Learning
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>Real Application:</strong> Apply concepts to your daily online activities</li>
                <li>• <strong>Progressive Learning:</strong> Start with basics, advance to complex topics</li>
                <li>• <strong>Practice Makes Perfect:</strong> Replay to reinforce knowledge</li>
                <li>• <strong>Stay Updated:</strong> Privacy threats evolve - keep learning</li>
                <li>• <strong>Share Knowledge:</strong> Teach others what you learn</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bitsacco-modal w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-teal-400" />
                <h2 className="text-2xl font-bold text-white">Game Help & Information</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <div className="flex space-x-1 p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-teal-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameHelp;
