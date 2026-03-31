import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, RoutineTask, CommunicationMessage } from '../types/neurocalm';

interface AppContextType {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  tasks: RoutineTask[];
  setTasks: React.Dispatch<React.SetStateAction<RoutineTask[]>>;
  messages: CommunicationMessage[];
  setMessages: React.Dispatch<React.SetStateAction<CommunicationMessage[]>>;
  useTrial: (state: 'sobrecarga' | 'crise') => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('neurocalm_settings');
    return saved ? JSON.parse(saved) : {
      voiceEnabled: true,
      voiceRepeat: false,
      isPremium: false,
      trialsUsed: { sobrecarga: 0, crise: 0 }
    };
  });

  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('neurocalm_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Beber água', completed: false },
      { id: '2', title: 'Organizar mesa', completed: false }
    ];
  });

  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem('neurocalm_messages');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Preciso de espaço' },
      { id: '2', text: 'Estou com fome' },
      { id: '3', text: 'Quero ir para casa' },
      { id: '4', text: 'Sim / Não' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('neurocalm_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('neurocalm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('neurocalm_messages', JSON.stringify(messages));
  }, [messages]);

  const useTrial = (state: 'sobrecarga' | 'crise') => {
    if (settings.isPremium) return true;
    if (settings.trialsUsed[state] < 1) {
      setSettings(prev => ({
        ...prev,
        trialsUsed: { ...prev.trialsUsed, [state]: prev.trialsUsed[state] + 1 }
      }));
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{ settings, setSettings, tasks, setTasks, messages, setMessages, useTrial }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
