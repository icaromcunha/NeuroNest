import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

interface CountdownStepProps {
  timeLeft: number;
  instruction: string;
}

export const CountdownStep: React.FC<CountdownStepProps> = ({ timeLeft, instruction }) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.voiceEnabled) return;

    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
    };
    speak(instruction);
  }, [instruction, settings.voiceEnabled]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={timeLeft}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-bold text-[#4A90E2]"
        >
          {timeLeft}
        </motion.div>
      </AnimatePresence>
      <div className="space-y-4">
        <h2 className="text-3xl font-medium text-[#1F2937]">{instruction}</h2>
        <p className="text-xl text-[#6B7280]">Foque apenas nos números</p>
      </div>
    </div>
  );
};
