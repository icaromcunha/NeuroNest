import { ReactNode } from 'react';
import { colors } from '../theme/colors';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
  hideHeader?: boolean;
}

export default function Layout({ children, title, onBack, hideHeader = false }: LayoutProps) {
  return (
    <div 
      className="min-h-screen flex flex-col mx-auto w-full max-w-md relative"
      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
    >
      {!hideHeader && (
        <header className="px-6 py-5 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
          {onBack ? (
            <button 
              onClick={onBack}
              className="mr-3 p-2 -ml-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-400"
              aria-label="Voltar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          ) : null}
          
          {title ? (
            <h1 className="text-lg font-medium tracking-tight text-[#1F2937]">{title}</h1>
          ) : (
            <div className="text-xl font-semibold tracking-tight">
              <span style={{ color: '#1F2937' }}>Neuro</span>
              <span style={{ color: '#4A90E2' }}>C</span>
              <span style={{ color: '#6FAFE7' }}>a</span>
              <span style={{ color: '#1F2937' }}>lm</span>
            </div>
          )}
        </header>
      )}
      <main className={`flex-1 p-6 overflow-y-auto ${hideHeader ? '' : 'pb-24'}`}>
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
