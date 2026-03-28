import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PauseCircle, MessageCircle, Calendar, Settings } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Pausar', icon: <PauseCircle className="w-8 h-8 text-[#4A90E2]" />, path: '/pause' },
    { label: 'Comunicar', icon: <MessageCircle className="w-8 h-8 text-[#6FAFE7]" />, path: '/communicate' },
    { label: 'Rotina', icon: <Calendar className="w-8 h-8 text-[#4A90E2]" />, path: '/routine' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="w-12 h-12" /> {/* Spacer */}
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-[#1F2937]">Neuro</span>
          <span className="text-[#4A90E2]">C</span>
          <span className="text-[#6FAFE7]">a</span>
          <span className="text-[#1F2937]">lm</span>
        </h1>
        <button
          onClick={() => navigate('/settings')}
          className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] active:scale-95 transition-transform"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(action.path)}
            className="w-full p-8 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex items-center space-x-8 active:scale-95 transition-transform"
          >
            <div className="p-4 rounded-2xl bg-[#F8FAFC]">
              {action.icon}
            </div>
            <span className="text-2xl font-medium text-[#1F2937]">{action.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-auto text-center py-8">
        <p className="text-[#6B7280] text-lg font-medium italic">"Tudo bem ir devagar. Você está seguro aqui."</p>
      </div>
    </div>
  );
};
