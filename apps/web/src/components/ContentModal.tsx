import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Content, GameState } from '../types';

interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => Promise<void>;
  showQuiz?: boolean;
  gameState: GameState;
}

const ContentModal: React.FC<ContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onQuizAnswer,
  showQuiz = false,
  gameState
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || !onQuizAnswer) return;
    
    setIsSubmitting(true);
    try {
      await onQuizAnswer(selectedAnswer);
    } finally {
      setIsSubmitting(false);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'tip':
        return 'border-green-400 bg-green-400/10';
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'critical':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-blue-400 bg-blue-400/10';
    }
  };

  if (!content) return null;

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
            className="bitsacco-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                {getSeverityIcon(content.severity)}
                <div>
                  <h2 className="text-xl font-bold text-white">{content.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(content.severity)}`}>
                      {content.severity.charAt(0).toUpperCase() + content.severity.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs text-teal-300">
                      {content.points} points
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300">
                      {content.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  {content.text}
                </p>
                
                {/* Educational Fact */}
                <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-1">Did You Know?</h4>
                      <p className="text-blue-200 text-sm">{content.fact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Section */}
              {showQuiz && content.quiz && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Privacy Challenge
                    </h3>
                    <p className="text-yellow-200 mb-4">{content.quiz.question}</p>
                    
                    <div className="space-y-2">
                      {content.quiz.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(index)}
                          disabled={isSubmitting}
                          className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                            selectedAnswer === index
                              ? 'border-teal-400 bg-teal-400/20 text-teal-200'
                              : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          {choice}
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswer !== null && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={handleAnswerSubmit}
                          disabled={isSubmitting}
                          className="bitsacco-btn bitsacco-btn-primary flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                        </button>
                        
                        <button
                          onClick={() => setSelectedAnswer(null)}
                          disabled={isSubmitting}
                          className="bitsacco-btn bitsacco-btn-outline"
                        >
                          Change Answer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Game State Info */}
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h4 className="font-semibold text-gray-300 mb-2">Current Game Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="ml-2 text-teal-400 font-semibold">{gameState.currentScore}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Blocks Removed:</span>
                    <span className="ml-2 text-red-400 font-semibold">{gameState.blocksRemoved}/54</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tower Height:</span>
                    <span className="ml-2 text-blue-400 font-semibold">{gameState.towerHeight}/18</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Game Mode:</span>
                    <span className="ml-2 text-purple-400 font-semibold capitalize">{gameState.gameMode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Impact: <span className={`font-medium ${
                  content.impact === 'positive' ? 'text-green-400' : 
                  content.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {content.impact.charAt(0).toUpperCase() + content.impact.slice(1)}
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="bitsacco-btn bitsacco-btn-secondary"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
