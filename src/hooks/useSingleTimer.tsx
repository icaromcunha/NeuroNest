import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface TimerContextType {
  timeLeft: number;
  isRunning: boolean;
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds: number) => {
    clearTimer();
    setTimeLeft(seconds);
    setIsRunning(true);
  }, [clearTimer]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const reset = useCallback(() => {
    // This will be handled by the protocol engine to restart the current step
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setTimeLeft(0);
    setIsRunning(false);
  }, [clearTimer]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isRunning, timeLeft, clearTimer]);

  return (
    <TimerContext.Provider value={{ timeLeft, isRunning, start, pause, resume, reset, stop }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useSingleTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useSingleTimer must be used within a TimerProvider');
  }
  return context;
};
