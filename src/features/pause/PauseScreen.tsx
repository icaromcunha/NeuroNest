import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';

export default function PauseScreen() {
  const navigate = useNavigate();

  const options = [
    { 
      label: 'Leve desconforto', 
      state: 'leve', 
      icon: '🟡',
      color: '#FBBF24',
      desc: 'Sinto que preciso de um pequeno respiro'
    },
    { 
      label: 'Sobrecarga', 
      state: 'sobrecarga', 
      icon: '🟠',
      color: '#F59E0B',
      desc: 'Muitos estímulos, preciso me acalmar'
    },
    { 
      label: 'Crise', 
      state: 'crise', 
      icon: '🔴',
      color: '#EF4444',
      desc: 'Preciso de ajuda imediata para regular'
    },
  ];

  return (
    <Layout title="Pausa" onBack={() => navigate('/')}>
      <div className="space-y-8 py-4">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-[#1F2937]">Como você se sente?</h2>
          <p className="text-sm text-[#6B7280]">Escolha o estado que melhor descreve seu momento.</p>
        </div>
        
        <div className="grid gap-4">
          {options.map((opt) => (
            <button
              key={opt.state}
              onClick={() => navigate(`/pause/${opt.state}`)}
              className="w-full p-6 rounded-xl bg-white card-shadow flex items-center text-left space-x-5 border border-transparent"
            >
              <div 
                className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-gray-50"
              >
                {opt.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#1F2937]">{opt.label}</h3>
                <p className="text-sm text-[#6B7280]">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-8 rounded-xl bg-white card-shadow text-center">
          <p className="text-sm text-[#6B7280] italic leading-relaxed">"Tudo bem ir devagar. Você está seguro aqui."</p>
        </div>
      </div>
    </Layout>
  );
}
