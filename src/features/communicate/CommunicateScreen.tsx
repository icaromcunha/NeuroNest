import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { Phrase } from '../../types';

const INITIAL_PHRASES: Phrase[] = [
  { id: '1', category: 'Trabalho', text: 'Preciso de um tempo' },
  { id: '2', category: 'Trabalho', text: 'Pode ser mais direto?' },
  { id: '3', category: 'Família', text: 'Prefiro falar por mensagem' },
  { id: '4', category: 'Médico', text: 'Não consigo falar agora' },
  { id: '5', category: 'Social', text: 'O som está muito alto para mim' },
];

export default function CommunicateScreen() {
  const navigate = useNavigate();
  const [phrases, setPhrases] = useState<Phrase[]>(INITIAL_PHRASES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = ['Trabalho', 'Família', 'Médico', 'Social'];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado!');
  };

  const handleTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const handleUpdate = (id: string, newText: string) => {
    setPhrases(prev => prev.map(p => p.id === id ? { ...p, text: newText } : p));
    setEditingId(null);
  };

  return (
    <Layout title="Comunicar" onBack={() => selectedCategory ? setSelectedCategory(null) : navigate('/')}>
      {!selectedCategory ? (
        <div className="grid grid-cols-2 gap-4 py-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="aspect-square bg-white border-4 border-gray-200 rounded-3xl flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform"
            >
              <span className="text-4xl">
                {cat === 'Trabalho' ? '💼' : cat === 'Família' ? '🏠' : cat === 'Médico' ? '🏥' : '🤝'}
              </span>
              <span className="font-bold text-lg">{cat}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>
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
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>📋</span>
                  <span>Copiar</span>
                </button>
                <button 
                  onClick={() => handleTTS(phrase.text)}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>🔊</span>
                  <span>Falar</span>
                </button>
              </div>
            </div>
          ))}
          <button 
            onClick={() => navigate('/paywall')}
            className="w-full py-4 text-gray-400 text-sm italic"
          >
            + Adicionar mais frases (Pro)
          </button>
        </div>
      )}
    </Layout>
  );
}
