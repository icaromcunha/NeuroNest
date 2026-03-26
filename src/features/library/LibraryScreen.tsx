import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { saveToStorage, loadFromStorage } from '../../utils/storage';
import { Heart, MessageCircle, Calendar, ChevronRight, CheckCircle2, Circle, Lock } from 'lucide-react';

import { isUserPremium } from '../../utils/premium';

const MODULES = [
  {
    id: 'sono',
    title: 'Sono',
    icon: <Heart className="w-6 h-6" />,
    color: colors.primary,
    items: [
      'Higiene do sono',
      'Ruído branco',
      'Temperatura ideal',
      'Rotina noturna'
    ]
  },
  {
    id: 'foco',
    title: 'Foco',
    icon: <MessageCircle className="w-6 h-6" />,
    color: colors.secondary,
    items: [
      'Técnica Pomodoro',
      'Bloqueio de distrações',
      'Ambiente de estudo',
      'Metas curtas'
    ],
    isLocked: true
  },
  {
    id: 'crise',
    title: 'Crise Sensorial',
    icon: <Calendar className="w-6 h-6" />,
    color: colors.alert,
    items: [
      'Identificar gatilhos',
      'Kit de emergência',
      'Lugar seguro',
      'Técnicas de grounding'
    ],
    isLocked: true
  }
];

export default function LibraryScreen() {
  const navigate = useNavigate();
  const isPremium = isUserPremium();
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
    if (mod.isLocked && !isPremium) {
      navigate('/paywall');
    } else {
      setSelectedModule(mod);
    }
  };

  return (
    <Layout title="Biblioteca" onBack={() => selectedModule ? setSelectedModule(null) : navigate('/')}>
      <div className="space-y-10 py-4">
        {!selectedModule ? (
          <>
            <div className="space-y-1">
              <h2 className="text-xl font-medium text-[#1F2937]">Conhecimento</h2>
              <p className="text-sm text-[#6B7280]">Dicas e ferramentas para você.</p>
            </div>
            
            <div className="grid gap-4">
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className="w-full p-5 bg-white rounded-xl card-shadow flex items-center justify-between border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-2.5 rounded-lg"
                      style={{ backgroundColor: `${mod.color}10`, color: mod.color }}
                    >
                      {(mod.isLocked && !isPremium) ? <Lock className="w-5 h-5" /> : mod.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-base font-medium text-[#1F2937] block">{mod.title}</span>
                      {(mod.isLocked && !isPremium) && <span className="text-[10px] font-bold text-[#4A90E2] uppercase tracking-wider">Desbloquear Pro</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${selectedModule.color}10`, color: selectedModule.color }}
              >
                {selectedModule.icon}
              </div>
              <h2 className="text-xl font-medium text-[#1F2937]">{selectedModule.title}</h2>
            </div>
            
            <div className="space-y-3">
              {selectedModule.items.map((item, idx) => {
                const itemId = `${selectedModule.id}-${idx}`;
                const isChecked = checkedItems[itemId];
                return (
                  <button 
                    key={idx} 
                    onClick={() => toggleCheck(itemId)}
                    className={`w-full p-5 rounded-xl bg-white border flex items-center space-x-4 ${isChecked ? 'border-[#4A90E2] bg-[#4A90E2]05' : 'border-gray-100'}`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4A90E2]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                    )}
                    <span className={`text-base ${isChecked ? 'text-[#6B7280] line-through' : 'text-[#1F2937]'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-xl font-medium text-white mt-8 shadow-sm text-sm"
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
