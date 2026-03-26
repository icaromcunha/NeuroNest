import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useToast } from '../../components/Toast';

const MODULES = [
  {
    title: 'Sono',
    icon: '🌙',
    locked: false,
    items: ['Reduzir luz', 'Evitar telas', 'Ambiente silencioso', 'Temperatura agradável']
  },
  {
    title: 'Foco',
    icon: '🎯',
    locked: false,
    items: ['Fones de ouvido', 'Timer Pomodoro', 'Mesa limpa', 'Uma tarefa por vez']
  },
  {
    title: 'Crise Sensorial',
    icon: '🧘',
    locked: true,
    items: ['Lugar seguro', 'Peso (cobertor)', 'Estímulo visual calmo', 'Sem toque físico']
  }
];

export default function LibraryScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleModuleClick = (mod: typeof MODULES[0]) => {
    if (mod.locked) {
      navigate('/paywall');
    } else {
      setSelectedModule(mod);
    }
  };

  const handleUseNow = () => {
    showToast('Iniciando modo ' + selectedModule?.title);
    // In a real app, this could trigger a specific UI mode or timer
  };

  return (
    <Layout title="Biblioteca" onBack={() => selectedModule ? setSelectedModule(null) : navigate('/')}>
      {!selectedModule ? (
        <div className="space-y-4 py-4">
          {MODULES.map(mod => (
            <button
              key={mod.title}
              onClick={() => handleModuleClick(mod)}
              className="w-full p-8 bg-white border-4 border-gray-100 rounded-3xl flex items-center space-x-6 active:opacity-70 transition-opacity relative"
            >
              {mod.locked && <span className="absolute top-4 right-4 text-xs">🔒</span>}
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
              <div 
                key={idx} 
                onClick={() => toggleItem(item)}
                className={`p-6 rounded-2xl border-2 flex items-center space-x-4 cursor-pointer transition-colors ${checkedItems[item] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${checkedItems[item] ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {checkedItems[item] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>}
                </div>
                <span className={`text-xl ${checkedItems[item] ? 'text-green-800 opacity-60' : 'text-gray-800'}`}>{item}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleUseNow}
            className="w-full py-6 bg-gray-800 text-white rounded-3xl text-xl font-bold active:opacity-90 mt-8"
          >
            Usar agora
          </button>
        </div>
      )}
    </Layout>
  );
}
