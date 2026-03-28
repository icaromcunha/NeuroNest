import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmotionalState, ProtocolStep, STATE_PROTOCOL } from '../types/index';
import { useSingleTimer } from './useSingleTimer';

interface ProtocolContextType {
  state: EmotionalState | null;
  stepIndex: number;
  currentStep: ProtocolStep | null;
  isFinished: boolean;
  startProtocol: (state: EmotionalState) => void;
  nextStep: () => void;
  repeatStep: () => void;
  exitProtocol: () => void;
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

export const ProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EmotionalState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { start, stop, timeLeft, isRunning } = useSingleTimer();

  const currentStep = state ? STATE_PROTOCOL[state][stepIndex] || null : null;

  const startProtocol = useCallback((newState: EmotionalState) => {
    setState(newState);
    setStepIndex(0);
    setIsFinished(false);
    const firstStep = STATE_PROTOCOL[newState][0];
    if (firstStep.duration) {
      start(firstStep.duration);
    }
  }, [start]);

  const nextStep = useCallback(() => {
    if (!state) return;
    const nextIdx = stepIndex + 1;
    if (nextIdx < STATE_PROTOCOL[state].length) {
      setStepIndex(nextIdx);
      const nextStep = STATE_PROTOCOL[state][nextIdx];
      if (nextStep.duration) {
        start(nextStep.duration);
      }
    } else {
      setIsFinished(true);
      stop();
    }
  }, [state, stepIndex, start, stop]);

  const repeatStep = useCallback(() => {
    if (!state || !currentStep) return;
    if (currentStep.duration) {
      start(currentStep.duration);
    }
  }, [state, currentStep, start]);

  const exitProtocol = useCallback(() => {
    setState(null);
    setStepIndex(0);
    setIsFinished(false);
    stop();
  }, [stop]);

  // Auto-progress when timer hits 0
  useEffect(() => {
    if (state && currentStep?.duration && timeLeft === 0 && !isRunning && !isFinished) {
      // Small delay to let the user breathe before next step?
      // User said "auto-progress between steps"
      nextStep();
    }
  }, [timeLeft, isRunning, state, currentStep, nextStep, isFinished]);

  return (
    <ProtocolContext.Provider value={{
      state,
      stepIndex,
      currentStep,
      isFinished,
      startProtocol,
      nextStep,
      repeatStep,
      exitProtocol
    }}>
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol must be used within a ProtocolProvider');
  }
  return context;
};
