import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, MessageSquare, ListTodo, Settings, Sparkles, Info, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EmotionalState } from '../types/neurocalm';
import { STATE_METADATA } from '../constants/protocols';

interface HomeScreenProps {
  onSelectPause: () => void;
  onSelectCommunication: () => void;
  onSelectRoutine: () => void;
  onSelectSettings: () => void;
  onStartProtocol: (state: EmotionalState) => void;
  onOpenPaywall: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPause,
  onSelectCommunication,
  onSelectRoutine,
  onSelectSettings,
  onStartProtocol,
  onOpenPaywall
}) => {
  const { settings, useTrial } = useApp();
  const [isSelectingState, setIsSelectingState] = useState(false);
  const [showInfo, setShowInfo] = useState<EmotionalState | null>(null);

  const handleStateSelect = (state: EmotionalState) => {
    if (state === 'leve' || settings.isPremium || useTrial(state)) {
      onStartProtocol(state);
      setIsSelectingState(false);
    } else {
      onOpenPaywall();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Wind size={24} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">NeuroCalm</h1>
        </div>
        <button
          onClick={onSelectSettings}
          className="p-3 rounded-2xl bg-gray-100 text-gray-600 active:scale-90 transition-transform"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Main Actions */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <button
          onClick={() => setIsSelectingState(true)}
          className="w-full p-10 rounded-[2.5rem] bg-blue-600 text-white flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-blue-200 active:scale-[0.98] transition-all"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center">
            <Wind size={48} />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black">Pausar</h2>
            <p className="text-blue-100 font-medium">Regulação emocional guiada</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={onSelectCommunication}
            className="p-8 rounded-[2rem] bg-white border border-gray-100 flex flex-col items-center justify-center space-y-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <MessageSquare size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-gray-900">Comunicar</h3>
              <p className="text-sm text-gray-400">Mensagens rápidas</p>
            </div>
          </button>

          <button
            onClick={onSelectRoutine}
            className="p-8 rounded-[2rem] bg-white border border-gray-100 flex flex-col items-center justify-center space-y-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <ListTodo size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-gray-900">Rotina</h3>
              <p className="text-sm text-gray-400">Tarefas do dia</p>
            </div>
          </button>
        </div>

        {!settings.isPremium && (
          <button
            onClick={onOpenPaywall}
            className="w-full p-6 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center justify-between shadow-lg active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-white/20">
                <Sparkles size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-lg">Seja Premium</p>
                <p className="text-sm text-white/80">Desbloqueie todas as funções</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Check size={20} />
            </div>
          </button>
        )}
      </div>

      {/* State Selection Modal */}
      <AnimatePresence>
        {isSelectingState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] p-8 space-y-8 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Como você se sente?</h2>
                <button
                  onClick={() => setIsSelectingState(false)}
                  className="p-2 rounded-full bg-gray-100 text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {(Object.keys(STATE_METADATA) as EmotionalState[]).map((state) => {
                  const meta = STATE_METADATA[state];
                  const isLocked = state !== 'leve' && !settings.isPremium && settings.trialsUsed[state] >= 1;

                  return (
                    <div key={state} className="relative">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleStateSelect(state)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleStateSelect(state);
                          }
                        }}
                        className="w-full p-6 rounded-3xl flex items-center justify-between text-left transition-all active:scale-[0.98] border-2 border-transparent hover:border-blue-100 cursor-pointer"
                        style={{ backgroundColor: meta.color }}
                      >
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-gray-800">{meta.label}</span>
                          <span className="text-gray-500 font-medium">{meta.subtitle}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowInfo(state);
                            }}
                            className="p-2 rounded-full bg-white/50 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Info size={20} />
                          </button>
                          {isLocked && <Sparkles size={20} className="text-amber-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/20"
            onClick={() => setShowInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl text-center space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900">{STATE_METADATA[showInfo].label}</h3>
              <p className="text-gray-600">
                {showInfo === 'leve' && "Ideal para quando você começa a sentir tensão ou desconforto."}
                {showInfo === 'sobrecarga' && "Para quando há muitos estímulos e você precisa se reconectar."}
                {showInfo === 'crise' && "Para momentos difíceis onde o controle parece estar escapando."}
              </p>
              <button
                onClick={() => setShowInfo(null)}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-800 font-bold"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
