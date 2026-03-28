import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProtocol } from '../../hooks/useProtocol';
import { useSettings } from '../../hooks/useSettings';
import { EmotionalState } from '../../types/index';
import { Wind, Zap, AlertCircle, ChevronLeft, Info, Crown, X } from 'lucide-react';

export const PauseSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startProtocol } = useProtocol();
  const { settings, togglePremium } = useSettings();
  const [infoModal, setInfoModal] = useState<null | { label: string, desc: string }>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const states = [
    { 
      id: 'leve' as EmotionalState, 
      label: 'Leve desconforto', 
      icon: <Wind className="w-8 h-8 text-[#4A90E2]" />, 
      color: 'rgba(74, 226, 144, 0.1)', 
      desc: 'Sinto que preciso de um pequeno respiro',
      explanation: 'Protocolo curto para manter o foco e a calma no dia a dia.',
      isPremium: false
    },
    { 
      id: 'sobrecarga' as EmotionalState, 
      label: 'Sobrecarga', 
      icon: <Zap className="w-8 h-8 text-[#6FAFE7]" />, 
      color: 'rgba(251, 191, 36, 0.1)', 
      desc: 'Muitos estímulos, preciso me acalmar',
      explanation: 'Técnicas de aterramento para reduzir o excesso de estímulos sensoriais.',
      isPremium: true
    },
    { 
      id: 'crise' as EmotionalState, 
      label: 'Crise', 
      icon: <AlertCircle className="w-8 h-8 text-[#EF4444]" />, 
      color: 'rgba(239, 68, 68, 0.1)', 
      desc: 'Preciso de ajuda imediata para regular',
      explanation: 'Foco intenso e regulação profunda para momentos de descontrole.',
      isPremium: true
    }
  ];

  const handleSelect = (state: typeof states[0]) => {
    if (state.isPremium && !settings.isPremium) {
      setShowPaywall(true);
      return;
    }
    startProtocol(state.id);
    navigate('/pause/detail');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <button
        onClick={() => navigate('/')}
        className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] self-start mb-12 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-16">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Como você se sente?</h1>
        <p className="text-xl text-[#6B7280]">Escolha o estado que melhor descreve seu momento.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        {states.map((state, index) => (
          <motion.div
            key={state.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <button
              onClick={() => handleSelect(state)}
              className="w-full p-8 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] flex items-center space-x-8 active:scale-95 transition-transform"
            >
              <div className="p-4 rounded-2xl" style={{ backgroundColor: state.color }}>
                {state.icon}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-medium text-[#1F2937]">{state.label}</h2>
                  {state.isPremium && !settings.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
                <p className="text-lg text-[#6B7280] mt-1">{state.desc}</p>
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInfoModal({ label: state.label, desc: state.explanation });
              }}
              className="absolute top-4 right-4 p-2 text-[#E5E7EB] hover:text-[#4A90E2] transition-colors"
            >
              <Info className="w-6 h-6" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {infoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-8 z-[100]"
            onClick={() => setInfoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-[#1F2937]">{infoModal.label}</h3>
              <p className="text-xl text-[#6B7280] leading-relaxed">
                {infoModal.desc}
              </p>
              <button
                onClick={() => setInfoModal(null)}
                className="w-full py-4 bg-[#4A90E2] text-white rounded-2xl font-medium text-lg"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end justify-center z-[110]"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[40px] p-8 pb-12 space-y-8"
            >
              <div className="flex justify-between items-start">
                <div className="p-4 rounded-3xl bg-amber-100">
                  <Crown className="w-10 h-10 text-amber-500" />
                </div>
                <button onClick={() => setShowPaywall(false)} className="p-2 text-gray-400">
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-[#1F2937]">Desbloqueie o Premium</h2>
                <p className="text-xl text-[#6B7280] leading-relaxed">
                  Tenha acesso a protocolos avançados para sobrecarga e crise, além de customização total e voz guiada.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    togglePremium();
                    setShowPaywall(false);
                  }}
                  className="w-full py-6 bg-[#4A90E2] text-white rounded-[24px] font-bold text-xl shadow-xl active:scale-95 transition-transform"
                >
                  Começar Teste Grátis
                </button>
                <p className="text-center text-[#6B7280] font-medium">R$ 14,90 / mês</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
