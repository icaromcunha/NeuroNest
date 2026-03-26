import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { PauseState } from '../../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../lib/storage';

export default function PauseScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastState = loadFromStorage(STORAGE_KEYS.LAST_PAUSE_STATE);
    if (lastState) {
      // Optional: highlight last state or auto-navigate
      console.log('Last state was:', lastState);
    }
  }, []);

  const handleNavigate = (state: PauseState) => {
    saveToStorage(STORAGE_KEYS.LAST_PAUSE_STATE, state);
    navigate(`/pause/${state}`);
  };

  const options: { label: string; state: PauseState; color: string; desc: string }[] = [
    { label: 'Amarelo', state: 'AMARELO', color: colors.yellow, desc: 'Início de sobrecarga' },
    { label: 'Laranja', state: 'LARANJA', color: colors.orange, desc: 'Perdendo o controle' },
    { label: 'Vermelho', state: 'VERMELHO', color: colors.red, desc: 'Crise' },
  ];

  return (
    <Layout title="Pausa" onBack={() => navigate('/')}>
      <div className="space-y-6 py-4">
        <p className="text-lg text-center mb-8 text-gray-600">Como você se sente agora?</p>
        
        {options.map((opt) => (
          <button
            key={opt.state}
            onClick={() => handleNavigate(opt.state)}
            className="w-full p-8 rounded-3xl flex flex-col items-center space-y-2 shadow-sm active:opacity-70 transition-opacity"
            style={{ backgroundColor: opt.color, color: colors.text }}
          >
            <span className="text-2xl font-bold uppercase tracking-widest">{opt.label}</span>
            <span className="text-sm opacity-80">{opt.desc}</span>
          </button>
        ))}
      </div>
    </Layout>
  );
}
