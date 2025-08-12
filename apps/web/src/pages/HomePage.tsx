import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Users, Shield, BookOpen } from 'lucide-react';
import { mockGameService } from '../services/mockGameService';
import BitsaccoLogo from '../components/BitsaccoLogo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    
    setIsCreating(true);
    try {
      const room = await mockGameService.createRoom();
      // Store player info in localStorage
      localStorage.setItem('playerNickname', nickname);
      localStorage.setItem('currentRoomId', room.id);
      
      navigate('/game');
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !nickname.trim()) return;
    
    try {
      const room = await mockGameService.joinRoom(roomCode);
      if (room) {
        // Store player info in localStorage
        localStorage.setItem('playerNickname', nickname);
        localStorage.setItem('currentRoomId', room.id);
        
        navigate('/game');
      } else {
        alert('Room not found or full');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BitsaccoLogo className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold">Privacy Jenga</h1>
                <p className="text-teal-100">Educational privacy game powered by Bitsacco</p>
              </div>
            </div>
            <div className="flex space-x-4 text-sm">
              <a href="#about" className="hover:text-teal-200 transition-colors">About</a>
              <a href="#privacy" className="hover:text-teal-200 transition-colors">Privacy Policy</a>
              <a 
                href="https://bitsacco.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-200 transition-colors flex items-center space-x-1"
              >
                <span>Bitsacco</span>
                <BookOpen className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="text-center mt-4 text-teal-100">
            Built with ❤️ by MWANGAZA-LAB for Bitsacco education in Africa
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Learn Privacy Through Play
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Master digital privacy and security concepts by playing Jenga. 
              Each block you remove reveals valuable knowledge to protect yourself online.
            </p>
            
            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy First</h3>
                <p className="text-gray-600">Learn essential privacy practices</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Users className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Learning</h3>
                <p className="text-gray-600">Engage with hands-on gameplay</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <BookOpen className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Real Knowledge</h3>
                <p className="text-gray-600">Practical security tips you can use</p>
              </div>
            </div>
          </motion.div>

          {/* Game Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Start Your Privacy Journey
            </h3>
            
            <div className="space-y-6">
              {/* Player Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  maxLength={20}
                />
              </div>

              {/* Create Room */}
              <div className="text-center">
                <button
                  onClick={handleCreateRoom}
                  disabled={!nickname.trim() || isCreating}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{isCreating ? 'Creating...' : 'Create New Game'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Join Room */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={handleJoinRoom}
                    disabled={!roomCode.trim() || !nickname.trim()}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join Existing Game
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              Why Privacy Jenga?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">🎯 Educational Focus</h4>
                <p className="text-gray-600">
                  Every block contains real privacy and security knowledge that you can apply immediately.
                </p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">🚀 Instant Access</h4>
                <p className="text-gray-600">
                  No downloads, no installations. Play directly in your browser on any device.
                </p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">🔒 Privacy by Design</h4>
                <p className="text-gray-600">
                  Built with privacy in mind. No personal data collection, works completely offline.
                </p>
              </div>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">🌍 Global Access</h4>
                <p className="text-gray-600">
                  Available worldwide through GitHub Pages, promoting privacy education globally.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
