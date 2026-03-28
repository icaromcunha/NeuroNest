import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { useData } from '../../hooks/useData';

export const CommunicateEditScreen: React.FC = () => {
  const navigate = useNavigate();
  const { messages, addMessage, updateMessage, deleteMessage } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (newLabel.trim()) {
      addMessage(newLabel, '#4A90E2');
      setNewLabel('');
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <button
        onClick={() => navigate('/communicate')}
        className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] self-start mb-12 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Editar Mensagens</h1>
          <p className="text-xl text-[#6B7280]">Personalize seus botões rápidos.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-4 rounded-2xl bg-[#4A90E2] text-white shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-3xl shadow-md border-2 border-[#4A90E2] flex items-center space-x-4"
          >
            <input
              autoFocus
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Digite a mensagem..."
              className="flex-1 text-xl outline-none"
            />
            <button
              onClick={handleAdd}
              className="p-3 rounded-xl bg-[#4A90E2] text-white"
            >
              <Save className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-6 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex items-center space-x-4"
          >
            <GripVertical className="w-6 h-6 text-[#E5E7EB]" />
            <input
              value={msg.label}
              onChange={(e) => updateMessage(msg.id, e.target.value, msg.color)}
              className="flex-1 text-xl font-medium text-[#1F2937] outline-none"
            />
            <button
              onClick={() => deleteMessage(msg.id)}
              className="p-3 text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
