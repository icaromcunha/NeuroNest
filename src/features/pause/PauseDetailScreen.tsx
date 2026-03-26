import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { PauseState } from '../../types';

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
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [timer, setTimer] = useState<number | null>(null);

  const protocol = state ? PROTOCOLS[state] : [];
  const color = state === 'AMARELO' ? colors.yellow : state === 'LARANJA' ? colors.orange : colors.red;

  useEffect(() => {
    let interval: any;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => setTimer(t => (t !== null ? t - 1 : null)), 1000);
    } else if (timer === 0) {
      setTimer(null);
      alert('Tempo concluído. Respire fundo.');
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60);
  };

  const copyMessage = () => {
    const msg = state === 'VERMELHO' 
      ? 'Estou em crise sensorial. Por favor, não me toque e me dê espaço.' 
      : 'Não estou me sentindo bem agora. Preciso de um tempo em silêncio.';
    navigator.clipboard.writeText(msg);
    alert('Mensagem copiada!');
  };

  return (
    <Layout title={`Protocolo ${state}`} onBack={() => navigate('/pause')}>
      <div className="space-y-8 py-4">
        <div 
          className="p-6 rounded-3xl text-center font-bold text-xl"
          style={{ backgroundColor: color, color: colors.text }}
        >
          Você está em {state}
        </div>

        <div className="space-y-4">
          {protocol.map((step, idx) => (
            <div 
              key={idx}
              onClick={() => {
                const newChecked = [...checked];
                newChecked[idx] = !newChecked[idx];
                setChecked(newChecked);
              }}
              className={`p-6 rounded-2xl border-2 flex items-center space-x-4 transition-all cursor-pointer ${checked[idx] ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${checked[idx] ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {checked[idx] && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>}
              </div>
              <span className={`text-lg ${checked[idx] ? 'line-through text-gray-400' : 'text-gray-800'}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          {(state === 'LARANJA' || state === 'AMARELO') && (
            <button 
              onClick={() => startTimer(state === 'AMARELO' ? 1 : 2)}
              className="w-full py-6 bg-white border-4 border-gray-800 rounded-3xl text-xl font-bold flex items-center justify-center space-x-2"
            >
              <span>⏱️</span>
              <span>{timer !== null ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : 'Iniciar Timer'}</span>
            </button>
          )}

          <button 
            onClick={copyMessage}
            className="w-full py-6 bg-gray-800 text-white rounded-3xl text-xl font-bold flex items-center justify-center space-x-2"
          >
            <span>💬</span>
            <span>Mensagem Pronta</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
