import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, AlertCircle, CheckCircle, Volume2, VolumeX } from 'lucide-react';
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
  onQuizAnswer,
  showQuiz = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Enhanced sound effects
  const playSound = useCallback((type: 'open' | 'close' | 'select' | 'submit' | 'correct' | 'incorrect') => {
    if (!soundEnabled) return;
    
    // Simulate sound effects with visual feedback
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'open':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'close':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        break;
      case 'select':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      case 'submit':
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        break;
      case 'correct':
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        break;
      case 'incorrect':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        break;
    }
    
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

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || !onQuizAnswer) return;
    
    setIsSubmitting(true);
    playSound('submit');
    
    try {
      await onQuizAnswer(selectedAnswer);
      playSound('correct');
      setShowExplanation(true);
    } catch (error) {
      playSound('incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    playSound('close');
    onClose();
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
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bitsacco-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center gap-3">
                {getSeverityIcon(content.severity)}
                <div>
                  <h2 className="text-xl font-bold text-white">{content.title}</h2>
                  <div className="text-sm text-gray-400">Privacy Learning</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5 text-teal-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="p-6 space-y-6">
              {/* Main Content */}
              <div className={`p-4 rounded-lg border ${getSeverityColor(content.severity)}`}>
                <div className="text-gray-300 leading-relaxed">{content.text}</div>
              </div>

              {/* Educational Fact */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <div className="text-blue-300 font-semibold mb-2">💡 Did You Know?</div>
                <div className="text-blue-200 text-sm">{content.fact}</div>
              </div>

              {/* Impact Indicator */}
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  content.impact === 'positive' ? 'bg-green-500' :
                  content.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div className="text-gray-300 text-sm">
                  <span className="font-semibold">Impact:</span> {
                    content.impact === 'positive' ? 'This practice improves your privacy' :
                    content.impact === 'negative' ? 'This practice reduces your privacy' :
                    'This practice has neutral impact on privacy'
                  }
                </div>
              </div>

              {/* Quiz Section */}
              {showQuiz && content.quiz && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-teal-300 mb-2">🧠 Privacy Quiz</div>
                    <div className="text-gray-300 text-sm">Test your knowledge!</div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-white font-medium mb-4">{content.quiz.question}</div>
                    
                    <div className="space-y-3">
                      {content.quiz.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedAnswer(index);
                            playSound('select');
                          }}
                          disabled={isSubmitting}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                            selectedAnswer === index
                              ? 'border-teal-400 bg-teal-400/20 text-teal-200 scale-105'
                              : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-600/50 hover:scale-102'
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

              {/* Enhanced Explanation */}
              {showExplanation && content.quiz && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-teal-500/10 border border-teal-400/30 rounded-lg p-4"
                >
                  <div className="text-teal-300 font-semibold mb-2">📚 Explanation</div>
                  <div className="text-teal-200 text-sm">{content.quiz.explanation}</div>
                </motion.div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="text-sm text-gray-400">
                Points: <span className="text-teal-400 font-semibold">+{content.points}</span>
              </div>
              
              <button
                onClick={handleClose}
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
