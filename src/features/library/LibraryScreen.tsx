import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { saveToStorage, loadFromStorage } from '../../utils/storage';
import { Heart, MessageCircle, Calendar, ChevronRight, CheckCircle2, Circle, Lock } from 'lucide-react';

const MODULES = [
  {
    id: 'reg',
    title: 'Regulação',
    icon: <Heart className="w-6 h-6" />,
    color: colors.primary,
    items: [
      'Respiração profunda',
      'Lugar silencioso',
      'Reduzir luzes',
      'Peso no corpo'
    ]
  },
  {
    id: 'com',
    title: 'Comunicação',
    icon: <MessageCircle className="w-6 h-6" />,
    color: colors.secondary,
    items: [
      'Cartões de ajuda',
      'Frases prontas',
      'Escrita livre',
      'Sinais básicos'
    ],
    isLocked: true
  },
  {
    id: 'rot',
    title: 'Rotina',
    icon: <Calendar className="w-6 h-6" />,
    color: colors.alert,
    items: [
      'Passo a passo',
      'Checklist diário',
      'Próximas tarefas',
      'Histórico'
    ],
    isLocked: true
  }
];

export default function LibraryScreen() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = loadFromStorage('neurocalm_library_checks');
    if (saved) setCheckedItems(saved);
  }, []);

  useEffect(() => {
    saveToStorage('neurocalm_library_checks', checkedItems);
  }, [checkedItems]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleModuleClick = (mod: typeof MODULES[0]) => {
    if (mod.isLocked) {
      navigate('/paywall');
    } else {
      setSelectedModule(mod);
    }
  };

  return (
    <Layout title="Biblioteca" onBack={() => selectedModule ? setSelectedModule(null) : navigate('/')}>
      <div className="space-y-6 py-4">
        {!selectedModule ? (
          <>
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-[#2C3E50]">Conhecimento</h2>
              <p className="text-[#7F8C8D]">Dicas e ferramentas para você.</p>
            </div>
            
            <div className="grid gap-4">
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className="w-full p-6 bg-white rounded-[24px] card-shadow flex items-center justify-between active:scale-[0.98] transition-all border border-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                    >
                      {mod.isLocked ? <Lock className="w-6 h-6" /> : mod.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-[#2C3E50] block">{mod.title}</span>
                      {mod.isLocked && <span className="text-xs font-bold text-[#9B59B6]">Desbloquear Pro</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#7F8C8D]" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div 
                className="p-4 rounded-2xl"
                style={{ backgroundColor: `${selectedModule.color}15`, color: selectedModule.color }}
              >
                {selectedModule.icon}
              </div>
              <h2 className="text-2xl font-bold text-[#2C3E50]">{selectedModule.title}</h2>
            </div>
            
            <div className="space-y-3">
              {selectedModule.items.map((item, idx) => {
                const itemId = `${selectedModule.id}-${idx}`;
                const isChecked = checkedItems[itemId];
                return (
                  <button 
                    key={idx} 
                    onClick={() => toggleCheck(itemId)}
                    className={`w-full p-6 rounded-[24px] bg-white border flex items-center space-x-4 transition-all ${isChecked ? 'border-[#82E0AA] bg-[#82E0AA05]' : 'border-gray-100'}`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-6 h-6 text-[#82E0AA]" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#BDC3C7]" />
                    )}
                    <span className={`text-lg ${isChecked ? 'text-[#7F8C8D] line-through' : 'text-[#2C3E50]'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-6 rounded-[24px] font-bold text-white mt-8 shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: selectedModule.color }}
            >
              Usar agora
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
