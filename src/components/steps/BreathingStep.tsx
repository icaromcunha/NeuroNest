import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';
import { useTimer } from '../../hooks/useTimer';

interface BreathingStepProps {
  duration: number;
  onComplete: () => void;
  title: string;
  isPaused?: boolean;
}

export const BreathingStep: React.FC<BreathingStepProps> = ({ duration, onComplete, title, isPaused = false }) => {
  const { settings } = useApp();
  const { speak } = useVoice();
  const hasSpokenRef = useRef(false);
  const { pause, resume } = useTimer(duration, onComplete);

  useEffect(() => {
    if (isPaused) {
      pause();
    } else {
      resume();
    }
  }, [isPaused, pause, resume]);

  useEffect(() => {
    if (settings.voiceEnabled && !hasSpokenRef.current) {
      speak(title);
      hasSpokenRef.current = true;
    }
  }, [settings.voiceEnabled, speak, title]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          animate={{
            scale: isPaused ? 1 : [1, 1.8, 1],
            opacity: isPaused ? 0.2 : [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-64 h-64 rounded-full bg-blue-400"
        />
        
        {/* Middle ring */}
        <motion.div
          animate={{
            scale: isPaused ? 1 : [1, 1.4, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-48 h-48 rounded-full bg-blue-500/30"
        />

        {/* Core */}
        <motion.div
          animate={{
            scale: isPaused ? 1 : [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 rounded-full bg-blue-600 shadow-xl shadow-blue-200 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white/40" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-4">
        <motion.div
          animate={{ 
            opacity: isPaused ? 0.5 : [0.4, 1, 0.4],
            y: isPaused ? 0 : [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">
            Inspire...
          </h2>
          <p className="text-xl font-medium text-blue-600/80">e expire suavemente</p>
        </motion.div>
        
        {!isPaused && (
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
            Mantenha o foco no círculo
          </p>
        )}
      </div>
    </div>
  );
};
