import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useToast } from '../../components/Toast';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
import { HelpCircle, UserX, AlertTriangle, CheckCircle, Volume2, Plus, Trash2, Edit2, Check, X, Lock } from 'lucide-react';

import { isUserPremium } from '../../utils/premium';

interface Phrase {
  id: string;
  label: string;
  text: string;
  color: string;
  category?: string;
  isLocked?: boolean;
}

const DEFAULT_PHRASES: Phrase[] = [
  { 
    id: '1',
    label: 'Trabalho', 
    text: 'Preciso de ajuda com o trabalho.',
    color: colors.primary,
    category: 'Trabalho'
  },
  { 
    id: '2',
    label: 'Médico', 
    text: 'Preciso falar com o médico.',
    color: colors.secondary,
    category: 'Médico',
    isLocked: true
  },
  { 
    id: '3',
    label: 'Social', 
    text: 'Quero interagir socialmente.',
    color: colors.alert,
    category: 'Social',
    isLocked: true
  },
  { 
    id: '4',
    label: 'Família', 
    text: 'Quero falar com minha família.',
    color: colors.success,
    category: 'Família',
    isLocked: true
  }
];

const QUICK_ACTIONS = [
  { id: 'help', label: 'Preciso de ajuda', text: 'Preciso de ajuda, por favor.', icon: <HelpCircle className="w-6 h-6" />, color: '#4A90E2' },
  { id: 'alone', label: 'Quero ficar sozinho', text: 'Quero ficar sozinho agora.', icon: <UserX className="w-6 h-6" />, color: '#6B7280' },
  { id: 'uncomfortable', label: 'Estou desconfortável', text: 'Estou me sentindo desconfortável.', icon: <AlertTriangle className="w-6 h-6" />, color: '#4A90E2' },
  { id: 'fine', label: 'Estou bem', text: 'Estou bem, obrigado.', icon: <CheckCircle className="w-6 h-6" />, color: '#6FAFE7' },
];

export default function CommunicateScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isPremium = isUserPremium();
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

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
    showToast('Falando...');
  };

  const handlePhraseAction = (phrase: Phrase) => {
    if (phrase.isLocked && !isPremium) {
      navigate('/paywall');
      return;
    }
    handleSpeak(phrase.text);
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
    <Layout title="Me expressar" onBack={() => navigate('/')}>
      <div className="space-y-10 py-4 pb-32">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-[#1F2937]">O que você precisa?</h2>
          <p className="text-sm text-[#6B7280]">Toque para falar em voz alta.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleSpeak(action.text)}
              className="p-5 rounded-xl bg-white card-shadow flex flex-col items-center text-center space-y-3 border border-transparent hover:border-gray-100"
            >
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${action.color}10`, color: action.color }}
              >
                {action.icon}
              </div>
              <span className="text-sm font-medium text-[#1F2937] leading-tight">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#6B7280] uppercase tracking-wider">Minhas frases</h3>
          <div className="grid grid-cols-1 gap-3">
            {phrases.map((phrase) => (
              <div
                key={phrase.id}
                onClick={() => editingId !== phrase.id && handlePhraseAction(phrase)}
                className={`w-full p-5 rounded-xl bg-white card-shadow flex items-center border ${editingId === phrase.id ? 'border-[#4A90E2]' : 'border-transparent'}`}
              >
                <div 
                  className="p-2.5 rounded-lg flex-shrink-0 mr-4"
                  style={{ backgroundColor: `${phrase.color}10`, color: phrase.color }}
                >
                  {(phrase.isLocked && !isPremium) ? <Lock className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === phrase.id ? (
                    <div className="space-y-2 pr-2">
                      <input 
                        className="w-full p-1 border-b border-gray-200 outline-none font-medium text-base"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        autoFocus
                      />
                      <input 
                        className="w-full p-1 border-b border-gray-100 outline-none text-xs text-[#6B7280]"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="O que será falado..."
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-[#1F2937] truncate">{phrase.label}</span>
                      {(phrase.isLocked && !isPremium) && (
                        <span className="text-[10px] font-bold text-[#4A90E2] bg-[#4A90E2]10 px-2 py-0.5 rounded-md ml-2">PRO</span>
                      )}
                    </div>
                  )}
                </div>

                {!phrase.isLocked && (
                  <div className="flex items-center space-x-1 ml-2">
                    {editingId === phrase.id ? (
                      <>
                        <button onClick={saveEdit} className="p-1.5 text-green-500"><Check className="w-5 h-5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1.5 text-red-400"><X className="w-5 h-5" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={(e) => startEditing(phrase, e)} className="p-1.5 text-gray-200 hover:text-[#4A90E2]"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={(e) => deletePhrase(phrase.id, e)} className="p-1.5 text-gray-200 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {isAdding ? (
          <div className="bg-white p-6 rounded-xl card-shadow border border-[#4A90E2] space-y-4">
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg outline-none font-medium text-sm"
              placeholder="Título (ex: Quero água)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <input 
              className="w-full p-3 bg-gray-50 rounded-lg outline-none text-sm"
              placeholder="Frase completa que será falada"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <div className="flex space-x-3">
              <button 
                onClick={addPhrase}
                className="flex-1 py-3 bg-[#4A90E2] text-white rounded-lg font-medium text-sm"
              >
                Salvar
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-gray-100 text-[#6B7280] rounded-lg font-medium text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-5 border border-dashed border-gray-200 rounded-xl flex items-center justify-center space-x-3 text-[#6B7280] font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar nova frase</span>
          </button>
        )}
      </div>
    </Layout>
  );
}
