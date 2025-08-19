import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Zap, Play, HelpCircle, BookOpen, Trophy, Shield, AlertTriangle, X, ExternalLink } from 'lucide-react';
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
    console.log('Starting interactive tutorial...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile-First Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Privacy Jenga</h1>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTutorial(true)}
                className="p-2 text-teal-400 hover:text-teal-300 transition-colors"
                title="How to Play"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <a 
                href="https://bitsacco.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-teal-400 hover:text-teal-300 transition-colors"
                title="Visit Bitsacco"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-First Hero Section */}
      <section className="px-4 py-6">
        {/* Welcome Message */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-teal-500/10 border border-teal-400/30 rounded-xl relative"
          >
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-2 right-2 text-teal-400 hover:text-teal-300 transition-colors p-1"
              aria-label="Close welcome message"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-teal-300">Welcome to Privacy Jenga!</h2>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed">
              Learn online privacy and security through an engaging tower-building experience. 
              Each block contains valuable knowledge to protect yourself online.
            </p>
          </motion.div>
        )}

        {/* Main Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Learn Privacy Through
          </h1>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Interactive Gaming
          </h2>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-center mb-8 leading-relaxed">
          Master online privacy and security concepts by playing Privacy Jenga. 
          Remove blocks, answer quizzes, and build your knowledge while the tower remains stable.
        </p>

        {/* Primary CTA */}
        <div className="mb-8">
          <button
            onClick={handleStartGame}
            onMouseEnter={() => soundManager.playButtonHover()}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Start Playing Now
          </button>
        </div>

        {/* Secondary CTA */}
        <div className="mb-8">
          <button
            onClick={() => setShowTutorial(true)}
            onMouseEnter={() => soundManager.playButtonHover()}
            className="w-full border-2 border-teal-500 text-teal-400 bg-transparent font-semibold py-3 px-6 rounded-xl hover:bg-teal-500/10 hover:border-teal-400 hover:text-teal-300 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <BookOpen className="w-5 h-5" />
            Learn How to Play
          </button>
        </div>
      </section>

      {/* Mobile-First Features Section */}
      <section className="px-4 py-8 bg-black/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Why Privacy Jenga?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Our unique approach combines entertainment with education, making privacy learning 
            engaging and memorable.
          </p>
        </div>

        <div className="space-y-4">
          {/* Feature 1 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Interactive Learning</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Learn through hands-on experience. Each block removal teaches you something new 
                  about online privacy and security.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Progressive Difficulty</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Start with basic concepts and advance to complex privacy challenges as you 
                  build your knowledge tower.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Feedback</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Get immediate feedback on your privacy knowledge through quizzes and 
                  real-time scoring.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Achievement System</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Unlock achievements and track your progress as you become a privacy expert.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Risk Awareness</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Understand the real risks of poor privacy practices and learn how to 
                  protect yourself online.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Practical Skills</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Apply what you learn immediately to your daily online activities 
                  and digital security practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-First Game Mode Section */}
      <section className="px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-3">
            Continuous Learning Experience
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Master privacy concepts through uninterrupted practice and progressive learning
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Privacy Jenga Learning Mode</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Progressive learning with intelligent difficulty scaling. When the tower falls, it automatically resets, 
              allowing you to practice privacy concepts, complete interactive quizzes, and unlock achievements.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-300 text-sm">Continuous tower resets for uninterrupted learning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-300 text-sm">All 54 privacy tips accessible in one experience</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-300 text-sm">Achievement-based progression system</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-300 text-sm">Adaptive difficulty based on your skill level</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></div>
              <span className="text-gray-300 text-sm">Interactive quizzes and privacy challenges</span>
            </div>
          </div>
          
          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Start Learning Journey
          </button>
        </div>
      </section>

      {/* Mobile-First CTA Section */}
      <section className="px-4 py-8 bg-gradient-to-r from-teal-500/10 to-blue-500/10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Master Online Privacy?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Join thousands of learners who are already improving their digital security
          </p>
          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Start Your Privacy Journey
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="w-full border-2 border-teal-500 text-teal-400 bg-transparent font-semibold py-3 px-6 rounded-xl hover:bg-teal-500/10 hover:border-teal-400 hover:text-teal-300 transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Mobile-First Footer */}
      <footer className="bg-gradient-to-r from-teal-800 to-cyan-700 text-white px-4 py-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BitsaccoLogo className="w-6 h-6" />
            <h3 className="text-lg font-bold">Privacy Jenga</h3>
          </div>
          <p className="text-teal-200 text-sm">
            Educational privacy game powered by Bitsacco
          </p>
        </div>
        
        <div className="flex justify-center gap-6 text-sm text-teal-200 mb-4">
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
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Bitsacco
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="border-t border-teal-800 pt-4 text-center">
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
