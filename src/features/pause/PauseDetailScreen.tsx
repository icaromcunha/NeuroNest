import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { PauseState } from '../../types';
import { useToast } from '../../components/Toast';

const PROTOCOLS = {
  AMARELO: [
    'Respire fundo por 1 minuto',
    'Reduza estímulos (som/luz)',
    'Continue devagar'
  ],
  LARANJA: [
    'Vá para um lugar mais silencioso',
    'Respire por 2 minutos',
    'Envie mensagem pronta'
  ],
  VERMELHO: [
    'Saia imediatamente do ambiente',
    'Evite interação',
    'Use mensagem de emergência'
  ]
};

export default function PauseDetailScreen() {
  const { state } = useParams<{ state: PauseState }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const protocol = state ? PROTOCOLS[state] : [];
  const color = state === 'AMARELO' ? colors.yellow : state === 'LARANJA' ? colors.orange : colors.red;

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timer !== null && timer > 0) {
      interval = setInterval(() => setTimer(t => (t !== null ? t - 1 : null)), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setTimer(null);
      showToast('Tempo concluído. Respire fundo.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, showToast]);

  const startTimer = (minutes: number) => {
    if (timer === null) {
      setTimer(minutes * 60);
    }
    setIsTimerRunning(true);
  };

  const stopTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setTimer(null);
    setIsTimerRunning(false);
  };

  const copyMessage = () => {
    const msg = state === 'VERMELHO' 
      ? 'Estou em crise sensorial. Por favor, não me toque e me dê espaço.' 
      : 'Não estou me sentindo bem agora. Preciso de um tempo em silêncio.';
    navigator.clipboard.writeText(msg);
    showToast('Mensagem copiada!');
  };

  return (
    <Layout title={`Protocolo ${state}`} onBack={() => navigate('/pause')}>
      <div className="space-y-6 py-4">
        <div 
          className="p-6 rounded-3xl text-center font-bold text-xl shadow-sm"
          style={{ backgroundColor: color, color: colors.text }}
        >
          Você está em {state}
        </div>

        <div className="space-y-3">
          {protocol.map((step, idx) => (
            <div 
              key={idx}
              onClick={() => {
                const newChecked = [...checked];
                newChecked[idx] = !newChecked[idx];
                setChecked(newChecked);
              }}
              className={`p-5 rounded-2xl border-2 flex items-center space-x-4 transition-all cursor-pointer ${checked[idx] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${checked[idx] ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {checked[idx] && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>}
              </div>
              <span className={`text-lg font-medium ${checked[idx] ? 'text-green-800 opacity-60' : 'text-gray-800'}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          {(state === 'LARANJA' || state === 'AMARELO') && (
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Timer de Respiração</p>
                <p className="text-4xl font-mono font-bold">
                  {timer !== null ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : (state === 'AMARELO' ? '1:00' : '2:00')}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {!isTimerRunning ? (
                  <button 
                    onClick={() => startTimer(state === 'AMARELO' ? 1 : 2)}
                    className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-bold active:opacity-90"
                  >
                    {timer === null ? 'Iniciar' : 'Retomar'}
                  </button>
                ) : (
                  <button 
                    onClick={stopTimer}
                    className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold active:opacity-90"
                  >
                    Pausar
                  </button>
                )}
                <button 
                  onClick={resetTimer}
                  className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold active:bg-gray-200"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={copyMessage}
            className="w-full py-6 bg-white border-4 border-gray-800 rounded-3xl text-xl font-bold flex items-center justify-center space-x-2 active:bg-gray-50"
          >
            <span>💬</span>
            <span>Mensagem Pronta</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
