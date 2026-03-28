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
              <h2 className="text-xl font-medium text-[#1F2937]">Biblioteca</h2>
              <p className="text-sm text-[#6B7280]">Dicas e ferramentas para você.</p>
            </div>
            
            <div className="grid gap-4">
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className="interactive-card"
                >
                  <div className="flex items-center space-x-5">
                    <div 
                      className="p-3.5 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mod.color}10`, color: mod.color }}
                    >
                      {(mod.isLocked && !isPremium) ? <Lock className="w-6 h-6" /> : mod.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-medium text-[#1F2937] block">{mod.title}</span>
                      {(mod.isLocked && !isPremium) ? (
                        <span className="text-[10px] font-bold text-[#4A90E2] uppercase tracking-wider">Desbloquear Pro</span>
                      ) : (
                        <span className="text-xs text-[#6B7280]">{mod.items.length} tópicos</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center space-x-5">
              <div 
                className="p-3.5 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${selectedModule.color}10`, color: selectedModule.color }}
              >
                {selectedModule.icon}
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-medium text-[#1F2937]">{selectedModule.title}</h2>
                <p className="text-xs text-[#6B7280]">Toque para marcar como lido</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedModule.items.map((item, idx) => {
                const itemId = `${selectedModule.id}-${idx}`;
                const isChecked = checkedItems[itemId];
                return (
                  <button 
                    key={idx} 
                    onClick={() => toggleCheck(itemId)}
                    className={`interactive-card ${isChecked ? 'border-[#4A90E2]20 bg-[#4A90E2]05' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-6 h-6 text-[#4A90E2]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                    <span className={`text-base font-medium text-left ${isChecked ? 'text-[#9CA3AF] line-through' : 'text-[#1F2937]'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <button 
                onClick={() => navigate('/')}
                className="btn-primary w-full py-5"
                style={{ backgroundColor: selectedModule.color }}
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
