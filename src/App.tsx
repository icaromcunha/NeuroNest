import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { HomeScreen } from './components/HomeScreen';
import { CommunicationScreen } from './components/CommunicationScreen';
import { RoutineScreen } from './components/RoutineScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProtocolEngine } from './components/steps/ProtocolEngine';
import { EmotionalState } from './types/neurocalm';
import { Paywall } from './components/Paywall';

type Screen = 'home' | 'communication' | 'routine' | 'settings';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [activeProtocol, setActiveProtocol] = useState<EmotionalState | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const { settings } = useApp();

  const handleProtocolExit = () => {
    setActiveProtocol(null);
    if (!settings.isPremium) {
      setIsPaywallOpen(true);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onSelectPause={() => {}} // Handled by internal state in HomeScreen
            onSelectCommunication={() => setCurrentScreen('communication')}
            onSelectRoutine={() => setCurrentScreen('routine')}
            onSelectSettings={() => setCurrentScreen('settings')}
            onStartProtocol={(state) => setActiveProtocol(state)}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        );
      case 'communication':
        return <CommunicationScreen onBack={() => setCurrentScreen('home')} />;
      case 'routine':
        return <RoutineScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      <AnimatePresence>
        {activeProtocol && (
          <ProtocolEngine
            state={activeProtocol}
            onExit={handleProtocolExit}
          />
        )}
      </AnimatePresence>

      <Paywall isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </div>
  );
};

export default App;
