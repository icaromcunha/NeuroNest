import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { EmotionalState } from '../../types/neurocalm';
import { STATE_PROTOCOL, STATE_METADATA } from '../../constants/protocols';
import { BreathingStep } from './BreathingStep';
import { GroundingStep } from './GroundingStep';
import { CountdownStep } from './CountdownStep';
import { useApp } from '../../context/AppContext';

interface ProtocolEngineProps {
  state: EmotionalState;
  onExit: () => void;
}

export const ProtocolEngine: React.FC<ProtocolEngineProps> = ({ state, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { settings, setSettings } = useApp();
  const protocol = STATE_PROTOCOL[state];
  const currentStep = protocol[currentStepIndex];

  const handleNext = useCallback(() => {
    if (currentStepIndex + 1 < protocol.length) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onExit();
    }
  }, [currentStepIndex, protocol.length, onExit]);

  const handleRepeat = () => {
    setCurrentStepIndex(0);
    setIsPaused(false);
  };

  const toggleVoice = () => {
    setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  if (!currentStep) return null;

  const renderStep = () => {
    switch (currentStep.type) {
      case 'breathing':
        return (
          <BreathingStep
            key={`${currentStepIndex}-breathing`}
            duration={currentStep.duration || 60}
            onComplete={handleNext}
            title={currentStep.title || ''}
            isPaused={isPaused}
          />
        );
      case 'grounding':
        return (
          <GroundingStep
            key={`${currentStepIndex}-grounding`}
            onComplete={handleNext}
            title={currentStep.title || ''}
            isPaused={isPaused}
          />
        );
      case 'countdown':
        return (
          <CountdownStep
            key={`${currentStepIndex}-countdown`}
            duration={currentStep.duration || 60}
            onComplete={handleNext}
            title={currentStep.title || ''}
            isPaused={isPaused}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col bg-white ${STATE_METADATA[state].overlay}`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10">
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Passo {currentStepIndex + 1} de {protocol.length}
          </span>
          <h1 className="text-xl font-bold text-gray-900">{currentStep.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-full transition-colors ${settings.voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
          >
            {settings.voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <button
            onClick={onExit}
            className="p-3 rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
                  <Pause size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Sessão Pausada</h2>
                <p className="text-gray-500 max-w-xs mx-auto">Respire fundo. Quando estiver pronto, toque no botão abaixo para continuar.</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
                >
                  Continuar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="p-8 grid grid-cols-2 gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold active:scale-95 transition-transform"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          <span>{isPaused ? 'Retomar' : 'Pausar'}</span>
        </button>
        <button
          onClick={handleRepeat}
          className="flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold active:scale-95 transition-transform"
        >
          <RotateCcw size={20} />
          <span>Reiniciar</span>
        </button>
      </div>
    </motion.div>
  );
};
