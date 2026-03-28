import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Hand, Ear, Wind, Heart } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface GroundingStepProps {
  onComplete: () => void;
}

const GROUNDING_DATA = [
  { count: 5, text: 'coisas que você vê', icon: <Eye className="w-8 h-8 text-[#4A90E2]" /> },
  { count: 4, text: 'coisas que você sente', icon: <Hand className="w-8 h-8 text-[#4A90E2]" /> },
  { count: 3, text: 'coisas que você ouve', icon: <Ear className="w-8 h-8 text-[#4A90E2]" /> },
  { count: 2, text: 'coisas que você cheira', icon: <Wind className="w-8 h-8 text-[#4A90E2]" /> },
  { count: 1, text: 'coisa que você gosta', icon: <Heart className="w-8 h-8 text-[#4A90E2]" /> }
];

export const GroundingStep: React.FC<GroundingStepProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const { settings } = useSettings();

  const next = () => {
    if (index < GROUNDING_DATA.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

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
    speak(`${GROUNDING_DATA[index].count} ${GROUNDING_DATA[index].text}`);
  }, [index, settings.voiceEnabled]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 px-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="p-6 rounded-full bg-[#4A90E2]10">
            {GROUNDING_DATA[index].icon}
          </div>
          <h2 className="text-4xl font-bold text-[#4A90E2]">{GROUNDING_DATA[index].count}</h2>
          <p className="text-2xl font-medium text-[#1F2937]">{GROUNDING_DATA[index].text}</p>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={next}
        className="px-12 py-4 bg-[#4A90E2] text-white rounded-2xl font-medium text-lg shadow-lg active:scale-95 transition-transform"
      >
        {index === GROUNDING_DATA.length - 1 ? 'Concluir' : 'Próximo'}
      </button>
    </div>
  );
};
