import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { colors } from '../../theme/colors';
import { useToast } from '../../components/Toast';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../../utils/storage';
import { 
  HelpCircle, 
  UserX, 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Lock,
  Heart,
  Star,
  Home,
  User,
  Settings,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Droplets,
  Stethoscope,
  Briefcase,
  Users,
  MessageSquare,
  Phone,
  Smile,
  Frown,
  Meh,
  Hand,
  ThumbsUp,
  ThumbsDown,
  Search
} from 'lucide-react';

import { isUserPremium } from '../../utils/premium';

interface Phrase {
  id: string;
  label: string;
  text: string;
  color: string;
  iconName?: string;
  category?: string;
  isLocked?: boolean;
}

const ICON_LIST = {
  HelpCircle, UserX, AlertTriangle, CheckCircle, Volume2, Heart, Star, Home, User, Settings,
  Sun, Moon, Coffee, Utensils, Droplets, Stethoscope, Briefcase, Users, MessageSquare, Phone,
  Smile, Frown, Meh, Hand, ThumbsUp, ThumbsDown
};

const IconRenderer = ({ name, className, color }: { name?: string, className?: string, color?: string }) => {
  const IconComponent = (ICON_LIST as any)[name || 'Volume2'] || Volume2;
  return <IconComponent className={className} style={{ color }} />;
};

const DEFAULT_PHRASES: Phrase[] = [
  { 
    id: '1',
    label: 'Trabalho', 
    text: 'Preciso de ajuda com o trabalho.',
    color: colors.primary,
    category: 'Trabalho',
    iconName: 'Briefcase'
  },
  { 
    id: '2',
    label: 'Médico', 
    text: 'Preciso falar com o médico.',
    color: colors.secondary,
    category: 'Médico',
    isLocked: true,
    iconName: 'Stethoscope'
  },
  { 
    id: '3',
    label: 'Social', 
    text: 'Quero interagir socialmente.',
    color: colors.alert,
    category: 'Social',
    isLocked: true,
    iconName: 'Users'
  },
  { 
    id: '4',
    label: 'Família', 
    text: 'Quero falar com minha família.',
    color: colors.success,
    category: 'Família',
    isLocked: true,
    iconName: 'Home'
  }
];

const INITIAL_QUICK_ACTIONS: Phrase[] = [
  { id: 'help', label: 'Preciso de ajuda', text: 'Preciso de ajuda, por favor.', iconName: 'HelpCircle', color: '#4A90E2' },
  { id: 'alone', label: 'Quero ficar sozinho', text: 'Quero ficar sozinho agora.', iconName: 'UserX', color: '#6B7280' },
  { id: 'uncomfortable', label: 'Estou desconfortável', text: 'Estou me sentindo desconfortável.', iconName: 'AlertTriangle', color: '#4A90E2' },
  { id: 'fine', label: 'Estou bem', text: 'Estou bem, obrigado.', iconName: 'CheckCircle', color: '#6FAFE7' },
];

