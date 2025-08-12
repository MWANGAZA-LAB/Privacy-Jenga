import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  currentTurn: string;
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentTurn, currentPlayerId }) => {
  // Sort players by host status (host first)
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    return 0;
  });

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
            key={player.nickname}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              player.nickname === currentTurn
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Player Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {player.nickname.charAt(0).toUpperCase()}
              </div>
              
              {/* Host Crown */}
              {player.isHost && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center" title="Host">
                  👑
                </div>
              )}
              
              {/* Current Turn Indicator */}
              {player.nickname === currentTurn && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${
                  player.nickname === currentTurn ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {player.nickname}
                  {player.nickname === currentPlayerId && ' (You)'}
                </span>
                
                {/* Host Badge */}
                {player.isHost && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                    Host
                  </span>
                )}
              </div>
              
              {/* Turn Status */}
              <div className="text-sm text-gray-500">
                {player.nickname === currentTurn ? 'Current Turn' : 'Waiting'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Turn Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700 mb-1">
          Current Turn
        </div>
        <div className="text-lg font-semibold text-blue-600">
          {players.find(p => p.nickname === currentTurn)?.nickname || 'Someone'}&apos;s turn
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
