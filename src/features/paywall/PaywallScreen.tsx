import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useToast } from '../../components/Toast';
import { Sparkles, Check } from 'lucide-react';

export default function PaywallScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const features = [
    'Rotinas ilimitadas',
    'Backup na nuvem',
    'Categorias personalizadas',
    'Vozes premium para fala',
    'Suporte prioritário'
  ];

  const handleSubscribe = () => {
    showToast('Simulação de assinatura iniciada');
  };

  return (
    <Layout title="NeuroCalm Premium" onBack={() => navigate(-1)}>
      <div className="flex flex-col items-center py-8 space-y-8">
        <div className="text-center space-y-4">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
          >
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Desbloqueie o completo</h1>
          <p className="text-[#7F8C8D]">Tenha todas as ferramentas para o seu dia a dia.</p>
        </div>

        <div className="w-full bg-white p-8 rounded-[32px] card-shadow space-y-6 border border-gray-50">
          {features.map((f, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="bg-[#82E0AA20] p-1 rounded-full">
                <Check className="w-5 h-5 text-[#82E0AA]" />
              </div>
              <span className="text-lg text-[#2C3E50] font-medium">{f}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={handleSubscribe}
            className="w-full py-6 text-white rounded-[24px] text-xl font-bold active:scale-[0.98] transition-all shadow-lg shadow-[#5DADE230]"
            style={{ backgroundColor: colors.primary }}
          >
            Testar grátis (7 dias)
          </button>
          
          <button 
            onClick={handleSubscribe}
            className="w-full py-6 bg-white border-2 border-[#EBF0F5] text-[#2C3E50] rounded-[24px] text-xl font-bold active:scale-[0.98] transition-all"
          >
            Assinar agora
          </button>
          
          <p className="text-center text-xs text-[#7F8C8D] px-8">
            Cancele a qualquer momento nas configurações da sua conta.
          </p>
        </div>
      </div>
    </Layout>
  );
}
