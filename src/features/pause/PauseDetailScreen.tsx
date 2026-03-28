import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProtocol } from '../../hooks/useProtocol';
import { useSingleTimer } from '../../hooks/useSingleTimer';
import { useSettings } from '../../hooks/useSettings';
import { STATE_PROTOCOL } from '../../types/index';
import { BreathingStep } from '../../components/BreathingStep';
import { GroundingStep } from '../../components/GroundingStep';
import { CountdownStep } from '../../components/CountdownStep';
import { X, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const PauseDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, currentStep, stepIndex, isFinished, exitProtocol, repeatStep, nextStep } = useProtocol();
  const { timeLeft, isRunning, pause, resume } = useSingleTimer();
  const { settings, toggleVoice } = useSettings();

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state || !currentStep) return null;

  const getOverlayColor = () => {
    switch (state) {
      case 'leve': return 'rgba(74, 226, 144, 0.05)'; // soft green
      case 'sobrecarga': return 'rgba(251, 191, 36, 0.05)'; // soft warm
      case 'crise': return 'rgba(239, 68, 68, 0.05)'; // soft red
      default: return 'transparent';
    }
  };

  const renderStep = () => {
    switch (currentStep.type) {
      case 'breathing':
        return <BreathingStep instruction={currentStep.instruction || ''} duration={currentStep.duration} />;
      case 'grounding':
        return <GroundingStep onComplete={nextStep} />;
      case 'countdown':
        return <CountdownStep timeLeft={timeLeft} instruction={currentStep.instruction || ''} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[#F8FAFC] flex flex-col z-50 overflow-hidden"
      style={{ backgroundColor: getOverlayColor() }}
    >
      {/* Header */}
      <div className="px-6 py-8 flex items-center justify-between">
        <button
          onClick={() => {
            exitProtocol();
            navigate('/');
          }}
          className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] active:scale-95 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 px-8">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#4A90E2]"
              initial={{ width: 0 }}
              animate={{ width: `${((stepIndex + 1) / STATE_PROTOCOL[state].length) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={repeatStep}
          className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] active:scale-95 transition-transform"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="absolute inset-0"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="px-6 py-12 flex items-center justify-center space-x-12">
        <button
          onClick={toggleVoice}
          className="p-4 rounded-full bg-white shadow-md text-[#6B7280] active:scale-95 transition-transform"
        >
          {settings.voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {currentStep.duration && (
          <button
            onClick={isRunning ? pause : resume}
            className="p-8 rounded-full bg-[#4A90E2] text-white shadow-xl active:scale-95 transition-transform"
          >
            {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
          </button>
        )}
        
        <div className="w-14" /> {/* Spacer to balance the mute button */}
      </div>

      <div className="px-6 pb-12 flex justify-center">
        <button
          onClick={() => {
            exitProtocol();
            navigate('/');
          }}
          className="text-[#6B7280] text-lg font-medium hover:text-[#1F2937] transition-colors"
        >
          Não está ajudando? Sair
        </button>
      </div>

      {/* Finish Overlay */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center z-[60]"
          >
            <div className="w-24 h-24 rounded-full bg-[#4A90E2]10 flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-[#4A90E2]"
              />
            </div>
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Protocolo Concluído</h2>
            <p className="text-xl text-[#6B7280] mb-12">Você fez um ótimo trabalho. Como se sente agora?</p>
            <button
              onClick={() => {
                exitProtocol();
                navigate('/');
              }}
              className="w-full py-5 bg-[#4A90E2] text-white rounded-2xl font-medium text-xl shadow-lg active:scale-95 transition-transform"
            >
              Voltar ao Início
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
