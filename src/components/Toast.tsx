import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-50 pointer-events-none">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
