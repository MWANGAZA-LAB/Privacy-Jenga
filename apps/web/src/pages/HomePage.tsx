import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Zap, Play, HelpCircle, BookOpen, Trophy, Shield, AlertTriangle } from 'lucide-react';
import GameTutorial from '../components/GameTutorial';
import BitsaccoLogo from '../components/BitsaccoLogo';
import { motion } from 'framer-motion';
import soundManager from '../services/soundManager';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Always show welcome message when visiting homepage
    setShowWelcome(true);
  }, []);

  const handleStartGame = () => {
    soundManager.playGameStart();
    navigate('/game');
  };

  const handleStartTutorial = () => {
    setShowTutorial(false);
    // Tutorial logic can be implemented here
    console.log('Starting interactive tutorial...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Privacy Jenga</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-teal-200 text-sm">×</span>
                <BitsaccoLogo className="w-8 h-8" />
                <span className="text-teal-200 text-sm font-medium">Bitsacco</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTutorial(true)}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                How to Play
              </button>
              <a 
                href="https://bitsacco.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-1 group"
              >
                Bitsacco
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Welcome message - always shown */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-teal-500/10 border border-teal-400/30 rounded-xl relative"
            >
              {/* Close button */}
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute top-3 right-3 text-teal-400 hover:text-teal-300 transition-colors"
                aria-label="Close welcome message"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-teal-400" />
                <h2 className="text-2xl font-bold text-teal-300">Welcome to Privacy Jenga!</h2>
              </div>
              <p className="text-teal-200 text-lg">
                Learn online privacy and security through an engaging tower-building experience. 
                Each block contains valuable knowledge to protect yourself online.
              </p>
            </motion.div>
          )}

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn Privacy Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Interactive Gaming
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Master online privacy and security concepts by playing Privacy Jenga. 
            Remove blocks, answer quizzes, and build your knowledge while the tower grows taller.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleStartGame()}
              onMouseEnter={() => soundManager.playButtonHover()}
              className="bitsacco-btn bitsacco-btn-primary text-lg px-8 py-4 flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Start Playing Now
            </button>
            
            <button
              onClick={() => setShowTutorial(true)}
              onMouseEnter={() => soundManager.playButtonHover()}
              className="bitsacco-btn bitsacco-btn-outline text-lg px-8 py-4 flex items-center gap-3"
            >
              <BookOpen className="w-6 h-6" />
              Learn How to Play
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Privacy Jenga?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our unique approach combines entertainment with education, making privacy learning 
              engaging and memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Learning</h3>
              <p className="text-gray-300">
                Learn through hands-on experience. Each block removal teaches you something new 
                about online privacy and security.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Progressive Difficulty</h3>
              <p className="text-gray-300">
                Start with basic concepts and advance to complex privacy challenges as you 
                build your knowledge tower.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Feedback</h3>
              <p className="text-gray-300">
                Get immediate feedback on your privacy knowledge through quizzes and 
                real-time scoring.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Achievement System</h3>
              <p className="text-gray-300">
                Unlock achievements and track your progress as you become a privacy expert.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Risk Awareness</h3>
              <p className="text-gray-300">
                Understand the real risks of poor privacy practices and learn how to 
                protect yourself online.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bitsacco-card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Practical Skills</h3>
              <p className="text-gray-300">
                Apply what you learn immediately to your daily online activities 
                and digital security practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Continuous Learning Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Master privacy concepts through uninterrupted practice and progressive learning
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Unified Learning Mode */}
            <div className="bitsacco-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Privacy Jenga Learning Mode</h3>
              <p className="text-gray-300 mb-6">
                Progressive learning with intelligent difficulty scaling. When the tower falls, it automatically resets, 
                allowing you to practice privacy concepts, complete interactive quizzes, and unlock achievements.
              </p>
              <ul className="text-left text-gray-300 space-y-2 mb-6 max-w-2xl mx-auto">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  Continuous tower resets for uninterrupted learning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  All 54 privacy tips accessible in one experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  Achievement-based progression system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  Adaptive difficulty based on your skill level
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  Interactive quizzes and privacy challenges
                </li>
              </ul>
              <button
                onClick={() => handleStartGame()}
                className="bitsacco-btn bitsacco-btn-primary text-lg px-8 py-4"
              >
                Start Learning Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Master Online Privacy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners who are already improving their digital security
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleStartGame()}
              className="bitsacco-btn bitsacco-btn-primary text-lg px-8 py-4"
            >
              Start Your Privacy Journey
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="bitsacco-btn bitsacco-btn-outline text-lg px-8 py-4"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Attribution Footer */}
            {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-800 to-cyan-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BitsaccoLogo className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-bold">Privacy Jenga</h3>
                <p className="text-teal-200 text-sm">
                  Educational privacy game powered by Bitsacco
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-teal-200">
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a 
                href="https://bitsacco.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                Bitsacco
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-6 pt-6 text-center text-sm text-teal-300">
            <div className="text-xs text-teal-400">
              Educational content inspired by{' '}
              <a 
                href="https://bitcoinjenga.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-teal-300 transition-colors"
              >
                bitcoinjenga.com
              </a>
              {' '}by Amiti Uttarwar & D++
            </div>
          </div>
        </div>
      </footer>

      {/* Tutorial Modal */}
      <GameTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartTutorial={handleStartTutorial}
        onStartGame={handleStartGame}
      />
    </div>
  );
};

export default HomePage;
