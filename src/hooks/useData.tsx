import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommunicationMessage, RoutineTask } from '../types/index';

interface DataContextType {
  messages: CommunicationMessage[];
  tasks: RoutineTask[];
  addMessage: (label: string, color: string) => void;
  updateMessage: (id: string, label: string, color: string) => void;
  deleteMessage: (id: string) => void;
  reorderMessages: (newOrder: CommunicationMessage[]) => void;
  addTask: (task: string, time?: string, repeat?: boolean) => void;
  updateTask: (id: string, updates: Partial<RoutineTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_MESSAGES: CommunicationMessage[] = [
  { id: '1', label: 'Preciso de ajuda', color: '#EF4444' },
  { id: '2', label: 'Quero ficar sozinho', color: '#4A90E2' },
  { id: '3', label: 'Estou com fome', color: '#FBBF24' },
  { id: '4', label: 'Quero ir embora', color: '#6FAFE7' }
];

const DEFAULT_TASKS: RoutineTask[] = [
  { id: '1', time: '08:00', task: 'Acordar e se espreguiçar', completed: true },
  { id: '2', time: '08:30', task: 'Tomar café da manhã', completed: true },
  { id: '3', time: '09:00', task: 'Escovar os dentes', completed: false },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<CommunicationMessage[]>(() => {
    const saved = localStorage.getItem('neurocalm_messages');
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('neurocalm_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('neurocalm_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('neurocalm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addMessage = (label: string, color: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), label, color }]);
  };

  const updateMessage = (id: string, label: string, color: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, label, color } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const reorderMessages = (newOrder: CommunicationMessage[]) => {
    setMessages(newOrder);
  };

  const addTask = (task: string, time?: string, repeat?: boolean) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), task, time, repeat, completed: false }]);
  };

  const updateTask = (id: string, updates: Partial<RoutineTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <DataContext.Provider value={{
      messages, tasks, addMessage, updateMessage, deleteMessage, reorderMessages,
      addTask, updateTask, deleteTask, toggleTask
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
