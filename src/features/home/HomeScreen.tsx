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
      <div className="h-full flex flex-col justify-center items-center space-y-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Toolkit TEA</h1>
          <p className="text-gray-500 text-sm">Simples. Rápido. Calmo.</p>
        </div>

        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full py-10 rounded-3xl text-2xl font-bold shadow-sm active:scale-95 transition-transform"
            style={{ 
              backgroundColor: colors.white, 
              border: `4px solid ${item.color}`,
              color: colors.text
            }}
          >
            {item.label}
          </button>
        ))}

        <div className="mt-12 w-full">
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
