import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Zap, Play, HelpCircle, BookOpen, Trophy, Shield, AlertTriangle } from 'lucide-react';
import GameTutorial from '../components/GameTutorial';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    // Check if this is the first time visiting
    const hasVisitedBefore = localStorage.getItem('privacy-jenga-has-visited');
    if (!hasVisitedBefore) {
      setIsFirstTime(true);
      localStorage.setItem('privacy-jenga-has-visited', 'true');
    }
  }, []);

  const handleStartGame = () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/game?room=${roomCode}`);
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
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Privacy Jenga</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTutorial(true)}
                className="bitsacco-btn bitsacco-btn-outline flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                How to Play
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* First-time user welcome */}
          {isFirstTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-teal-500/10 border border-teal-400/30 rounded-xl"
            >
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
              onClick={handleStartGame}
              className="bitsacco-btn bitsacco-btn-primary text-lg px-8 py-4 flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Start Playing Now
            </button>
            
            <button
              onClick={() => setShowTutorial(true)}
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
              Choose Your Game Mode
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Two exciting ways to play and learn about privacy
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Classic Mode */}
            <div className="bitsacco-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Classic Mode</h3>
              <p className="text-gray-300 mb-6">
                Experience the traditional Privacy Jenga gameplay. Build your knowledge 
                tower block by block until it reaches its limit.
              </p>
              <ul className="text-left text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Learn at your own pace
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Focus on understanding concepts
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Perfect for beginners
                </li>
              </ul>
              <button
                onClick={handleStartGame}
                className="bitsacco-btn bitsacco-btn-primary w-full"
              >
                Start Classic Game
              </button>
            </div>

            {/* Endless Mode */}
            <div className="bitsacco-card p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Endless Mode</h3>
              <p className="text-gray-300 mb-6">
                Challenge yourself with continuous gameplay. The tower resets after each 
                collapse, letting you build higher scores and deeper knowledge.
              </p>
              <ul className="text-left text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Continuous learning experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Beat your high scores
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Advanced privacy challenges
                </li>
              </ul>
              <button
                onClick={handleStartGame}
                className="bitsacco-btn bitsacco-btn-outline w-full"
              >
                Start Endless Game
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
            Join thousands of players who are already improving their digital security 
            knowledge through Privacy Jenga.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartGame}
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

      {/* Tutorial Modal */}
      <GameTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartTutorial={handleStartTutorial}
      />
    </div>
  );
};

export default HomePage;
