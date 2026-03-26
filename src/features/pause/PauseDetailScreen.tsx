import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useTimer } from '../../hooks/useTimer';
import { useInterval } from '../../hooks/useInterval';
import { formatTime } from '../../utils/formatTime';
import { Play, Pause, RotateCcw, ChevronRight, Settings } from 'lucide-react';

const MESSAGES = [
  "Você está seguro",
  "Vamos respirar juntos",
  "Tudo bem ir devagar",
  "Este momento vai passar",
  "Você é forte e capaz",
  "Sinta seus pés no chão",
  "Apenas respire..."
];

export default function PauseDetailScreen() {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [messageIdx, setMessageIdx] = useState(0);
  const [customMode, setCustomMode] = useState<string | null>(null);

  // Map states to modes
  // leve -> messages
  // sobrecarga -> breathing
  // crise -> countdown
  const initialMode = state === 'leve' ? 'messages' : state === 'sobrecarga' ? 'breathing' : 'countdown';
  const mode = customMode || initialMode;

  const { timeLeft, isRunning, start, pause, reset } = useTimer({
    initialSeconds: mode === 'breathing' ? 120 : mode === 'countdown' ? 300 : mode === 'pomodoro' ? 1500 : 0,
    onTimeUp: () => {}
  });

  useInterval(() => {
    if (mode === 'messages') {
      setMessageIdx((prev) => (prev + 1) % MESSAGES.length);
    }
  }, mode === 'messages' ? 5000 : null);

  const renderBreathing = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-16 py-12">
      <div className="relative flex items-center justify-center">
        <div
          className="w-56 h-56 rounded-full flex items-center justify-center transition-all duration-1000"
          style={{ 
            backgroundColor: `${colors.primary}15`,
            transform: isRunning ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000"
            style={{ 
              backgroundColor: `${colors.primary}30`,
              transform: isRunning ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div className="text-[#1F2937] font-medium text-xl">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-8">
        <div className="space-y-2">
          <p className="text-2xl font-medium text-[#1F2937]">
            {isRunning ? "Respire devagar" : "Pronto para começar?"}
          </p>
          <p className="text-[#6B7280]">Você está seguro</p>
        </div>
        
        <div className="flex items-center justify-center space-x-8">
          <button 
            onClick={() => reset()}
            className="p-4 rounded-full bg-white card-shadow text-[#6B7280]"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={isRunning ? pause : start}
            className="p-6 rounded-full text-white shadow-sm"
            style={{ backgroundColor: colors.primary }}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCountdown = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-16 py-12">
      <div className="text-7xl font-light text-[#1F2937] tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={() => reset()}
          className="p-4 rounded-full bg-white card-shadow text-[#6B7280] active:scale-90 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={isRunning ? pause : start}
          className="p-6 rounded-full text-white shadow-sm active:scale-95 transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
      <div className="h-48 flex items-center justify-center">
        <p className="text-2xl font-medium text-[#1F2937] leading-relaxed">
          {MESSAGES[messageIdx]}
        </p>
      </div>
      <div className="mt-16">
        <button 
          onClick={() => setMessageIdx((prev) => (prev + 1) % MESSAGES.length)}
          className="px-8 py-4 rounded-full bg-white card-shadow text-[#6B7280] flex items-center space-x-3 font-medium"
        >
          <span>Próxima mensagem</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const getTitle = () => {
    if (customMode) {
      switch (customMode) {
        case 'breathing': return 'Respiração Guiada';
        case 'countdown': return 'Contagem Regressiva';
        case 'pomodoro': return 'Foco (Pomodoro)';
        case 'messages': return 'Mensagens de Calma';
      }
    }
    switch (state) {
      case 'leve': return 'Mensagens de Calma';
      case 'sobrecarga': return 'Respiração Guiada';
      case 'crise': return 'Contagem Regressiva';
      default: return 'Pausa';
    }
  };

  const handleModeChange = (newMode: string) => {
    setCustomMode(newMode);
    // Reset timer for new mode
    const seconds = newMode === 'breathing' ? 120 : newMode === 'countdown' ? 300 : newMode === 'pomodoro' ? 1500 : 0;
    reset(seconds);
  };

  return (
    <Layout 
      title={getTitle()} 
      onBack={() => navigate('/pause')}
      hideHeader={mode === 'breathing' && isRunning}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {mode === 'breathing' && renderBreathing()}
          {(mode === 'countdown' || mode === 'pomodoro') && renderCountdown()}
          {mode === 'messages' && renderMessages()}
        </div>

        {!isRunning && (
          <div className="mt-auto pt-8 pb-4">
            <p className="text-xs text-[#6B7280] text-center mb-4 uppercase tracking-widest">Outras ferramentas</p>
            <div className="flex justify-center space-x-2">
              {[
                { id: 'breathing', label: 'Respirar' },
                { id: 'countdown', label: 'Contagem' },
                { id: 'pomodoro', label: 'Foco' },
                { id: 'messages', label: 'Mensagens' }
              ].filter(m => m.id !== mode).map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-100 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
