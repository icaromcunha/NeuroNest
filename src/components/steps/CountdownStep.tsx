import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';
import { useTimer } from '../../hooks/useTimer';

interface CountdownStepProps {
  duration: number;
  onComplete: () => void;
  title: string;
  isPaused?: boolean;
}

export const CountdownStep: React.FC<CountdownStepProps> = ({ duration, onComplete, title, isPaused = false }) => {
  const { settings } = useApp();
  const { speak } = useVoice();
  const hasSpokenRef = useRef(false);
  const { seconds: count, pause, resume } = useTimer(duration, onComplete);

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
    <div className="flex flex-col items-center justify-center h-full bg-red-50/10">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={count}
          initial={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.5, opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className={`text-[15rem] font-black tabular-nums leading-none ${isPaused ? 'text-gray-300' : 'text-red-600'}`}
          style={{ textShadow: isPaused ? 'none' : '0 20px 50px rgba(220, 38, 38, 0.3)' }}
        >
          {count}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-12 text-center space-y-4">
        <motion.p
          animate={{ 
            opacity: isPaused ? 0.3 : [0.4, 1, 0.4],
            scale: isPaused ? 1 : [1, 1.05, 1]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl font-black text-red-900 uppercase tracking-[0.2em]"
        >
          {isPaused ? 'Pausado' : 'Foque aqui'}
        </motion.p>
        
        {!isPaused && (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
