import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Phrase } from '../../types';
import { useToast } from '../../components/Toast';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../lib/storage';

const INITIAL_PHRASES: Phrase[] = [
  { id: '1', category: 'Trabalho', text: 'Preciso de um tempo' },
  { id: '2', category: 'Trabalho', text: 'Pode ser mais direto?' },
  { id: '3', category: 'Família', text: 'Prefiro falar por mensagem' },
  { id: '4', category: 'Médico', text: 'Não consigo falar agora' },
  { id: '5', category: 'Social', text: 'O som está muito alto para mim' },
];

export default function CommunicateScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage(STORAGE_KEYS.PHRASES);
    if (saved) {
      setPhrases(saved);
    } else {
      setPhrases(INITIAL_PHRASES);
    }
  }, []);

  useEffect(() => {
    if (phrases.length > 0) {
      saveToStorage(STORAGE_KEYS.PHRASES, phrases);
    }
  }, [phrases]);

  const categories = [
    { name: 'Trabalho', icon: '💼', locked: false },
    { name: 'Família', icon: '🏠', locked: false },
    { name: 'Médico', icon: '🏥', locked: false },
    { name: 'Social', icon: '🤝', locked: true },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado!');
  };

  const handleTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const handleUpdate = (id: string, newText: string) => {
    if (!newText.trim()) return;
    setPhrases(prev => prev.map(p => p.id === id ? { ...p, text: newText } : p));
    setEditingId(null);
  };

  const handleAdd = (text: string) => {
    if (!text.trim() || !selectedCategory) return;
    const newPhrase: Phrase = {
      id: Date.now().toString(),
      category: selectedCategory,
      text
    };
    setPhrases(prev => [...prev, newPhrase]);
    setIsAdding(false);
  };

  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (cat.locked) {
      navigate('/paywall');
    } else {
      setSelectedCategory(cat.name);
    }
  };

  return (
    <Layout title="Comunicar" onBack={() => selectedCategory ? setSelectedCategory(null) : navigate('/')}>
      {!selectedCategory ? (
        <div className="grid grid-cols-2 gap-4 py-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat)}
              className="aspect-square bg-white border-4 border-gray-100 rounded-3xl flex flex-col items-center justify-center space-y-2 active:opacity-70 transition-opacity relative"
            >
              {cat.locked && <span className="absolute top-4 right-4 text-xs">🔒</span>}
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-bold text-lg">{cat.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedCategory}</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-bold"
            >
              + Nova
            </button>
          </div>

          {isAdding && (
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300 mb-4">
              <input 
                autoFocus
                className="w-full p-4 border-2 border-gray-300 rounded-xl mb-2"
                placeholder="Digite a nova frase..."
                onKeyDown={(e) => e.key === 'Enter' && handleAdd(e.currentTarget.value)}
                onBlur={(e) => handleAdd(e.target.value)}
              />
              <p className="text-xs text-gray-400">Pressione Enter para salvar</p>
            </div>
          )}

          {phrases.filter(p => p.category === selectedCategory).map(phrase => (
            <div key={phrase.id} className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm space-y-4">
              {editingId === phrase.id ? (
                <div className="flex flex-col space-y-2">
                  <input 
                    autoFocus
                    className="w-full p-4 border-2 border-gray-300 rounded-xl"
                    defaultValue={phrase.text}
                    onBlur={(e) => handleUpdate(phrase.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(phrase.id, e.currentTarget.value)}
                  />
                  <p className="text-xs text-gray-400">Toque fora para salvar</p>
                </div>
              ) : (
                <p className="text-xl font-medium" onClick={() => setEditingId(phrase.id)}>{phrase.text}</p>
              )}
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleCopy(phrase.text)}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 active:bg-gray-200"
                >
                  <span>📋</span>
                  <span>Copiar</span>
                </button>
                <button 
                  onClick={() => handleTTS(phrase.text)}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 active:opacity-90"
                >
                  <span>🔊</span>
                  <span>Falar</span>
                </button>
              </div>
            </div>
          ))}
          
          <div className="pt-8 text-center">
            <p className="text-xs text-gray-400 italic">Toque no texto para editar</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
