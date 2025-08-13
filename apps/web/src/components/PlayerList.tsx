import React from 'react';
import { Player, GameState } from '../types';
import { Crown, Trophy, Star } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  currentTurn?: string;
  currentPlayerId?: string;
  gameState: GameState;
}

const PlayerList: React.FC<PlayerListProps> = ({ 
  players, 
  currentTurn, 
  currentPlayerId,
  gameState 
}) => {
  // Sort players: host first, then by score
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isHost && !b.isHost) return -1;
    if (!a.isHost && b.isHost) return 1;
    return b.score - a.score;
  });

  return (
    <div className="bitsacco-card p-4">
      <h3 className="text-lg font-semibold text-teal-300 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5" />
        Players ({players.length})
      </h3>
      
      <div className="space-y-3">
        {sortedPlayers.map((player) => (
          <div
            key={player.nickname}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              player.nickname === currentTurn
                ? 'border-teal-400 bg-teal-400/10'
                : 'border-gray-600 bg-gray-700/50'
            } ${
              player.nickname === currentPlayerId
                ? 'ring-2 ring-teal-400'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {player.isHost && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
                <span className="font-medium text-white">
                  {player.nickname}
                </span>
                {player.nickname === currentTurn && (
                  <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded-full">
                    Current Turn
                  </span>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-teal-400">
                  {player.score}
                </div>
                <div className="text-xs text-gray-400">Score</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              <div>
                <span className="text-gray-400">High Score:</span>
                <span className="ml-1 text-yellow-400">{player.highScore}</span>
              </div>
              <div>
                <span className="text-gray-400">Games:</span>
                <span className="ml-1">{player.gamesPlayed}</span>
              </div>
              <div>
                <span className="text-gray-400">Blocks:</span>
                <span className="ml-1">{player.totalBlocksRemoved}</span>
              </div>
              <div>
                <span className="text-gray-400">Correct:</span>
                <span className="ml-1 text-green-400">{player.correctAnswers}</span>
              </div>
            </div>
            
            {player.achievements.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Achievements:</div>
                <div className="flex flex-wrap gap-1">
                  {player.achievements.slice(0, 3).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded text-xs text-yellow-300"
                      title={achievement.description}
                    >
                      <Trophy className="w-3 h-3" />
                      {achievement.name}
                    </div>
                  ))}
                  {player.achievements.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{player.achievements.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Game Stats Summary */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="text-sm text-gray-400 mb-2">Game Progress:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Tower Height:</span>
            <span className="ml-1 text-blue-400">{gameState.towerHeight}/18</span>
          </div>
          <div>
            <span className="text-gray-400">Blocks Removed:</span>
            <span className="ml-1 text-red-400">{gameState.blocksRemoved}/54</span>
          </div>
          <div>
            <span className="text-gray-400">Current Score:</span>
            <span className="ml-1 text-teal-400">{gameState.currentScore}</span>
          </div>
          <div>
            <span className="text-gray-400">Mode:</span>
            <span className="ml-1 text-teal-400">Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
