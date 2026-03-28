import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { unlockPremium } from '../../utils/premium';

const PaywallScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleUnlock = () => {
    unlockPremium();
    navigate('/');
  };

  const benefits = [
    'Acesso a todas as categorias de comunicação',
    'Módulos avançados de Foco e Crise Sensorial',
    'Personalização ilimitada de frases e rotinas',
    'Sem anúncios ou interrupções',
    'Apoie o desenvolvimento de ferramentas inclusivas'
  ];

  return (
    <Layout 
      title="Premium" 
      onBack={() => navigate('/')}
    >
      <div className="flex flex-col items-center text-center py-10 space-y-12">
        <div 
          className="w-24 h-24 rounded-3xl flex items-center justify-center card-shadow"
          style={{ backgroundColor: colors.primary + '10' }}
        >
          <Star size={40} color={colors.primary} />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-[#1F2937] tracking-tight">
            Desbloqueie o NeuroCalm Pro
          </h2>
          <p className="text-sm text-[#6B7280] max-w-[240px] mx-auto">
            Tenha acesso a todas as ferramentas para o seu bem-estar.
          </p>
        </div>

        <div className="w-full space-y-6 text-left bg-white p-8 rounded-2xl card-shadow border border-gray-50">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-4"
            >
              <div className="mt-1 p-1 rounded-full bg-[#4A90E2]10">
                <Check size={12} color={colors.primary} strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-[#4B5563] leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="w-full pt-4 space-y-5">
          <button
            onClick={handleUnlock}
            className="btn-primary w-full py-5"
          >
            Desbloquear Agora
          </button>
          
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest">
            Pagamento único • Acesso vitalício
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PaywallScreen;
