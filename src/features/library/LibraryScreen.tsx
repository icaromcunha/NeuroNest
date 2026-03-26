import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';

const MODULES = [
  {
    title: 'Sono',
    icon: '🌙',
    items: ['Reduzir luz', 'Evitar telas', 'Ambiente silencioso', 'Temperatura agradável']
  },
  {
    title: 'Foco',
    icon: '🎯',
    items: ['Fones de ouvido', 'Timer Pomodoro', 'Mesa limpa', 'Uma tarefa por vez']
  },
  {
    title: 'Crise Sensorial',
    icon: '🧘',
    items: ['Lugar seguro', 'Peso (cobertor)', 'Estímulo visual calmo', 'Sem toque físico']
  }
];

export default function LibraryScreen() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);

  return (
    <Layout title="Biblioteca" onBack={() => selectedModule ? setSelectedModule(null) : navigate('/')}>
      {!selectedModule ? (
        <div className="space-y-4 py-4">
          {MODULES.map(mod => (
            <button
              key={mod.title}
              onClick={() => setSelectedModule(mod)}
              className="w-full p-8 bg-white border-4 border-gray-100 rounded-3xl flex items-center space-x-6 active:scale-95 transition-transform"
            >
              <span className="text-5xl">{mod.icon}</span>
              <span className="text-2xl font-bold">{mod.title}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-6xl">{selectedModule.icon}</span>
            <h2 className="text-3xl font-bold">{selectedModule.title}</h2>
          </div>
          
          <div className="space-y-3">
            {selectedModule.items.map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border-2 border-gray-100 flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                <span className="text-xl">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
