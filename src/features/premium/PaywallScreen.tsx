import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Check, ArrowLeft, Lock } from 'lucide-react';
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
      <div className="flex flex-col items-center text-center p-6 space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          <Star size={40} color={colors.primary} />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Desbloqueie o NeuroCalm Pro
          </h2>
          <p className="text-sm opacity-70" style={{ color: colors.textPrimary }}>
            Tenha acesso a todas as ferramentas para o seu bem-estar.
          </p>
        </div>

        <div className="w-full space-y-4 text-left">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="mt-1">
                <Check size={18} color={colors.primary} />
              </div>
              <span className="text-sm" style={{ color: colors.textPrimary }}>{benefit}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full pt-8 space-y-4">
          <button
            onClick={handleUnlock}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-lg"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white'
            }}
          >
            Desbloquear Agora
          </button>
          
          <p className="text-xs opacity-50" style={{ color: colors.textPrimary }}>
            Pagamento único. Acesso vitalício.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PaywallScreen;
