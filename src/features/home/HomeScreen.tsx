import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Heart, MessageCircle, Calendar, BookOpen, Sparkles } from 'lucide-react';

export default function HomeScreen() {
  const navigate = useNavigate();

  const mainActions = [
    { 
      label: 'Pausar', 
      description: 'Respire e acalme-se',
      path: '/pause', 
      color: colors.primary,
      icon: <Heart className="w-8 h-8" />
    },
    { 
      label: 'Comunicar', 
      description: 'Diga o que você precisa',
      path: '/communicate', 
      color: colors.secondary,
      icon: <MessageCircle className="w-8 h-8" />
    },
    { 
      label: 'Rotina', 
      description: 'Veja o que vem agora',
      path: '/routine', 
      color: colors.alert,
      icon: <Calendar className="w-8 h-8" />
    },
  ];

  return (
    <Layout hideHeader>
      <div className="py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#2C3E50]">Olá,</h1>
          <p className="text-xl text-[#7F8C8D]">Vamos ter um dia calmo hoje?</p>
        </div>

        <div className="grid gap-4">
          {mainActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="w-full p-6 rounded-[24px] bg-white card-shadow flex items-center text-left space-x-6 active:scale-[0.98] transition-all border border-transparent hover:border-[#EBF0F5]"
            >
              <div 
                className="p-4 rounded-2xl"
                style={{ backgroundColor: `${action.color}20`, color: action.color }}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#2C3E50]">{action.label}</h2>
                <p className="text-[#7F8C8D]">{action.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/paywall')}
            className="w-full p-6 bg-gradient-to-r from-[#5DADE2] to-[#76D7C4] rounded-[32px] flex items-center justify-between text-white shadow-lg active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Desbloquear completo</p>
                <p className="text-xs opacity-90">Tenha acesso a todas as ferramentas</p>
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              PRO
            </div>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/library')}
            className="w-full py-4 text-[#7F8C8D] font-medium flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>Biblioteca de Ferramentas</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
