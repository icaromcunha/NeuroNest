import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Wind, Timer, Heart, Clock } from 'lucide-react';

export default function PauseScreen() {
  const navigate = useNavigate();

  const options = [
    { 
      label: 'Respiração guiada', 
      path: '/pause/breathing', 
      icon: <Wind className="w-8 h-8" />,
      color: colors.primary,
      desc: 'Siga o ritmo da calma'
    },
    { 
      label: 'Contagem visual', 
      path: '/pause/countdown', 
      icon: <Timer className="w-8 h-8" />,
      color: colors.secondary,
      desc: 'Foque no tempo passando'
    },
    { 
      label: 'Foco (Pomodoro)', 
      path: '/pause/pomodoro', 
      icon: <Clock className="w-8 h-8" />,
      color: '#9B59B6',
      desc: '25 minutos de foco total'
    },
    { 
      label: 'Mensagens de paz', 
      path: '/pause/messages', 
      icon: <Heart className="w-8 h-8" />,
      color: colors.success,
      desc: 'Palavras que confortam'
    },
  ];

  return (
    <Layout title="Pausa" onBack={() => navigate('/')}>
      <div className="space-y-6 py-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-[#2C3E50]">Momento de Calma</h2>
          <p className="text-[#7F8C8D]">Escolha como você quer relaxar agora.</p>
        </div>
        
        <div className="grid gap-4">
          {options.map((opt) => (
            <button
              key={opt.path}
              onClick={() => navigate(opt.path)}
              className="w-full p-6 rounded-[24px] bg-white card-shadow flex items-center text-left space-x-6 active:scale-[0.98] transition-all border border-transparent"
            >
              <div 
                className="p-4 rounded-2xl"
                style={{ backgroundColor: `${opt.color}15`, color: opt.color }}
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#2C3E50]">{opt.label}</h3>
                <p className="text-sm text-[#7F8C8D]">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-[32px] bg-white card-shadow text-center space-y-4">
          <p className="text-[#7F8C8D] italic">"Tudo bem ir devagar. Você está seguro aqui."</p>
        </div>
      </div>
    </Layout>
  );
}
