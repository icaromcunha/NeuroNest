import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';

interface GroundingStepProps {
  onComplete: () => void;
  title: string;
  isPaused?: boolean;
}

const GROUNDING_ITEMS = [
  { count: 5, label: 'coisas que você vê', color: 'bg-blue-100 text-blue-800' },
  { count: 4, label: 'coisas que você pode tocar', color: 'bg-green-100 text-green-800' },
  { count: 3, label: 'sons que você ouve', color: 'bg-purple-100 text-purple-800' },
  { count: 2, label: 'cheiros que você sente', color: 'bg-orange-100 text-orange-800' },
  { count: 1, label: 'coisa que você pode saborear', color: 'bg-red-100 text-red-800' },
];

export const GroundingStep: React.FC<GroundingStepProps> = ({ onComplete, title, isPaused = false }) => {
  const { settings } = useApp();
  const { speak } = useVoice();
  const hasSpokenRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taps, setTaps] = useState(0);
  const current = GROUNDING_ITEMS[currentIndex];

  useEffect(() => {
    if (settings.voiceEnabled && !hasSpokenRef.current) {
      speak(title);
      hasSpokenRef.current = true;
    }
  }, [settings.voiceEnabled, speak, title]);

  const handleTap = () => {
    if (isPaused) return;
    
    if (taps + 1 >= current.count) {
      if (currentIndex + 1 >= GROUNDING_ITEMS.length) {
        onComplete();
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setTaps(0);
        if (settings.voiceEnabled) {
          speak(`${GROUNDING_ITEMS[nextIndex].count} ${GROUNDING_ITEMS[nextIndex].label}`);
        }
      }
    } else {
      setTaps(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center space-y-6 w-full"
        >
          <div className="flex justify-center space-x-2">
            {Array.from({ length: current.count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: i < taps ? 1.2 : 0.8,
                  backgroundColor: i < taps ? '#3B82F6' : '#E5E7EB',
                  opacity: isPaused ? 0.5 : 1
                }}
                className="w-6 h-6 rounded-full shadow-sm"
              />
            ))}
          </div>

          <div className="space-y-2">
            <h2 className="text-7xl font-black text-gray-900 tracking-tighter">{current.count}</h2>
            <p className="text-2xl font-bold text-gray-600 uppercase tracking-tight">{current.label}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleTap}
        disabled={isPaused}
        className={`w-full max-w-xs py-8 rounded-[2rem] text-white text-2xl font-black shadow-2xl transition-all active:scale-95 ${isPaused ? 'bg-gray-300' : 'bg-blue-600 shadow-blue-200'}`}
      >
        {isPaused ? 'Pausado' : `Toque (${taps}/${current.count})`}
      </button>
      
      <p className="text-gray-400 font-medium text-center">Respire fundo e observe o ambiente</p>
    </div>
  );
};
