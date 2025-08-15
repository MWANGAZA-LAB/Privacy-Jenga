import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Gamepad2, HelpCircle } from 'lucide-react';
import { GameState } from '../../types';

interface TowerControlsProps {
  gameState: GameState | null;
  maxAllowedLayer: number;
  onToggleHelp: () => void;
  onToggleGameInfo: () => void;
  showHelp: boolean;
  showGameInfo: boolean;
}

export const TowerControls: React.FC<TowerControlsProps> = ({
  gameState,
  maxAllowedLayer,
  onToggleHelp,
  onToggleGameInfo,
  showHelp,
  showGameInfo
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!gameState) return null;

  // REMOVED: Unused stability functions since we removed the stability display

  const getLayerDescription = (maxLayer: number) => {
    if (maxLayer <= 3) return '1-3 (Safe Zone)';
    if (maxLayer <= 6) return `1-${maxLayer} (Steady)`;
    if (maxLayer <= 9) return `1-${maxLayer} (Risky)`;
    if (maxLayer <= 12) return `1-${maxLayer} (Danger)`;
    if (maxLayer <= 15) return `1-${maxLayer} (Extreme)`;
    return '1-18 (Ultimate)';
  };

  return (
    <div className="absolute top-4 right-4 z-20 space-y-2">
      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-gray-600/50 hover:bg-gray-700/80 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-semibold">Controls</span>
          {isVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Controls Panel */}
      {isVisible && (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-600/50 space-y-3 min-w-64">
          
          {/* Game Information Toggle */}
          <button
            onClick={onToggleGameInfo}
            className="w-full flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <Info className="w-4 h-4 text-teal-400" />
              Game Information
            </div>
            {showGameInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Game Information Panel */}
          {showGameInfo && (
            <div className="p-4 space-y-4 max-w-sm">
              {/* Available Layers */}
              <div className="text-center p-3 bg-teal-500/10 border border-teal-400/30 rounded-lg">
                <div className="text-teal-300 text-sm font-semibold mb-1">Available Layers</div>
                <div className="text-white text-lg font-bold">
                  {getLayerDescription(maxAllowedLayer)}
                </div>
                <div className="text-teal-200 text-xs mt-1">Roll dice to change access</div>
              </div>

              {/* Block Types Legend */}
              <div className="space-y-2">
                <div className="text-gray-300 text-sm font-semibold text-center">Block Types</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-400/30 rounded">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-green-300 font-medium">Safe (Green)</span>
                    <span className="text-green-200 text-xs">+Points, +Stability</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-400/30 rounded">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-yellow-300 font-medium">Challenge</span>
                    <span className="text-yellow-200 text-xs">Quiz Questions</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-400/30 rounded">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-red-300 font-medium">Risky</span>
                    <span className="text-red-200 text-xs">+Points, -Stability</span>
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-500/10 border border-blue-400/30 rounded">
                  <div className="text-blue-300 font-semibold">Score</div>
                  <div className="text-white text-lg">{gameState.currentScore}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Help Toggle */}
          <button
            onClick={onToggleHelp}
            className="w-full flex items-center justify-center gap-2 p-3 bg-teal-600/20 hover:bg-teal-600/30 rounded-lg border border-teal-400/30 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300 text-sm font-semibold">
              {showHelp ? 'Hide Help' : 'Quick Help'}
            </span>
          </button>

          {/* Quick Help Panel */}
          {showHelp && (
            <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-400/30">
              <h4 className="font-semibold text-teal-300 mb-2 text-sm">Keyboard Controls:</h4>
              <div className="text-teal-200 text-xs space-y-1">
                <div>↑↓←→ Navigate blocks</div>
                <div>Enter/Space Select block</div>
                <div>H Toggle help</div>
                <div>I Toggle game info</div>
                <div>Esc Clear selection</div>
              </div>
            </div>
          )}

          {/* Control Hints */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Gamepad2 className="w-3 h-3" />
              <span>Keyboard & Mouse Supported</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
