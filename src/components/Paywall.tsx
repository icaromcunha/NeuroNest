import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ isOpen, onClose }) => {
  const { setSettings } = useApp();

  const handleUnlock = () => {
    setSettings(prev => ({ ...prev, isPremium: true }));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Sparkles size={32} />
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-100 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Desbloqueie mais suporte</h2>
                <p className="text-gray-500 text-lg">Tenha acesso a todas as ferramentas de regulação e personalização.</p>
              </div>

              <div className="space-y-4">
                {[
                  'Protocolos para Sobrecarga e Crise',
                  'Voz de orientação (pt-BR)',
                  'Personalização de mensagens',
                  'Rotinas ilimitadas'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleUnlock}
                  className="w-full py-6 rounded-3xl bg-blue-600 text-white text-xl font-bold shadow-xl active:scale-95 transition-transform"
                >
                  Assinar NeuroCalm
                </button>
                <p className="text-center text-sm text-gray-400">R$ 14,90 / mês • Cancele quando quiser</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
