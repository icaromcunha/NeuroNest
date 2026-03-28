import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageCircle, Volume2, Edit3 } from 'lucide-react';
import { useData } from '../../hooks/useData';

export const CommunicateScreen: React.FC = () => {
  const navigate = useNavigate();
  const { messages } = useData();
  const [message, setMessage] = useState<string | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (label: string) => {
    setMessage(label);
    speak(label);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate('/communicate/edit')}
          className="p-3 rounded-full bg-white shadow-sm text-[#4A90E2] active:scale-95 transition-transform"
        >
          <Edit3 className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-16">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Me expressar</h1>
        <p className="text-xl text-[#6B7280]">Diga o que você precisa agora.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-6 h-96">
          {messages.slice(0, 4).map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option.label)}
              className="w-full h-full p-8 rounded-3xl shadow-sm border border-[#E5E7EB] flex flex-col items-center justify-center text-center space-y-4 active:scale-95 transition-transform"
              style={{ backgroundColor: `${option.color}10` }}
            >
              <div className="p-4 rounded-2xl bg-white shadow-sm">
                <Volume2 className="w-8 h-8" style={{ color: option.color }} />
              </div>
              <span className="text-2xl font-medium text-[#1F2937]">{option.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-[#4A90E2] flex items-center space-x-6"
            >
              <div className="p-3 rounded-full bg-[#4A90E2]10">
                <MessageCircle className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <span className="text-3xl font-bold text-[#1F2937]">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