export default function CommunicateScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isPremium = isUserPremium();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [quickActions, setQuickActions] = useState<Phrase[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingQuick, setIsEditingQuick] = useState(false);
  
  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');
  const [newIcon, setNewIcon] = useState('Volume2');
  const [voiceType, setVoiceType] = useState<'male' | 'female' | 'neutral'>('female');

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const savedPhrases = loadFromStorage(STORAGE_KEYS.PHRASES);
    if (savedPhrases && Array.isArray(savedPhrases)) {
      setPhrases(savedPhrases);
    } else {
      setPhrases(DEFAULT_PHRASES);
    }

    const savedQuick = loadFromStorage('neurocalm_quick_actions');
    if (savedQuick && Array.isArray(savedQuick)) {
      setQuickActions(savedQuick);
    } else {
      setQuickActions(INITIAL_QUICK_ACTIONS);
    }

    const savedVoice = loadFromStorage('neurocalm_voice_type');
    if (savedVoice) {
      setVoiceType(savedVoice as any);
    }
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PHRASES, phrases);
  }, [phrases]);

  useEffect(() => {
    saveToStorage('neurocalm_quick_actions', quickActions);
  }, [quickActions]);

  useEffect(() => {
    saveToStorage('neurocalm_voice_type', voiceType);
  }, [voiceType]);

  const handleSpeak = (text: string) => {
    if (!text) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    // Filter for Portuguese voices
    const ptVoices = voices.filter(v => v.lang.includes('pt'));
    
    let selectedVoice = null;
    
    if (voiceType === 'male') {
      // Try to find a good male voice
      selectedVoice = ptVoices.find(v => 
        (v.name.toLowerCase().includes('male') || 
         v.name.toLowerCase().includes('daniel') || 
         v.name.toLowerCase().includes('antonio') ||
         v.name.toLowerCase().includes('helio')) &&
        !v.name.toLowerCase().includes('google') // Sometimes system voices are better, but let's try
      ) || ptVoices.find(v => v.name.toLowerCase().includes('male'));
    } else if (voiceType === 'female') {
      // Try to find a good female voice, preferring Google voices which are usually higher quality
      selectedVoice = ptVoices.find(v => 
        v.name.toLowerCase().includes('google português do brasil')
      ) || ptVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('maria') || 
        v.name.toLowerCase().includes('luciana') ||
        v.name.toLowerCase().includes('victoria')
      );
    } else {
      // Neutral - just take a high quality one
      selectedVoice = ptVoices.find(v => v.name.toLowerCase().includes('google')) || ptVoices[0];
    }
    
    if (!selectedVoice && ptVoices.length > 0) {
      selectedVoice = ptVoices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Workaround for some browsers where speech breaks if it's too long or starts too fast
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
    
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
      color: colors.primary,
      iconName: newIcon
    };
    setPhrases(prev => [...prev.filter(p => !p.isLocked), newPhrase, ...prev.filter(p => p.isLocked)]);
    resetForm();
  };

  const resetForm = () => {
    setNewLabel('');
    setNewText('');
    setNewIcon('Volume2');
    setIsAdding(false);
    setEditingId(null);
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
    setNewIcon(phrase.iconName || 'Volume2');
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditingQuick) {
      setQuickActions(prev => prev.map(p => 
        p.id === editingId ? { ...p, label: newLabel, text: newText, iconName: newIcon } : p
      ));
    } else {
      setPhrases(prev => prev.map(p => 
        p.id === editingId ? { ...p, label: newLabel, text: newText, iconName: newIcon } : p
      ));
    }
    resetForm();
    setIsEditingQuick(false);
  };

  const IconSelector = ({ selected, onSelect }: { selected: string, onSelect: (name: string) => void }) => (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Escolha um ícone</p>
      <div className="grid grid-cols-5 gap-2 p-4 bg-gray-50 rounded-2xl max-h-48 overflow-y-auto border border-gray-100">
        {Object.keys(ICON_LIST).map((name) => (
          <button
            key={name}
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(name); }}
            className={`aspect-square rounded-xl flex items-center justify-center transition-all shadow-sm ${selected === name ? 'bg-[#4A90E2] text-white scale-105' : 'bg-white text-[#4B5563] hover:bg-gray-100'}`}
          >
            <IconRenderer name={name} className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="Me expressar" onBack={() => navigate('/')}>
      <div className="space-y-10 py-4 pb-32">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#1F2937]">O que você precisa?</h2>
          </div>
          <p className="text-sm text-[#6B7280]">Toque para falar em voz alta.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl card-shadow border border-transparent space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#4A90E2]10 text-[#4A90E2]">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Voz do App</span>
            </div>
          </div>
          <div className="flex p-1.5 bg-gray-50 rounded-xl">
            <button 
              onClick={() => setVoiceType('male')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${voiceType === 'male' ? 'bg-white shadow-sm text-[#4A90E2]' : 'text-gray-400'}`}
            >
              MASCULINA
            </button>
            <button 
              onClick={() => setVoiceType('female')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${voiceType === 'female' ? 'bg-white shadow-sm text-[#4A90E2]' : 'text-gray-400'}`}
            >
              FEMININA
            </button>
            <button 
              onClick={() => setVoiceType('neutral')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${voiceType === 'neutral' ? 'bg-white shadow-sm text-[#4A90E2]' : 'text-gray-400'}`}
            >
              NEUTRA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <div key={action.id} className="relative group">
              <button
                onClick={() => editingId !== action.id && handleSpeak(action.text)}
                className={`w-full p-6 rounded-2xl bg-white card-shadow flex flex-col items-center text-center space-y-4 border transition-all ${editingId === action.id ? 'border-[#4A90E2] ring-1 ring-[#4A90E2]10' : 'border-transparent hover:border-gray-100'}`}
              >
                {editingId === action.id ? (
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest ml-1 text-left">Texto do botão</p>
                      <input 
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none font-medium text-sm text-[#1F2937] border border-transparent focus:border-[#4A90E2]20 transition-all"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <IconSelector selected={newIcon} onSelect={setNewIcon} />
                    <div className="flex space-x-2 pt-2">
                      <button onClick={saveEdit} className="flex-1 py-3 bg-[#4A90E2] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all">Salvar</button>
                      <button onClick={() => { resetForm(); setIsEditingQuick(false); }} className="flex-1 py-3 bg-gray-100 text-[#6B7280] rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all">Sair</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      className="p-3.5 rounded-xl flex items-center justify-center relative"
                      style={{ backgroundColor: `${action.color}10`, color: action.color }}
                    >
                      <IconRenderer name={action.iconName} className="w-6 h-6" />
                      <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Volume2 className="w-3 h-3 text-[#4A90E2]" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#1F2937] leading-tight">{action.label}</span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingQuick(true);
                        startEditing(action, e);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <h3 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] ml-1">Minhas frases</h3>
          <div className="grid grid-cols-1 gap-4">
            {phrases.map((phrase) => (
              <div
                key={phrase.id}
                onClick={() => editingId !== phrase.id && handlePhraseAction(phrase)}
                className={`w-full p-6 rounded-2xl bg-white card-shadow flex items-center border group transition-all cursor-pointer ${editingId === phrase.id ? 'border-[#4A90E2] ring-1 ring-[#4A90E2]10' : 'border-transparent hover:border-gray-100'}`}
              >
                <div 
                  className="p-3.5 rounded-xl flex-shrink-0 mr-5 flex items-center justify-center"
                  style={{ backgroundColor: `${phrase.color}10`, color: phrase.color }}
                >
                  {(phrase.isLocked && !isPremium) ? (
                    <Lock className="w-6 h-6" />
                  ) : (
                    <IconRenderer name={phrase.iconName} className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === phrase.id && !isEditingQuick ? (
                    <div className="space-y-5 pr-2">
                      <div className="space-y-3">
                        <input 
                          className="w-full p-1 border-b border-gray-200 outline-none font-medium text-base bg-transparent"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          autoFocus
                        />
                        <input 
                          className="w-full p-1 border-b border-gray-100 outline-none text-xs text-[#6B7280] bg-transparent"
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="O que será falado..."
                        />
                      </div>
                      <IconSelector selected={newIcon} onSelect={setNewIcon} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-medium text-[#1F2937] truncate">{phrase.label}</span>
                        {(phrase.isLocked && !isPremium) && (
                          <span className="text-[9px] font-bold text-[#4A90E2] bg-[#4A90E2]10 px-2 py-0.5 rounded-md w-fit mt-1.5 uppercase tracking-wider">Premium</span>
                        )}
                      </div>
                      {(!phrase.isLocked || isPremium) && (
                        <Volume2 className="w-5 h-5 text-[#4A90E2] opacity-30 group-hover:opacity-100 transition-all" />
                      )}
                    </div>
                  )}
                </div>

                {(!phrase.isLocked || isPremium) && (
                  <div className="flex items-center space-x-2 ml-4">
                    {editingId === phrase.id && !isEditingQuick ? (
                      <>
                        <button onClick={saveEdit} className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-all"><Check className="w-6 h-6" /></button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all"><X className="w-6 h-6" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={(e) => startEditing(phrase, e)} className="p-2 text-gray-300 hover:text-[#4A90E2] hover:bg-blue-50 rounded-full transition-all opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                        {!phrase.isLocked && (
                          <button onClick={(e) => deletePhrase(phrase.id, e)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {isAdding ? (
          <div className="bg-white p-8 rounded-2xl card-shadow border border-[#4A90E2]20 space-y-8">
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider ml-1">Nome da frase</label>
                <input 
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none font-medium text-sm border border-transparent focus:border-[#4A90E2]20 transition-all"
                  placeholder="Ex: Quero água"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider ml-1">O que o app vai falar</label>
                <input 
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-transparent focus:border-[#4A90E2]20 transition-all"
                  placeholder="Frase completa..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
              </div>
              <IconSelector selected={newIcon} onSelect={setNewIcon} />
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={addPhrase}
                className="flex-1 py-4 bg-[#4A90E2] text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Salvar
              </button>
              <button 
                onClick={resetForm}
                className="px-8 py-4 bg-gray-100 text-[#6B7280] rounded-xl font-bold text-sm uppercase tracking-wider active:scale-95 transition-all"
              >
                Sair
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-6 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center space-x-3 text-[#9CA3AF] font-bold text-xs uppercase tracking-widest hover:border-gray-200 hover:text-[#6B7280] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Frase</span>
          </button>
        )}
      </div>
    </Layout>
  );
}
