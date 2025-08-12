import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Play, Users, Shield, Gamepad2, Globe, Award } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { CreateRoomForm, JoinRoomForm } from '@/types';
import BitsaccoLogo from '@/components/BitsaccoLogo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, connected } = useSocket();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [isLoading, setIsLoading] = useState(false);

  const createForm = useForm<CreateRoomForm>({
    defaultValues: {
      nickname: '',
      maxPlayers: 4,
      turnTimeoutSeconds: 60,
      allowChat: true,
      difficulty: 'medium'
    }
  });

  const joinForm = useForm<JoinRoomForm>({
    defaultValues: {
      code: '',
      nickname: ''
    }
  });

  const handleCreateRoom = async (data: CreateRoomForm) => {
    if (!connected) {
      toast.error('Not connected to server');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createRoom(data.nickname, {
        maxPlayers: data.maxPlayers,
        turnTimeoutSeconds: data.turnTimeoutSeconds,
        allowChat: data.allowChat,
        difficulty: data.difficulty
      });

      if (result.success) {
        toast.success(`Room created: ${result.room?.code}`);
        navigate('/game');
      } else {
        toast.error(result.error || 'Failed to create room');
      }
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (data: JoinRoomForm) => {
    if (!connected) {
      toast.error('Not connected to server');
      return;
    }

    setIsLoading(true);
    try {
      const result = await joinRoom(data.code.toUpperCase(), data.nickname);

      if (result.success) {
        toast.success(`Joined room ${data.code.toUpperCase()}`);
        navigate('/game');
      } else {
        toast.error(result.error || 'Failed to join room');
      }
    } catch (error) {
      toast.error('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy Education",
      description: "Learn essential privacy practices through interactive gameplay"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiplayer Fun",
      description: "Play with 2-6 friends in real-time multiplayer rooms"
    },
    {
      icon: <div className="w-8 h-8 flex items-center justify-center">
        <BitsaccoLogo size={24} />
      </div>,
      title: "Bitsacco Integration",
      description: "Earn sats and badges through the Bitsacco ecosystem"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Privacy First",
      description: "No personal data collection, ephemeral rooms, anonymous play"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <div className="w-16 h-16 flex items-center justify-center">
                  <BitsaccoLogo size={56} />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
              Privacy Jenga
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Learn privacy best practices through interactive multiplayer gameplay. 
              Remove blocks, discover lessons, and protect your digital life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('game-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Playing
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                <Award className="w-5 h-5 mr-2" />
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Privacy Jenga?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gamified privacy education that makes learning security practices fun and engaging
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section id="game-section" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Play?
            </h2>
            <p className="text-xl text-gray-600">
              Create a new room or join an existing game with friends
            </p>
          </motion.div>

          <div className="card max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'create'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Gamepad2 className="w-5 h-5 inline mr-2" />
                Create Room
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'join'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Join Room
              </button>
            </div>

            {/* Create Room Form */}
            {activeTab === 'create' && (
              <motion.form
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={createForm.handleSubmit(handleCreateRoom)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Nickname
                  </label>
                  <input
                    {...createForm.register('nickname', { 
                      required: 'Nickname is required',
                      maxLength: { value: 20, message: 'Nickname too long' }
                    })}
                    className="input"
                    placeholder="Enter your nickname"
                  />
                  {createForm.formState.errors.nickname && (
                    <p className="text-red-500 text-sm mt-1">
                      {createForm.formState.errors.nickname.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Players
                    </label>
                    <select {...createForm.register('maxPlayers')} className="input">
                      <option value={2}>2 Players</option>
                      <option value={3}>3 Players</option>
                      <option value={4}>4 Players</option>
                      <option value={5}>5 Players</option>
                      <option value={6}>6 Players</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turn Time
                    </label>
                    <select {...createForm.register('turnTimeoutSeconds')} className="input">
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select {...createForm.register('difficulty')} className="input">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        {...createForm.register('allowChat')}
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable Chat</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !connected}
                  className="btn-primary w-full py-3 text-lg"
                >
                  {isLoading ? (
                    <div className="loading-spinner mx-auto" />
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Create Room
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Join Room Form */}
            {activeTab === 'join' && (
              <motion.form
                key="join"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={joinForm.handleSubmit(handleJoinRoom)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Code
                  </label>
                  <input
                    {...joinForm.register('code', { 
                      required: 'Room code is required',
                      pattern: { value: /^[A-Z0-9]{6}$/, message: 'Invalid room code format' }
                    })}
                    className="input text-center text-lg font-mono tracking-wider"
                    placeholder="ABCD12"
                    maxLength={6}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      joinForm.setValue('code', e.target.value);
                    }}
                  />
                  {joinForm.formState.errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {joinForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Nickname
                  </label>
                  <input
                    {...joinForm.register('nickname', { 
                      required: 'Nickname is required',
                      maxLength: { value: 20, message: 'Nickname too long' }
                    })}
                    className="input"
                    placeholder="Enter your nickname"
                  />
                  {joinForm.formState.errors.nickname && (
                    <p className="text-red-500 text-sm mt-1">
                      {joinForm.formState.errors.nickname.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !connected}
                  className="btn-primary w-full py-3 text-lg"
                >
                  {isLoading ? (
                    <div className="loading-spinner mx-auto" />
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Join Room
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Connection Status */}
            {!connected && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-700 text-sm">
                  Not connected to server. Please wait...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bitsacco Integration Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Bitsacco Teal Horse Logo */}
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <BitsaccoLogo size={56} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Powered by Bitsacco
            </h2>
            <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
              Plan your finances. Save towards targets. Grow your finances together with community, friends and family using Bitcoin.
            </p>
            
            {/* Bitsacco Services Preview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
              <div className="text-left p-4 bg-slate-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Membership & Shares</h3>
                <p className="text-slate-300 text-sm">Become a registered member with shares, earn dividends, and participate in governance.</p>
              </div>
              <div className="text-left p-4 bg-slate-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Personal Savings</h3>
                <p className="text-slate-300 text-sm">Start accumulating wealth in Bitcoin with cost averaging and automated investment strategies.</p>
              </div>
              <div className="text-left p-4 bg-slate-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Chama Savings</h3>
                <p className="text-slate-300 text-sm">Create or join investment groups with friends, family, and colleagues for collective growth.</p>
              </div>
              <div className="text-left p-4 bg-slate-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Loans & Credit</h3>
                <p className="text-slate-300 text-sm">Access loan facilities using Bitcoin savings as collateral with competitive rates.</p>
              </div>
            </div>
            
            <a 
              href="https://bitsacco.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors group"
            >
              Learn More About Bitsacco
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
