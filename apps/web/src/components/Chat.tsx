import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  currentPlayerId?: string;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, disabled = false, currentPlayerId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const recentMessages = messages.slice(-50); // Keep only recent messages for performance

  return (
    <div className="card">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          {messages.length > 0 && (
            <span className="badge bg-primary-100 text-primary-800">
              {messages.length}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          ▼
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              {/* Messages */}
              <div className="h-48 overflow-y-auto mb-4 space-y-2 scrollbar-hide">
                {recentMessages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  recentMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.playerId === currentPlayerId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.playerId === currentPlayerId
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {msg.playerId !== currentPlayerId && (
                          <div className="text-xs opacity-75 mb-1">
                            {msg.nickname}
                          </div>
                        )}
                        <div className="text-sm">
                          {msg.message}
                        </div>
                        <div className={`text-xs mt-1 ${
                          msg.playerId === currentPlayerId ? 'text-primary-200' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={disabled ? "Chat disabled" : "Type a message..."}
                  disabled={disabled}
                  maxLength={200}
                  className="input flex-1 text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || disabled}
                  className="btn-primary px-3 py-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Character count */}
              {inputMessage.length > 150 && (
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {inputMessage.length}/200
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
