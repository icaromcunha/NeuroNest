import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, Trash2, Edit2, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CommunicationScreenProps {
  onBack: () => void;
}

export const CommunicationScreen: React.FC<CommunicationScreenProps> = ({ onBack }) => {
  const { messages, setMessages, settings } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const addMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: newMessage }]);
    setNewMessage('');
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const speak = (text: string) => {
    if (!settings.voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="p-6 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Comunicar</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-3 rounded-2xl ${isEditing ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'} active:scale-90 transition-transform`}
        >
          {isEditing ? <Check size={24} /> : <Edit2 size={24} />}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <button
                  onClick={() => !isEditing && speak(message.text)}
                  className={`w-full p-8 rounded-3xl text-left flex items-center justify-between shadow-sm border transition-all active:scale-[0.98] ${
                    isEditing ? 'bg-white border-gray-200' : 'bg-white border-transparent hover:border-blue-100'
                  }`}
                >
                  <span className="text-2xl font-bold text-gray-800">{message.text}</span>
                  {!isEditing && <MessageSquare size={24} className="text-blue-400" />}
                </button>
                
                {isEditing && (
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col space-y-4"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nova mensagem..."
                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button
                onClick={addMessage}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <Plus size={20} />
                <span>Adicionar</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <div className="p-8 text-center">
          <p className="text-gray-400">Toque para falar</p>
        </div>
      )}
    </motion.div>
  );
};
