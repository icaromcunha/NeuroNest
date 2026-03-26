import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { colors } from '../theme/colors';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
}

export default function Layout({ children, title, onBack }: LayoutProps) {
  return (
    <div 
      className="min-h-screen flex flex-col mx-auto max-w-md shadow-xl"
      style={{ backgroundColor: colors.background, color: colors.text, fontFamily: 'sans-serif' }}
    >
      {title && (
        <header className="p-6 flex items-center border-b border-gray-200 bg-white">
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Voltar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </header>
      )}
      <main className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
