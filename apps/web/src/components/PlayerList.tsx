import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Clock } from 'lucide-react';
import { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  currentTurn: string;
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentTurn, currentPlayerId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Players</h3>
        <div className="text-sm text-gray-500">
          {players.length} player{players.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              player.id === currentTurn
                ? 'border-primary-300 bg-primary-50 shadow-sm'
                : 'border-gray-200 bg-gray-50'
            } ${
              player.id === currentPlayerId
                ? 'ring-2 ring-blue-500 ring-opacity-50'
                : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar and Status */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  player.id === currentTurn
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {player.avatar}
                </div>
                
                {/* Turn indicator */}
                {player.id === currentTurn && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Clock className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Player Info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    player.id === currentPlayerId ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {player.nickname}
                    {player.id === currentPlayerId && ' (You)'}
                  </span>
                  
                  {/* Host indicator */}
                  {player.isHost && (
                    <div className="relative group">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Host
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  {player.points} point{player.points !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Rank */}
            <div className="flex items-center gap-2">
              {index === 0 && player.points > 0 && (
                <div className="text-yellow-500 font-bold text-sm">
                  🏆 #{index + 1}
                </div>
              )}
              {index > 0 && (
                <div className="text-gray-400 font-medium text-sm">
                  #{index + 1}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {currentTurn && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>
                {players.find(p => p.id === currentTurn)?.nickname || 'Someone'}&apos;s turn
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
