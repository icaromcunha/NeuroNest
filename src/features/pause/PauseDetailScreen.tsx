import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../utils/formatTime';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  const { timeLeft, isRunning, start, pause, reset } = useTimer({
    initialSeconds: state === 'pomodoro' ? 1500 : state === 'countdown' ? 300 : 120,
    onTimeUp: () => {}
  });

  useEffect(() => {
    if (state === 'messages') {
      const interval = setInterval(() => {
        setMessageIdx((prev) => (prev + 1) % MESSAGES.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const renderBreathing = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-12 py-12">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: isRunning ? [1, 1.5, 1] : 1,
            opacity: isRunning ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-48 h-48 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
        <div className="absolute text-white font-bold text-2xl">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-2xl font-bold text-[#2C3E50]">
          {isRunning ? "Siga o círculo..." : "Pronto para começar?"}
        </p>
        <div className="flex items-center justify-center space-x-6">
          <button 
            onClick={reset}
            className="p-4 rounded-full bg-gray-100 text-[#7F8C8D] active:scale-90 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
          <button 
            onClick={isRunning ? pause : start}
            className="p-8 rounded-full text-white shadow-lg active:scale-95 transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCountdown = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-12 py-12">
      <div className="text-8xl font-bold text-[#2C3E50] tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={reset}
          className="p-4 rounded-full bg-gray-100 text-[#7F8C8D] active:scale-90 transition-all"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
        <button 
          onClick={isRunning ? pause : start}
          className="p-8 rounded-full text-white shadow-lg active:scale-95 transition-all"
          style={{ backgroundColor: colors.secondary }}
        >
          {isRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
      <div className="h-48 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1 }}
            className="text-3xl font-bold text-[#2C3E50] leading-tight"
          >
            {MESSAGES[messageIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="mt-12">
        <button 
          onClick={() => setMessageIdx((prev) => (prev + 1) % MESSAGES.length)}
          className="p-6 rounded-full bg-white card-shadow text-[#7F8C8D] flex items-center space-x-2 font-bold active:scale-95 transition-all"
        >
          <span>Próxima mensagem</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  return (
    <Layout 
      title={state === 'breathing' ? 'Respiração' : state === 'countdown' ? 'Contagem' : state === 'pomodoro' ? 'Foco' : 'Mensagens'} 
      onBack={() => navigate('/pause')}
    >
      {state === 'breathing' && renderBreathing()}
      {(state === 'countdown' || state === 'pomodoro') && renderCountdown()}
      {state === 'messages' && renderMessages()}
    </Layout>
  );
}
