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
      <div className="flex flex-col items-center text-center py-10 space-y-10">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '10' }}
        >
          <Star size={32} color={colors.primary} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-[#1F2937]">
            Desbloqueie o NeuroCalm Pro
          </h2>
          <p className="text-sm text-[#6B7280]">
            Tenha acesso a todas as ferramentas para o seu bem-estar.
          </p>
        </div>

        <div className="w-full space-y-5 text-left bg-white p-6 rounded-xl card-shadow border border-gray-50">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3"
            >
              <div className="mt-0.5">
                <Check size={16} color={colors.primary} />
              </div>
              <span className="text-sm text-[#1F2937] leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="w-full pt-4 space-y-4">
          <button
            onClick={handleUnlock}
            className="w-full py-4 rounded-xl font-medium text-base shadow-sm"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white'
            }}
          >
            Desbloquear Agora
          </button>
          
          <p className="text-xs text-[#6B7280]">
            Pagamento único. Acesso vitalício.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PaywallScreen;
