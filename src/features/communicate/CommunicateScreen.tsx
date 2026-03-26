import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useToast } from '../../components/Toast';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
import { HelpCircle, UserX, AlertTriangle, CheckCircle, Volume2, Plus, Trash2, Edit2, Check, X, Lock } from 'lucide-react';

interface Phrase {
  id: string;
  label: string;
  text: string;
  color: string;
  isLocked?: boolean;
}

const DEFAULT_PHRASES: Phrase[] = [
  { 
    id: '1',
    label: 'Preciso de ajuda', 
    text: 'Eu preciso de ajuda, por favor.',
    color: colors.primary
  },
  { 
    id: '2',
    label: 'Quero ficar sozinho', 
    text: 'Eu quero ficar sozinho um pouco.',
    color: colors.secondary
  },
  { 
    id: '3',
    label: 'Estou desconfortável', 
    text: 'Eu estou me sentindo desconfortável aqui.',
    color: colors.alert
  },
  { 
    id: '4',
    label: 'Estou bem', 
    text: 'Eu estou bem, obrigado.',
    color: colors.success
  },
  {
    id: 'locked_1',
    label: 'Sentimentos',
    text: '',
    color: '#9B59B6',
    isLocked: true
  }
];

export default function CommunicateScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const saved = loadFromStorage(STORAGE_KEYS.PHRASES);
    if (saved && Array.isArray(saved)) {
      setPhrases(saved);
    } else {
      setPhrases(DEFAULT_PHRASES);
    }
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PHRASES, phrases);
  }, [phrases]);

  const handleSpeak = (phrase: Phrase) => {
    if (phrase.isLocked) {
      navigate('/paywall');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(phrase.text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
    showToast('Falando...');
  };

  const addPhrase = () => {
    if (!newLabel.trim() || !newText.trim()) return;
    const newPhrase: Phrase = {
      id: Date.now().toString(),
      label: newLabel,
      text: newText,
      color: colors.primary
    };
    setPhrases(prev => [...prev.filter(p => !p.isLocked), newPhrase, ...prev.filter(p => p.isLocked)]);
    setNewLabel('');
    setNewText('');
    setIsAdding(false);
  };

  const deletePhrase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhrases(prev => prev.filter(p => p.id !== id));
  };

  const startEditing = (phrase: Phrase, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(phrase.id);
    setNewLabel(phrase.label);
    setNewText(phrase.text);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhrases(prev => prev.map(p => 
      p.id === editingId ? { ...p, label: newLabel, text: newText } : p
    ));
    setEditingId(null);
    setNewLabel('');
    setNewText('');
  };

  return (
    <Layout title="Comunicar" onBack={() => navigate('/')}>
      <div className="space-y-6 py-4 pb-32">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-[#2C3E50]">O que você precisa?</h2>
          <p className="text-[#7F8C8D]">Toque para falar em voz alta.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {phrases.map((phrase) => (
            <div
              key={phrase.id}
              onClick={() => editingId !== phrase.id && handleSpeak(phrase)}
              className={`w-full p-6 rounded-[32px] bg-white card-shadow flex flex-col active:scale-[0.98] transition-all border-2 ${editingId === phrase.id ? 'border-[#5DADE2]' : 'border-transparent'}`}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="p-4 rounded-2xl flex-shrink-0"
                  style={{ backgroundColor: `${phrase.color}15`, color: phrase.color }}
                >
                  {phrase.isLocked ? <Lock className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                </div>
                
                <div className="flex-1">
                  {editingId === phrase.id ? (
                    <div className="space-y-2">
                      <input 
                        className="w-full p-2 border-b border-gray-200 outline-none font-bold text-lg"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        autoFocus
                      />
                      <input 
                        className="w-full p-2 border-b border-gray-100 outline-none text-sm text-[#7F8C8D]"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="O que será falado..."
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#2C3E50]">{phrase.label}</span>
                      {phrase.isLocked && <span className="text-xs font-bold text-[#9B59B6] bg-[#9B59B6]10 px-2 py-1 rounded-full">PRO</span>}
                    </div>
                  )}
                </div>

                {!phrase.isLocked && (
                  <div className="flex items-center space-x-1">
                    {editingId === phrase.id ? (
                      <>
                        <button onClick={saveEdit} className="p-2 text-green-500"><Check className="w-6 h-6" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-2 text-red-400"><X className="w-6 h-6" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={(e) => startEditing(phrase, e)} className="p-2 text-gray-300 hover:text-[#5DADE2]"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={(e) => deletePhrase(phrase.id, e)} className="p-2 text-gray-300 hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isAdding ? (
          <div className="bg-white p-6 rounded-[32px] card-shadow border-2 border-[#5DADE2] space-y-4">
            <input 
              className="w-full p-3 bg-gray-50 rounded-xl outline-none font-bold"
              placeholder="Título (ex: Quero água)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <input 
              className="w-full p-3 bg-gray-50 rounded-xl outline-none"
              placeholder="Frase completa que será falada"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <div className="flex space-x-3">
              <button 
                onClick={addPhrase}
                className="flex-1 py-4 bg-[#5DADE2] text-white rounded-2xl font-bold"
              >
                Salvar
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-4 bg-gray-100 text-[#7F8C8D] rounded-2xl font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-6 dashed-border rounded-[32px] flex items-center justify-center space-x-3 text-[#7F8C8D] font-bold active:scale-[0.98] transition-all"
          >
            <Plus className="w-6 h-6" />
            <span>Adicionar nova frase</span>
          </button>
        )}
      </div>
    </Layout>
  );
}
