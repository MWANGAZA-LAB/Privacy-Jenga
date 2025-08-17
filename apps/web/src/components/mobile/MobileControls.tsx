import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, HelpCircle, Brain, Home } from 'lucide-react';
import { MobileControlsProps } from '../../types';
import { useResponsiveDesign } from '../../hooks/useResponsiveDesign';

export const MobileControls: React.FC<MobileControlsProps> = ({
  onReset,
  onHelp,
  onTutorial
}) => {
  const { isSmallMobile } = useResponsiveDesign();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className={`flex items-center gap-2 bg-black/90 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-600/50 ${
        isSmallMobile ? 'gap-1 px-2' : 'gap-3 px-4'
      }`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onReset}
          className={`bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors ${
            isSmallMobile ? 'p-2' : 'p-3'
          }`}
          title="Reset Game"
        >
          <RefreshCw className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onHelp}
          className={`bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors ${
            isSmallMobile ? 'p-2' : 'p-3'
          }`}
          title="Game Help"
        >
          <HelpCircle className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onTutorial}
          className={`bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors ${
            isSmallMobile ? 'p-2' : 'p-3'
          }`}
          title="Game Tutorial"
        >
          <Brain className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.href = '/'}
          className={`bg-gray-600 hover:bg-gray-700 rounded-full text-white transition-colors ${
            isSmallMobile ? 'p-2' : 'p-3'
          }`}
          title="Back to Menu"
        >
          <Home className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
        </motion.button>
      </div>
    </div>
  );
};
