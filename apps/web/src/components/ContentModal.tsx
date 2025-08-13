import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, AlertCircle, Volume2, VolumeX, Star, Target, Trophy } from 'lucide-react';
import { Content, GameState } from '../types';

interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => Promise<void>;
  showQuiz?: boolean;
  gameState?: GameState;
}

const ContentModal: React.FC<ContentModalProps> = ({ 
  content, 
  isOpen, 
  onClose, 
  onQuizAnswer
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Enhanced sound effects
  const playSound = useCallback((soundType: 'open' | 'close' | 'select' | 'submit' | 'correct' | 'incorrect') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = {
      open: 800, close: 600, select: 1000, submit: 1200, correct: 1500, incorrect: 300
    };
    
    oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [soundEnabled]);

  // Play sound on modal open
  useEffect(() => {
    if (isOpen) {
      playSound('open');
    }
  }, [isOpen, playSound]);

  if (!content) return null;

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || !onQuizAnswer) return;
    
    try {
      await onQuizAnswer(selectedAnswer);
      playSound('correct');
      // Close modal after quiz answer
      onClose();
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      playSound('incorrect');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'tip':
        return <Shield className="w-6 h-6 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'critical':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Shield className="w-6 h-6 text-blue-400" />;
    }
  };

  const getSeverityClasses = () => {
    switch (content.severity) {
      case 'tip':
        return 'border-green-400 bg-green-400/10 text-green-300';
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10 text-yellow-300';
      case 'critical':
        return 'border-red-400 bg-red-400/10 text-red-300';
      default:
        return 'border-blue-400 bg-blue-400/10 text-blue-300';
    }
  };

  const formatCategoryName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'on-chain-privacy': 'On-Chain Privacy',
      'off-chain-practices': 'Off-Chain Practices',
      'coin-mixing': 'Coin Mixing',
      'wallet-setup': 'Wallet Setup',
      'lightning-network': 'Lightning Network',
      'regulatory': 'Regulatory',
      'best-practices': 'Best Practices'
    };
    return categoryMap[category] || category;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bitsacco-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(content.severity)}
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{content.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`text-sm px-2 py-1 rounded-full inline-block ${getSeverityClasses()}`}>
                        {content.severity.charAt(0).toUpperCase() + content.severity.slice(1)}
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300">
                        {formatCategoryName(content.category)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title={soundEnabled ? 'Disable sound' : 'Enable sound'}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Main Content */}
                <div className="bitsacco-card p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Privacy Tip</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{content.text}</p>
                </div>

                {/* Educational Fact */}
                <div className="bitsacco-card p-4 sm:p-6 bg-blue-500/10 border border-blue-400/30">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Did You Know?
                  </h3>
                  <p className="text-blue-200 text-sm sm:text-base">{content.fact}</p>
                </div>

                {/* Quiz Section */}
                {content.quiz && (
                  <div className="bitsacco-card p-4 sm:p-6 bg-yellow-500/10 border border-yellow-400/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Quiz Challenge
                      </h3>
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm underline"
                      >
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-yellow-200 font-medium">{content.quiz.question}</p>
                      
                      <div className="space-y-3">
                        {content.quiz.choices.map((choice, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            disabled={!onQuizAnswer}
                            className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                              selectedAnswer === index
                                ? 'border-yellow-400 bg-yellow-500/20 text-yellow-200'
                                : 'border-yellow-400/30 hover:border-yellow-400/60 text-yellow-100 hover:bg-yellow-500/10'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {choice}
                          </button>
                        ))}
                      </div>

                      {selectedAnswer !== null && (
                        <div className="mt-4">
                          <button
                            onClick={handleAnswerSubmit}
                            disabled={!onQuizAnswer}
                            className="w-full bitsacco-btn-primary py-3 font-semibold"
                          >
                            Submit Answer
                          </button>
                        </div>
                      )}

                      {showExplanation && (
                        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                          <h4 className="font-semibold text-yellow-300 mb-2">Explanation:</h4>
                          <p className="text-yellow-200 text-sm">{content.quiz.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Points Info */}
                <div className="bitsacco-card p-4 sm:p-6 bg-green-500/10 border border-green-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium">Points Earned:</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{content.points}</div>
                  </div>
                  <p className="text-green-200 text-sm mt-2">
                    {content.quiz ? 'Answer the quiz correctly for bonus points!' : 'Great job learning about privacy!'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
