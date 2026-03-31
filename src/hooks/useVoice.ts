import { useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useVoice = () => {
  const { settings } = useApp();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!settings.voiceEnabled) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [settings.voiceEnabled]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
};
