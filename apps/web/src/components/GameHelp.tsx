import React from 'react';
import { X, HelpCircle, BookOpen, Target, Zap, Shield, AlertTriangle, Star, Brain, Gamepad2 } from 'lucide-react';
import { GameHelpProps } from '../types';

const GameHelp: React.FC<GameHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Privacy Jenga Help</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Game Overview */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-400" />
              Game Overview
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p className="text-gray-300">
                Privacy Jenga is an educational game that teaches Bitcoin privacy concepts through interactive block removal.
                Learn about on-chain privacy, off-chain solutions, and best practices while maintaining tower stability.
              </p>
              <ul className="text-gray-300 space-y-1 ml-4">
                <li>• <strong>Direct Interaction:</strong> Click on any block to reveal content</li>
                <li>• <strong>Learning:</strong> Each block contains privacy tips or quiz questions</li>
                <li>• <strong>Stability:</strong> Wrong answers decrease tower stability</li>
                <li>• <strong>Continuous Learning:</strong> Tower rebuilds until all 54 concepts are learned</li>
              </ul>
            </div>
          </section>

          {/* Category System */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Category System
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p className="text-gray-300">
                The game uses a category-based system where different blocks represent different privacy concepts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-300 font-semibold">On-Chain Privacy</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-5">CoinJoin, Schnorr signatures, Taproot</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-300 font-semibold">Off-Chain Solutions</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-5">Lightning Network, state channels</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-300 font-semibold">Coin Mixing</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-5">Privacy tools and techniques</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-300 font-semibold">Wallet Setup</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-5">Security and privacy configuration</p>
                </div>
              </div>
            </div>
          </section>

          {/* Block Types */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              Block Types
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-400/30">
                  <div className="text-2xl mb-2">🟢</div>
                  <h4 className="font-semibold text-green-300 mb-1">Green Blocks</h4>
                  <p className="text-xs text-gray-300">Bottom layers - Safe content</p>
                </div>
                <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-400/30">
                  <div className="text-2xl mb-2">🟠</div>
                  <h4 className="font-semibold text-orange-300 mb-1">Orange Blocks</h4>
                  <p className="text-xs text-gray-300">Middle layers - Medium difficulty</p>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-400/30">
                  <div className="text-2xl mb-2">🔴</div>
                  <h4 className="font-semibold text-red-300 mb-1">Red Blocks</h4>
                  <p className="text-xs text-gray-300">Top layers - Risky content</p>
                </div>
              </div>
            </div>
          </section>

          {/* Strategy Tips */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-teal-400" />
              Strategy Tips
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">🎯 Category Strategy</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Start with beginner categories</li>
                    <li>• Focus on one category at a time</li>
                    <li>• Build knowledge systematically</li>
                    <li>• Use category rotation for variety</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">🏗️ Tower Management</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Remove blocks evenly from all sides</li>
                    <li>• Avoid creating unstable configurations</li>
                    <li>• Monitor stability meter closely</li>
                    <li>• Plan your moves ahead</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Learning Objectives */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Learning Objectives
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p className="text-gray-300">
                By playing Privacy Jenga, you&apos;ll learn about:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-300">Privacy Fundamentals</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Transaction privacy</li>
                    <li>• Address reuse prevention</li>
                    <li>• Network analysis resistance</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-300">Advanced Techniques</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• CoinJoin implementation</li>
                    <li>• Lightning privacy</li>
                    <li>• Regulatory compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              Common Mistakes
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-red-300">Ignoring Categories</h4>
                    <p className="text-sm text-gray-400">Always check which category is currently highlighted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-red-300">Rushing Through</h4>
                    <p className="text-sm text-gray-400">Take time to read and understand the content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-red-300">Ignoring Stability</h4>
                    <p className="text-sm text-gray-400">Watch the stability meter and plan accordingly</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Tips */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Advanced Tips
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">🎯 Category Mastery</h4>
                  <div className="text-blue-200 text-sm">
                    Master one category completely before moving to the next for better learning retention
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-300 mb-2">🏗️ Tower Balance</h4>
                  <div className="text-green-200 text-sm">
                    Maintain even weight distribution by removing blocks from opposite sides
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Game Controls */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-blue-400" />
              Game Controls
            </h3>
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">Mouse Controls</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>Click:</strong> Select and interact with blocks</li>
                    <li>• <strong>Hover:</strong> Preview block information</li>
                    <li>• <strong>Scroll:</strong> Zoom in/out of the tower</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">Keyboard Shortcuts</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>R:</strong> Reset tower</li>
                    <li>• <strong>H:</strong> Toggle help</li>
                    <li>• <strong>ESC:</strong> Close modals</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-700/30">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Need more help? Check out the tutorial or contact support.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHelp;
