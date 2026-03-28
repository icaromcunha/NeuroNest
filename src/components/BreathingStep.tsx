import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

interface BreathingStepProps {
  instruction: string;
  duration?: number;
}

export const BreathingStep: React.FC<BreathingStepProps> = ({ instruction, duration }) => {
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
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <motion.div
        className="w-48 h-48 rounded-full bg-[#4A90E2] opacity-20"
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-[#4A90E2]"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="text-center">
        <h2 className="text-2xl font-medium text-[#1F2937]">{instruction}</h2>
        <p className="text-[#6B7280] mt-2">Inspire... Expire...</p>
      </div>
    </div>
  );
};
