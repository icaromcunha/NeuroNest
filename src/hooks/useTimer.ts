import { useState, useRef, useEffect, useCallback } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
}

export function useTimer({ initialSeconds, onTimeUp }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning || timeLeft <= 0) return;

    setIsRunning(true);
    // Clear any existing interval before starting a new one
    clearTimer();
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isRunning, timeLeft, clearTimer, onTimeUp]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback((newSeconds?: number) => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(newSeconds !== undefined ? newSeconds : initialSeconds);
  }, [clearTimer, initialSeconds]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset,
    setTimeLeft
  };
}
