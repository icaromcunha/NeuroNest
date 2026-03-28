import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/formatTime';
import { Play, Pause, RotateCcw, ChevronRight, Wind, AlertCircle, Clock } from 'lucide-react';

const GROUNDING_STEPS = [
  { count: 5, label: "coisas que você vê", icon: "👀" },
  { count: 4, label: "coisas que você sente", icon: "✋" },
  { count: 3, label: "coisas que você ouve", icon: "👂" },
  { count: 2, label: "coisas que você cheira", icon: "👃" },
  { count: 1, label: "coisa que você gosta", icon: "❤️" }
];

const RELAXATION_STEPS = [
  { title: "Mãos", instruction: "Aperte suas mãos com força por 5 segundos...", icon: "✊" },
  { title: "Mãos", instruction: "Agora solte e sinta a tensão saindo...", icon: "✋" },
  { title: "Ombros", instruction: "Encolha os ombros até as orelhas...", icon: "🤷" },
  { title: "Ombros", instruction: "Solte-os de uma vez e relaxe...", icon: "😌" },
  { title: "Pés", instruction: "Pressione os pés contra o chão...", icon: "👣" },
  { title: "Pés", instruction: "Relaxe e sinta a estabilidade...", icon: "🌱" }
];

const SAFETY_MANTRAS = [
  "Estou em segurança agora.",
  "Isso é apenas uma sensação, vai passar.",
  "Meu corpo sabe como se acalmar.",
  "Eu estou no controle da minha respiração.",
  "Cada segundo que passa é um passo para a calma."
];

const STATE_TOOLS: Record<string, string[]> = {
  leve: ['breathing', 'relaxation'],
  sobrecarga: ['grounding', 'breathing'],
  crise: ['safety_mantra']
};

const TIMER_PRESETS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '25 min', seconds: 1500 },
];

