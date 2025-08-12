import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Users, Shield, Brain, Target, Zap } from 'lucide-react';
import { mockGameService } from '../services/mockGameService';

const HomePage: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const room = await mockGameService.createRoom();
      navigate(`/game?room=${room.code}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    
    setIsJoining(true);
    try {
      const room = await mockGameService.joinRoom(roomCode.trim());
      if (room) {
        navigate(`/game?room=${room.code}`);
      } else {
        alert('Room not found or full');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Privacy Education',
      description: 'Learn about online privacy through interactive gameplay'
    },
    {
      icon: Brain,
      title: 'Smart Challenges',
      description: 'Answer quiz questions to earn points and stabilize the tower'
    },
    {
      icon: Target,
      title: 'Strategic Gameplay',
      description: '54 blocks with different risk levels and educational content'
    },
    {
      icon: Zap,
      title: 'Dynamic Difficulty',
      description: 'Dice mechanics and layer restrictions add strategic depth'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%2300d4aa&quot; fill-opacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mb-4 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="bitsacco-heading mb-4">
            PRIVACY • JENGA • CHALLENGE
          </h1>
          
          <p className="bitsacco-subheading mb-6">
            EDUCATE • PROTECT • EMPOWER
          </p>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Master the art of online privacy through an engaging Jenga experience. 
            Remove blocks, answer privacy questions, and build your knowledge while 
            testing your tower-building skills.
          </p>
        </motion.header>

        {/* Main Actions */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="bitsacco-btn bitsacco-btn-primary flex items-center gap-3 min-w-[200px] justify-center"
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isCreating ? 'Creating...' : 'Start New Game'}
          </button>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="bitsacco-input w-48 text-center"
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
            <button
              onClick={handleJoinRoom}
              disabled={isJoining || !roomCode.trim()}
              className="bitsacco-btn bitsacco-btn-secondary flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isJoining ? (
                <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Users className="w-4 h-4" />
              )}
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bitsacco-card bitsacco-card-hover p-6 text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mb-4 group-hover:from-teal-400 group-hover:to-teal-500 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-300 group-hover:text-teal-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Stats Preview */}
        <motion.div 
          className="bitsacco-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-teal-300">
            Game Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">54</div>
              <div className="text-gray-300 text-sm">Total Blocks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">18</div>
              <div className="text-gray-300 text-sm">Layers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">3</div>
              <div className="text-gray-300 text-sm">Block Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-2">∞</div>
              <div className="text-gray-300 text-sm">Replayability</div>
            </div>
          </div>
          
          <p className="text-gray-400 mt-6 text-sm">
            Each block contains valuable privacy knowledge. Learn while you play!
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="text-center mt-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm">
            Built with ❤️ for privacy education • Powered by React & Three.js
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default HomePage;
