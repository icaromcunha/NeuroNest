import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useTimer } from '../../hooks/useTimer';
import { useInterval } from '../../hooks/useInterval';
import { formatTime } from '../../utils/formatTime';
import { Play, Pause, RotateCcw, ChevronRight, Wind, Zap, AlertCircle, BookOpen, MessageSquare, Clock } from 'lucide-react';

const MESSAGES = [
  "Você está seguro",
  "Vamos respirar juntos",
  "Tudo bem ir devagar",
  "Este momento vai passar",
  "Você é forte e capaz",
  "Sinta seus pés no chão",
  "Apenas respire...",
  "Você está indo bem",
  "Respire fundo",
  "Sinta o ar entrando e saindo",
  "Um passo de cada vez",
  "Você tem o controle",
  "O barulho vai diminuir",
  "Foque no agora",
  "Sua mente está se acalmando",
  "Você está no presente",
  "Cada respiração traz paz",
  "Solte a tensão dos ombros",
  "Você é maior que sua ansiedade",
  "Sinta o apoio da cadeira ou do chão",
  "O mundo pode esperar um pouco",
  "Você merece este descanso",
  "Sua segurança é prioridade",
  "Respire a calma, solte o medo",
  "Você está fazendo um ótimo trabalho"
];

export default function PauseDetailScreen() {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [messageIdx, setMessageIdx] = useState(0);
  const [customMode, setCustomMode] = useState<string | null>(null);

  // Map states to modes
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
        {/* Outer pulse */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-[4000ms] ease-in-out ${isRunning ? 'scale-110 opacity-20' : 'scale-100 opacity-0'}`}
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="w-56 h-56 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out card-shadow z-10"
          style={{ 
            backgroundColor: 'white',
            transform: isRunning ? 'scale(1.2)' : 'scale(1)',
            border: `1px solid ${colors.primary}10`
          }}
        >
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out"
            style={{ 
              backgroundColor: `${colors.primary}05`,
              transform: isRunning ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div className="text-[#1F2937] font-medium text-2xl tracking-tight">
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
          <p className="text-[#6B7280]">Siga o ritmo do círculo</p>
        </div>
        
        <div className="flex items-center justify-center space-x-8">
          <button 
            onClick={() => reset()}
            className="p-4 rounded-full bg-white card-shadow text-[#6B7280] hover:text-[#4B5563] transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={isRunning ? pause : start}
            className="p-6 rounded-full text-white shadow-lg active:scale-95 transition-all"
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
      <div className="flex flex-col items-center space-y-4">
        <div className="text-8xl font-light text-[#1F2937] tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4A90E2] transition-all duration-1000"
            style={{ width: `${(timeLeft / (mode === 'countdown' ? 300 : 1500)) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={() => reset()}
          className="p-4 rounded-full bg-white card-shadow text-[#6B7280] hover:text-[#4B5563] transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={isRunning ? pause : start}
          className="p-6 rounded-full text-white shadow-lg active:scale-95 transition-all"
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
        <p className="text-2xl font-medium text-[#1F2937] leading-relaxed max-w-xs">
          {MESSAGES[messageIdx]}
        </p>
      </div>
      <div className="mt-16">
        <button 
          onClick={() => setMessageIdx((prev) => (prev + 1) % MESSAGES.length)}
          className="px-8 py-4 rounded-full bg-white card-shadow text-[#6B7280] flex items-center space-x-3 font-medium hover:bg-gray-50 transition-colors border border-gray-50"
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
    const seconds = newMode === 'breathing' ? 120 : newMode === 'countdown' ? 300 : newMode === 'pomodoro' ? 1500 : 0;
    reset(seconds);
  };

  const OTHER_TOOLS = [
    { id: 'breathing', label: 'Respirar', icon: <Wind className="w-4 h-4" />, color: '#FBBF24' },
    { id: 'countdown', label: 'Contagem', icon: <Clock className="w-4 h-4" />, color: '#F59E0B' },
    { id: 'pomodoro', label: 'Foco', icon: <Zap className="w-4 h-4" />, color: '#EF4444' },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare className="w-4 h-4" />, color: '#4A90E2' }
  ];

  return (
    <Layout 
      title={getTitle()} 
      onBack={() => navigate('/pause')}
      hideHeader={mode === 'breathing' && isRunning}
    >
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col justify-center">
          {mode === 'breathing' && renderBreathing()}
          {(mode === 'countdown' || mode === 'pomodoro') && renderCountdown()}
          {mode === 'messages' && renderMessages()}
        </div>

        {!isRunning && (
          <div className="mt-auto pt-12 pb-8 px-4">
            <p className="text-[10px] text-[#9CA3AF] text-center mb-6 uppercase tracking-[0.2em] font-bold">Outras ferramentas</p>
            <div className="grid grid-cols-2 gap-3">
              {OTHER_TOOLS.filter(m => m.id !== mode).map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-white card-shadow border border-transparent hover:border-gray-100 transition-all text-left"
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${m.color}10`, color: m.color }}
                  >
                    {m.icon}
                  </div>
                  <span className="text-xs font-medium text-[#4B5563]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
