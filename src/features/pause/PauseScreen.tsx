import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { PauseState } from '../../types';

export default function PauseScreen() {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/pause/${opt.state}`)}
            className="w-full p-8 rounded-3xl flex flex-col items-center space-y-2 shadow-sm active:scale-95 transition-transform"
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
