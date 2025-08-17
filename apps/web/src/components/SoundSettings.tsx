import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Zap, Settings } from 'lucide-react';
import soundManager from '../services/soundManager';
import type { SoundSettings } from '../services/soundManager';

interface SoundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<SoundSettings>(soundManager.getSettings());

  useEffect(() => {
    setSettings(soundManager.getSettings());
  }, [isOpen]);

  const handleSettingChange = (key: keyof SoundSettings, value: number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    soundManager.updateSettings(newSettings);
  };

  const handleToggleSound = () => {
    soundManager.toggleSound();
    setSettings(soundManager.getSettings());
  };

  const handleTestSound = (type: 'music' | 'sfx') => {
    if (type === 'music') {
      soundManager.startBackgroundMusic();
      setTimeout(() => soundManager.stopMusic(), 3000);
    } else {
      soundManager.playButtonClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Sound Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Master Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {settings.enabled ? (
                <Volume2 className="w-5 h-5 text-green-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white font-semibold">Sound</span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                settings.enabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {settings.enabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="space-y-6">
          {/* Master Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Master Volume</span>
              </div>
              <span className="text-gray-400 text-sm">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.masterVolume}
              onChange={(e) => handleSettingChange('masterVolume', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={!settings.enabled}
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">Music Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{Math.round(settings.musicVolume * 100)}%</span>
                <button
                  onClick={() => handleTestSound('music')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                  disabled={!settings.enabled}
                >
                  Test
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.musicVolume}
              onChange={(e) => handleSettingChange('musicVolume', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={!settings.enabled}
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">Sound Effects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{Math.round(settings.sfxVolume * 100)}%</span>
                <button
                  onClick={() => handleTestSound('sfx')}
                  className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                  disabled={!settings.enabled}
                >
                  Test
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sfxVolume}
              onChange={(e) => handleSettingChange('sfxVolume', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={!settings.enabled}
            />
          </div>
        </div>

        {/* Audio Info */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Audio Features</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Background music with ambient sounds</li>
            <li>• Block interaction sound effects</li>
            <li>• Achievement and warning sounds</li>
            <li>• Tower collapse and stability effects</li>
            <li>• Button hover and click feedback</li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundSettings;
