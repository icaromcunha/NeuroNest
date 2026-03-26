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
      className="min-h-screen flex flex-col mx-auto w-full max-w-md relative soft-transition"
      style={{ backgroundColor: colors.background, color: colors.textPrimary }}
    >
      {!hideHeader && title && (
        <header className="p-6 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-gray-400"
              aria-label="Voltar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight text-[#2C3E50]">{title}</h1>
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
