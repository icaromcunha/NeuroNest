import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Wind, Zap, AlertCircle } from 'lucide-react';

export default function PauseScreen() {
  const navigate = useNavigate();

  const options = [
    { 
      label: 'Leve desconforto', 
      state: 'leve', 
      icon: <Wind className="w-6 h-6" />,
      color: colors.secondary,
      desc: 'Sinto que preciso de um pequeno respiro'
    },
    { 
      label: 'Sobrecarga', 
      state: 'sobrecarga', 
      icon: <Zap className="w-6 h-6" />,
      color: colors.primary,
      desc: 'Muitos estímulos, preciso me acalmar'
    },
    { 
      label: 'Crise', 
      state: 'crise', 
      icon: <AlertCircle className="w-6 h-6" />,
      color: '#3B82F6', // A deeper blue for crisis, keeping the calm theme
      desc: 'Preciso de ajuda imediata para regular'
    },
  ];

  return (
    <Layout title="Pausa Rápida" onBack={() => navigate('/')}>
      <div className="space-y-8 py-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-medium text-[#1F2937]">Como você se sente?</h2>
          <p className="text-lg text-[#6B7280]">Escolha o estado que melhor descreve seu momento.</p>
        </div>
        
        <div className="grid gap-4">
          {options.map((opt) => (
            <button
              key={opt.state}
              onClick={() => navigate(`/pause/${opt.state}`)}
              className="interactive-card"
            >
              <div 
                className="p-3.5 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${opt.color}10`, color: opt.color }}
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1F2937]">{opt.label}</h3>
                <p className="text-sm text-[#6B7280] leading-tight">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-8 rounded-2xl bg-white card-shadow text-center border border-gray-50">
          <p className="text-sm text-[#6B7280] italic leading-relaxed">"Tudo bem ir devagar. Você está seguro aqui."</p>
        </div>
      </div>
    </Layout>
  );
}