export default function PauseDetailScreen() {
  const { state } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [groundingStep, setGroundingStep] = useState(0);
  const [relaxationStep, setRelaxationStep] = useState(0);
  const [mantraIndex, setMantraIndex] = useState(0);
  const [customMode, setCustomMode] = useState<string | null>(null);

  // Map states to modes
  const initialMode = state === 'leve' ? 'breathing' : state === 'sobrecarga' ? 'grounding' : 'safety_mantra';
  const mode = customMode || initialMode;

  const getInitialSeconds = (m: string) => {
    switch (m) {
      case 'breathing': return 120;
      case 'safety_mantra': return 300;
      case 'grounding':
      case 'relaxation': return 0;
      default: return 0;
    }
  };

  const [currentInitialSeconds, setCurrentInitialSeconds] = useState(getInitialSeconds(mode));

  const { timeLeft, isRunning, start, pause, reset } = useTimer({
    initialSeconds: currentInitialSeconds,
    onTimeUp: () => {}
  });

  useEffect(() => {
    const newInitial = getInitialSeconds(mode);
    setCurrentInitialSeconds(newInitial);
    reset(newInitial);
    if (mode === 'grounding') setGroundingStep(0);
    if (mode === 'relaxation') setRelaxationStep(0);
    if (mode === 'safety_mantra') {
      setMantraIndex(0);
      start(); // Auto-start in crisis
    }
  }, [mode]);

  const handlePresetClick = (seconds: number) => {
    setCurrentInitialSeconds(seconds);
    reset(seconds);
  };

  const renderTimerPresets = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {TIMER_PRESETS.map((preset) => (
        <button
          key={preset.seconds}
          onClick={() => handlePresetClick(preset.seconds)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            currentInitialSeconds === preset.seconds 
              ? 'bg-[#4A90E2] text-white border-[#4A90E2]' 
              : 'bg-white text-[#6B7280] border-gray-100 hover:border-gray-200'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );

  const renderBreathing = (minimal = false) => (
    <div className={`flex flex-col items-center justify-center h-full space-y-12 ${minimal ? 'py-4' : 'py-12'}`}>
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
        {!minimal && (
          <div className="space-y-2">
            <p className="text-2xl font-medium text-[#1F2937]">
              {isRunning ? "Respire devagar" : "Pronto para começar?"}
            </p>
            <p className="text-[#6B7280]">Siga o ritmo do círculo</p>
          </div>
        )}
        
        {minimal && (
          <p className="text-xl font-medium text-[#1F2937]">Só respire comigo</p>
        )}

        {!minimal && renderTimerPresets()}
        
        <div className="flex items-center justify-center space-x-8">
          <button 
            onClick={() => reset()}
            className="p-5 rounded-full bg-white card-shadow text-[#6B7280] hover:text-[#4B5563] transition-colors border border-gray-50"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button 
            onClick={isRunning ? pause : start}
            className="p-8 rounded-full text-white card-shadow active:scale-95 transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderGrounding = () => {
    const step = GROUNDING_STEPS[groundingStep];
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-8 text-center space-y-12">
        <div className="space-y-4">
          <div className="text-6xl mb-4">{step.icon}</div>
          <h2 className="text-4xl font-bold text-[#1F2937]">{step.count}</h2>
          <p className="text-xl font-medium text-[#6B7280]">{step.label}</p>
        </div>

        <div className="w-full max-w-xs pt-8">
          {groundingStep < GROUNDING_STEPS.length - 1 ? (
            <button 
              onClick={() => setGroundingStep(prev => prev + 1)}
              className="btn-primary w-full py-5"
            >
              <span>Próximo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/pause')}
              className="btn-primary w-full py-5"
            >
              Concluir
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {GROUNDING_STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === groundingStep ? 'w-8 bg-[#4A90E2]' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderSafetyMantra = () => (
    <div className="flex flex-col items-center justify-center h-full py-12 px-8 text-center space-y-16">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-[#4A90E2] uppercase tracking-widest">Espaço de Segurança</p>
            <h2 className="text-3xl font-bold text-[#1F2937] leading-tight">
              {SAFETY_MANTRAS[mantraIndex]}
            </h2>
          </div>
          
          <div className="flex justify-center">
            <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4A90E2] transition-all duration-1000"
                style={{ width: `${(timeLeft / currentInitialSeconds) * 100}%` }}
              />
            </div>
          </div>
        </div>

      <div className="w-full max-w-xs space-y-6">
        <button 
          onClick={() => setMantraIndex((prev) => (prev + 1) % SAFETY_MANTRAS.length)}
          className="btn-primary w-full py-5"
        >
          Mudar frase
        </button>
        <button 
          onClick={() => navigate('/pause')}
          className="btn-ghost w-full"
        >
          Sair agora
        </button>
      </div>
    </div>
  );

  const renderRelaxation = () => {
    const step = RELAXATION_STEPS[relaxationStep];
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-8 text-center space-y-12">
        <div className="space-y-6">
          <div className="text-7xl mb-4">{step.icon}</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1F2937]">{step.title}</h2>
            <p className="text-xl text-[#4B5563] leading-relaxed">
              {step.instruction}
            </p>
          </div>
        </div>

        <div className="w-full max-w-xs pt-8">
          {relaxationStep < RELAXATION_STEPS.length - 1 ? (
            <button 
              onClick={() => setRelaxationStep(prev => prev + 1)}
              className="btn-primary w-full py-5"
            >
              <span>Próximo</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/pause')}
              className="btn-primary w-full py-5"
            >
              Concluir
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {RELAXATION_STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === relaxationStep ? 'w-8 bg-[#4A90E2]' : 'w-2 bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (mode === 'grounding') return 'Aterramento 5-4-3-2-1';
    if (mode === 'relaxation') return 'Relaxamento Muscular';
    if (mode === 'safety_mantra') return 'Espaço de Segurança';
    if (customMode) {
      switch (customMode) {
        case 'breathing': return 'Respiração Guiada';
        case 'grounding': return 'Aterramento 5-4-3-2-1';
        case 'relaxation': return 'Relaxamento Muscular';
        case 'safety_mantra': return 'Espaço de Segurança';
      }
    }
    switch (state) {
      case 'leve': return 'Pausa Leve';
      case 'sobrecarga': return 'Aterramento';
      case 'crise': return 'Espaço de Segurança';
      default: return 'Pausa';
    }
  };

  const handleModeChange = (newMode: string) => {
    if (!STATE_TOOLS[state || 'leve']?.includes(newMode)) return;
    setCustomMode(newMode);
    if (newMode === 'grounding') setGroundingStep(0);
    if (newMode === 'relaxation') setRelaxationStep(0);
  };

  const OTHER_TOOLS = [
    { id: 'grounding', label: 'Aterramento', icon: <AlertCircle className="w-4 h-4" />, color: colors.primary },
    { id: 'breathing', label: 'Respirar', icon: <Wind className="w-4 h-4" />, color: colors.secondary },
    { id: 'relaxation', label: 'Relaxar', icon: <Clock className="w-4 h-4" />, color: colors.secondary },
    { id: 'safety_mantra', label: 'Segurança', icon: <AlertCircle className="w-4 h-4" />, color: '#3B82F6' }
  ];

  return (
    <Layout 
      title={getTitle()} 
      onBack={() => navigate('/pause')}
      hideHeader={(mode === 'breathing' || mode === 'grounding') && isRunning}
    >
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col justify-center">
          {mode === 'breathing' && renderBreathing()}
          {mode === 'grounding' && renderGrounding()}
          {mode === 'safety_mantra' && renderSafetyMantra()}
          {mode === 'relaxation' && renderRelaxation()}
        </div>

        {!isRunning && (
          <div className="mt-auto pt-12 pb-8 px-4">
            {OTHER_TOOLS.filter(m => m.id !== mode && STATE_TOOLS[state || 'leve']?.includes(m.id)).length > 0 && (
              <>
                <p className="text-[10px] text-[#9CA3AF] text-center mb-6 uppercase tracking-[0.2em] font-bold">Outras ferramentas</p>
                <div className="grid grid-cols-2 gap-3">
                  {OTHER_TOOLS.filter(m => m.id !== mode && STATE_TOOLS[state || 'leve']?.includes(m.id)).map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleModeChange(m.id)}
                      className="interactive-card"
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${m.color}10`, color: m.color }}
                      >
                        {m.icon}
                      </div>
                      <span className="text-xs font-medium text-[#1F2937]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
