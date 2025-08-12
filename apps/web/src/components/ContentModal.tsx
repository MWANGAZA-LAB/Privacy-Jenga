import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Content } from '@/types';

interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onQuizAnswer?: (selectedAnswer: number) => void;
  showQuiz?: boolean;
}

const ContentModal: React.FC<ContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onQuizAnswer,
  showQuiz = true
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!content) return null;

  const getSeverityIcon = (severity: Content['severity']) => {
    switch (severity) {
      case 'tip':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getSeverityBadge = (severity: Content['severity']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (severity) {
      case 'tip':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer !== null && onQuizAnswer) {
      onQuizAnswer(selectedAnswer);
      setQuizSubmitted(true);
      setShowExplanation(true);
    }
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setShowExplanation(false);
    onClose();
  };

  const isCorrectAnswer = selectedAnswer === content.quiz?.correctIndex;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(content.severity)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {content.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={getSeverityBadge(content.severity)}>
                        {content.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Lesson Text */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Privacy Lesson
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {content.text}
                </p>
              </div>

              {/* Quiz Section */}
              {content.quiz && showQuiz && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Test Your Knowledge
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-4">
                      {content.quiz.question}
                    </p>
                    
                    <div className="space-y-3">
                      {content.quiz.choices.map((choice: string, index: number) => (
                        <motion.label
                          key={index}
                          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedAnswer === index
                              ? quizSubmitted
                                ? index === content.quiz!.correctIndex
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          } ${quizSubmitted ? 'cursor-default' : ''}`}
                          whileHover={!quizSubmitted ? { scale: 1.02 } : {}}
                          whileTap={!quizSubmitted ? { scale: 0.98 } : {}}
                        >
                          <input
                            type="radio"
                            name="quiz-answer"
                            value={index}
                            checked={selectedAnswer === index}
                            onChange={() => !quizSubmitted && setSelectedAnswer(index)}
                            disabled={quizSubmitted}
                            className="sr-only"
                          />
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-3 ${
                            selectedAnswer === index
                              ? quizSubmitted
                                ? index === content.quiz!.correctIndex
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                : 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswer === index && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className={`flex-1 ${
                            selectedAnswer === index && quizSubmitted
                              ? index === content.quiz!.correctIndex
                                ? 'text-green-800 font-medium'
                                : 'text-red-800 font-medium'
                              : 'text-gray-700'
                          }`}>
                            {choice}
                          </span>
                          {quizSubmitted && selectedAnswer === index && (
                            <div className="ml-2">
                              {index === content.quiz!.correctIndex ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Quiz Actions */}
                  {!quizSubmitted && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedAnswer === null}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}

                  {/* Quiz Result */}
                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-lg ${
                        isCorrectAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrectAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`font-medium ${
                          isCorrectAnswer ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {isCorrectAnswer ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {showExplanation && (
                        <p className={`text-sm ${
                          isCorrectAnswer ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {isCorrectAnswer ? 'Great job! You understand this privacy concept well.' : 'Keep learning! Privacy is an ongoing journey.'}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Privacy education powered by Bitsacco
                </div>
                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Continue Game
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
