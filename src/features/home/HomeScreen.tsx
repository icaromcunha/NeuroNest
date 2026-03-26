import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'PAUSA', path: '/pause', color: colors.yellow },
    { label: 'COMUNICAR', path: '/communicate', color: colors.orange },
    { label: 'ROTINA', path: '/routine', color: colors.red },
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center items-center space-y-6 py-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tighter mb-1">Toolkit TEA</h1>
          <p className="text-gray-500 text-sm">Simples. Rápido. Calmo.</p>
        </div>

        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full py-8 rounded-3xl text-2xl font-bold shadow-sm active:opacity-70 transition-opacity"
            style={{ 
              backgroundColor: colors.white, 
              border: `4px solid ${item.color}`,
              color: colors.text
            }}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => navigate('/paywall')}
          className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 active:opacity-90"
        >
          <span>💎</span>
          <span>Desbloquear completo</span>
        </button>

        <div className="pt-4 w-full">
          <button
            onClick={() => navigate('/library')}
            className="w-full py-4 text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Biblioteca
          </button>
        </div>
      </div>
    </Layout>
  );
}
