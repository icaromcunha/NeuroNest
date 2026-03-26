import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';

export default function PaywallScreen() {
  const navigate = useNavigate();

  const features = [
    'Rotinas ilimitadas',
    'Backup na nuvem',
    'Categorias personalizadas',
    'Vozes premium para fala',
    'Suporte prioritário'
  ];

  return (
    <Layout title="Toolkit TEA Pro" onBack={() => navigate(-1)}>
      <div className="flex flex-col items-center py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">💎</div>
          <h1 className="text-3xl font-bold">Desbloqueie o completo</h1>
          <p className="text-gray-500">Tenha todas as ferramentas para o seu dia a dia.</p>
        </div>

        <div className="w-full bg-white p-8 rounded-3xl border-2 border-gray-100 space-y-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center space-x-3">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-lg text-gray-700">{f}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-4 pt-4">
          <button 
            onClick={() => alert('Simulação de assinatura iniciada')}
            className="w-full py-6 bg-gray-800 text-white rounded-3xl text-xl font-bold active:scale-95 transition-transform"
          >
            Testar grátis (7 dias)
          </button>
          <button 
            onClick={() => alert('Simulação de assinatura iniciada')}
            className="w-full py-6 bg-white border-4 border-gray-800 rounded-3xl text-xl font-bold active:scale-95 transition-transform"
          >
            Assinar agora
          </button>
          <p className="text-center text-xs text-gray-400 px-8">
            Cancele a qualquer momento nas configurações da sua conta.
          </p>
        </div>
      </div>
    </Layout>
  );
}
