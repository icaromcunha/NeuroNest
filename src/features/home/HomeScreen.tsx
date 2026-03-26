import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { PauseCircle, MessageCircle, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { isUserPremium } from '../../utils/premium';

export default function HomeScreen() {
  const navigate = useNavigate();
  const isPremium = isUserPremium();

  const mainActions = [
    { 
      label: 'Pausa rápida', 
      description: 'Respire e acalme-se',
      path: '/pause', 
      color: colors.primary,
      icon: <PauseCircle className="w-6 h-6" />
    },
    { 
      label: 'Me expressar', 
      description: 'Diga o que você precisa',
      path: '/communicate', 
      color: colors.secondary,
      icon: <MessageCircle className="w-6 h-6" />
    },
    { 
      label: 'Meu dia', 
      description: 'Veja o que vem agora',
      path: '/routine', 
      color: colors.primary,
      icon: <Calendar className="w-6 h-6" />
    },
  ];

  return (
    <Layout>
      <div className="py-4 space-y-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-[#1F2937]">Olá,</h1>
          <p className="text-lg text-[#6B7280]">Vamos ter um dia calmo hoje?</p>
        </div>

        <div className="grid gap-5">
          {mainActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="w-full p-6 rounded-xl bg-white card-shadow flex items-center text-left space-x-5 border border-transparent hover:border-gray-100"
            >
              <div 
                className="p-3.5 rounded-xl"
                style={{ backgroundColor: `${action.color}10`, color: action.color }}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-[#1F2937]">{action.label}</h2>
                <p className="text-sm text-[#6B7280]">{action.description}</p>
              </div>
            </button>
          ))}
        </div>

        {!isPremium && (
          <div className="pt-2">
            <button
              onClick={() => navigate('/paywall')}
              className="w-full p-6 bg-white border border-transparent rounded-2xl flex items-center justify-between card-shadow hover:border-gray-100 transition-all"
            >
              <div className="flex items-center space-x-5">
                <div className="bg-[#4A90E2]10 p-3 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#4A90E2]" />
                </div>
                <div className="text-left">
                  <p className="text-base font-medium text-[#1F2937]">Desbloquear completo</p>
                  <p className="text-xs text-[#6B7280]">Todas as ferramentas</p>
                </div>
              </div>
              <div className="bg-[#4A90E2] text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
                PRO
              </div>
            </button>
          </div>
        )}

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 text-[#6B7280] text-sm font-medium flex items-center space-x-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca de Ferramentas</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
