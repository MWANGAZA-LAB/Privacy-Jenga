import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import { useSocket } from './hooks/useSocket';
import BitsaccoLogo from './components/BitsaccoLogo';

function App() {
  const { connected } = useSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Connection Status */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: connected ? -100 : 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium"
      >
        Disconnected from server. Reconnecting...
      </motion.div>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <BitsaccoLogo size={28} />
              </div>
              <h3 className="text-lg font-bold">Privacy Jenga</h3>
            </div>
              <p className="text-teal-200 text-sm">
                Educational privacy game powered by Bitsacco
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-teal-200">
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a 
                href="https://bitsacco.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 group"
              >
                Bitsacco
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-6 pt-6 text-center text-sm text-teal-300">
            Built with ❤️ by MWANGAZA-LAB for Bitsacco education in Africa
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
