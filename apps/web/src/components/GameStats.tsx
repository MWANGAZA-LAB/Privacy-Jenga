import React from 'react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { GameStatsProps } from '../types';

const GameStats: React.FC<GameStatsProps> = ({ gameState, onNewGame, onEndlessMode }) => {
  const getTowerStability = () => {
    const remainingBlocks = gameState.totalBlocks - gameState.blocksRemoved;
    const percentage = (remainingBlocks / gameState.totalBlocks) * 100;
    
    if (percentage > 80) return { color: 'text-green-600', status: 'Very Stable' };
    if (percentage > 60) return { color: 'text-yellow-600', status: 'Stable' };
    if (percentage > 40) return { color: 'text-orange-600', status: 'Unstable' };
    if (percentage > 20) return { color: 'text-red-600', status: 'Very Unstable' };
    return { color: 'text-red-800', status: 'Critical' };
  };

  const getDiceEffect = () => {
    if (gameState.diceResult === 0) return 'Roll the dice to start!';
    
    const diceEffects = {
      1: 'Safe Zone - Only bottom 3 layers',
      2: 'Steady - Bottom 6 layers',
      3: 'Risky - Bottom 9 layers',
      4: 'Danger Zone - Bottom 12 layers',
      5: 'Extreme - Bottom 15 layers',
      6: 'Ultimate Challenge - All layers'
    };
    
    return diceEffects[gameState.diceResult as keyof typeof diceEffects] || 'Unknown effect';
  };

  return (
    <div className="space-y-6">
      {/* Game Mode & Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Game Controls</h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
              🎲 Dice: {gameState.diceResult > 0 ? gameState.diceResult : 'Not Rolled'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onNewGame}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
          >
            <Play className="w-5 h-5" />
            New Game
          </button>
          
          <button
            onClick={onEndlessMode}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Endless Mode
          </button>
        </div>
      </div>

      {/* Current Game Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Game</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{gameState.currentScore}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{gameState.blocksRemoved}</div>
            <div className="text-sm text-gray-600">Blocks Removed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{gameState.towerHeight.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Tower Height</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTowerStability().color}`}>
              {getTowerStability().status}
            </div>
            <div className="text-sm text-gray-600">Stability</div>
          </div>
        </div>

        {/* Tower Stability Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Stability</span>
            <span>{((gameState.totalBlocks - gameState.blocksRemoved) / gameState.totalBlocks * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full"
              style={{ width: `${(gameState.totalBlocks - gameState.blocksRemoved) / gameState.totalBlocks * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Player Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gameState.currentPlayer.highScore}</div>
            <div className="text-sm text-gray-600">High Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{gameState.currentPlayer.gamesPlayed}</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{gameState.currentPlayer.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{gameState.currentPlayer.achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {gameState.currentPlayer.achievements.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Recent Achievements
          </h3>
          
          <div className="space-y-3">
            {gameState.currentPlayer.achievements.slice(-3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                  <div className="text-lg font-bold text-yellow-600">+{achievement.points}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dice Information */}
      <div className="bitsacco-card p-4">
        <h4 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Dice Status
        </h4>
        
        <div className="text-center">
          {gameState.diceResult > 0 ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-teal-400">
                🎲 {gameState.diceResult}
              </div>
              <div className="text-sm text-gray-300">
                {getDiceEffect()}
              </div>
              <div className="text-xs text-gray-400">
                Available layers: {gameState.canPullFromLayers.join(', ')}
              </div>
            </div>
          ) : (
            <div className="text-gray-400">
              <div className="text-2xl mb-2">🎲</div>
              <div className="text-sm">Roll the dice to start!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
