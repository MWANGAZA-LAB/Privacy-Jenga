import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Play, Shield, Dice1, Trophy, Target, Info } from 'lucide-react';

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
  onStartGame: () => void; // Add this new callback
}

const GameTutorial: React.FC<GameTutorialProps> = ({ isOpen, onClose, onStartTutorial, onStartGame }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInteractiveTutorial, setShowInteractiveTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Privacy Jenga!",
      content: "Learn online privacy and security through an engaging tower-building experience. Each block contains valuable knowledge to protect yourself online.",
      icon: <Shield className="w-8 h-8 text-teal-400" />
    },
    {
      title: "Game Objective",
      content: "Remove blocks from the tower while learning about privacy. The game continues until the tower becomes unstable and collapses. Your goal is to learn as much as possible while building the highest score.",
      icon: <Target className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Block Types",
      content: "🟢 Green (Safe): Good privacy practices that earn points and stabilize the tower\n🔴 Red (Risky): Bad practices that cost points and destabilize the tower\n🟡 Yellow (Challenge): Quiz questions that can swing either way",
      icon: <Info className="w-8 h-8 text-green-400" />
    },
    {
      title: "Dice Mechanics",
      content: "Roll the dice to determine which layers you can pull from:\n1: Layers 1-3 (Safe Zone)\n2: Layers 1-6 (Steady)\n3: Layers 1-9 (Risky)\n4: Layers 1-12 (Danger Zone)\n5: Layers 1-15 (Extreme)\n6: All layers (Ultimate Challenge)",
      icon: <Dice1 className="w-8 h-8 text-purple-400" />
    },
    {
      title: "Scoring System",
      content: "Safe blocks: 15-30 points\nRisky blocks: 25-50 points\nChallenge blocks: 35-70 points (correct answers)\nHigher layers = more points\nStreaks multiply your score!",
      icon: <Trophy className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Strategy Tips",
      content: "• Start with lower layers for safety\n• Build stability with green blocks\n• Answer challenges carefully\n• Plan your dice rolls strategically\n• Balance risk vs. reward",
      icon: <Target className="w-8 h-8 text-orange-400" />
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowInteractiveTutorial(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTutorial = () => {
    setShowInteractiveTutorial(false);
    onStartTutorial();
    onClose();
  };

  const handleStartGame = () => {
    setShowInteractiveTutorial(false);
    onStartGame(); // Call the new callback to start the game
    onClose();
  };

  if (showInteractiveTutorial) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bitsacco-modal w-full max-w-2xl p-8 text-center"
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mb-4">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Start?</h2>
            <p className="text-gray-300">You can now practice with the interactive tutorial or start playing immediately!</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartTutorial}
              className="bitsacco-btn bitsacco-btn-primary"
            >
              Start Interactive Tutorial
            </button>
            <button
              onClick={handleStartGame}
              className="bitsacco-btn bitsacco-btn-secondary"
            >
              Start Playing
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
            className="bitsacco-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-teal-400" />
                <h2 className="text-2xl font-bold text-white">Game Tutorial</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tutorial Content */}
            <div className="p-6">
              <div className="text-center mb-8">
                {tutorialSteps[currentStep].icon}
                <h3 className="text-xl font-bold text-teal-300 mt-4 mb-2">
                  {tutorialSteps[currentStep].title}
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {tutorialSteps[currentStep].content}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-teal-400'
                          : index < currentStep
                          ? 'bg-teal-600'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="bitsacco-btn bitsacco-btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="text-sm text-gray-400">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </div>
                
                <button
                  onClick={handleNext}
                  className="bitsacco-btn bitsacco-btn-primary"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameTutorial;
