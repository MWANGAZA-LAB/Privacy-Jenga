import React from 'react';
import { Play, Pause, RotateCcw, Home, Info, Settings } from 'lucide-react';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

interface MobileControlsProps {
  onBlockSelect: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onConfirmSelection: () => void;
  onCancelSelection: () => void;
  onToggleInfo: () => void;
  onToggleSettings: () => void;
  onResetView: () => void;
  onGoHome: () => void;
  isGamePaused: boolean;
  onTogglePause: () => void;
  selectedBlockId: string | null;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onBlockSelect,
  onConfirmSelection,
  onCancelSelection,
  onToggleInfo,
  onToggleSettings,
  onResetView,
  onGoHome,
  isGamePaused,
  onTogglePause,
  selectedBlockId,
}) => {
  const { isMobile, isTablet, orientation } = useResponsiveDesign();

  if (!isMobile && !isTablet) {
    return null; // Don't show on desktop
  }

  const isPortrait = orientation === 'portrait';

  return (
    <div className="mobile-controls fixed inset-0 pointer-events-none z-50">
      {/* Navigation D-Pad */}
      <div className={`absolute pointer-events-auto ${
        isPortrait 
          ? 'bottom-32 left-4' 
          : 'bottom-4 left-4'
      }`}>
        <div className="relative w-32 h-32">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800/90 rounded-full border border-gray-600" />
          
          {/* Up */}
          <button
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600/90 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold border border-blue-500"
            onTouchStart={() => onBlockSelect('up')}
            onClick={() => onBlockSelect('up')}
          >
            ↑
          </button>
          
          {/* Down */}
          <button
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600/90 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold border border-blue-500"
            onTouchStart={() => onBlockSelect('down')}
            onClick={() => onBlockSelect('down')}
          >
            ↓
          </button>
          
          {/* Left */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-blue-600/90 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold border border-blue-500"
            onTouchStart={() => onBlockSelect('left')}
            onClick={() => onBlockSelect('left')}
          >
            ←
          </button>
          
          {/* Right */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-blue-600/90 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold border border-blue-500"
            onTouchStart={() => onBlockSelect('right')}
            onClick={() => onBlockSelect('right')}
          >
            →
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`absolute pointer-events-auto ${
        isPortrait 
          ? 'bottom-32 right-4' 
          : 'bottom-4 right-4'
      }`}>
        <div className="flex flex-col gap-3">
          {/* Confirm Selection */}
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold border-2 transition-all ${
              selectedBlockId
                ? 'bg-green-600/90 hover:bg-green-500 border-green-400'
                : 'bg-gray-600/50 border-gray-500 cursor-not-allowed'
            }`}
            onTouchStart={selectedBlockId ? onConfirmSelection : undefined}
            onClick={selectedBlockId ? onConfirmSelection : undefined}
            disabled={!selectedBlockId}
          >
            ✓
          </button>
          
          {/* Cancel Selection */}
          <button
            className="w-16 h-16 bg-red-600/90 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-red-400"
            onTouchStart={onCancelSelection}
            onClick={onCancelSelection}
          >
            ✗
          </button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-between items-center">
          {/* Left side controls */}
          <div className="flex gap-2">
            <button
              className="w-12 h-12 bg-gray-800/90 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white border border-gray-600"
              onTouchStart={onGoHome}
              onClick={onGoHome}
            >
              <Home className="w-5 h-5" />
            </button>
            
            <button
              className="w-12 h-12 bg-gray-800/90 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white border border-gray-600"
              onTouchStart={onTogglePause}
              onClick={onTogglePause}
            >
              {isGamePaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex gap-2">
            <button
              className="w-12 h-12 bg-gray-800/90 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white border border-gray-600"
              onTouchStart={onToggleInfo}
              onClick={onToggleInfo}
            >
              <Info className="w-5 h-5" />
            </button>
            
            <button
              className="w-12 h-12 bg-gray-800/90 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white border border-gray-600"
              onTouchStart={onToggleSettings}
              onClick={onToggleSettings}
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              className="w-12 h-12 bg-gray-800/90 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white border border-gray-600"
              onTouchStart={onResetView}
              onClick={onResetView}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Instructions */}
      {isPortrait && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="bg-black/80 rounded-lg p-3 text-center">
            <div className="text-white text-sm font-medium">
              Use D-pad to navigate • ✓ to select • ✗ to cancel
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {selectedBlockId ? 'Block selected - tap ✓ to confirm' : 'Navigate to a block first'}
            </div>
          </div>
        </div>
      )}

      {/* Landscape Instructions */}
      {!isPortrait && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-black/80 rounded-lg px-4 py-2 text-center">
            <div className="text-white text-sm">
              D-pad: Navigate • ✓: Select • ✗: Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
