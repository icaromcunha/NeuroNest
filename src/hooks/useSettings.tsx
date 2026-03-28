import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types/index';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleVoice: () => void;
  togglePremium: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('neurocalm_settings');
    return saved ? JSON.parse(saved) : {
      voiceEnabled: true,
      repeatVoice: false,
      isPremium: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('neurocalm_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleVoice = () => {
    setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const togglePremium = () => {
    setSettings(prev => ({ ...prev, isPremium: !prev.isPremium }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleVoice, togglePremium }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
