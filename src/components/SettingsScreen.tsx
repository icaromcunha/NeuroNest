import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Repeat, Crown, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { settings, setSettings } = useApp();

  const toggleVoice = () => setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  const toggleRepeat = () => setSettings(prev => ({ ...prev, voiceRepeat: !prev.voiceRepeat }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="p-6 flex items-center space-x-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="p-2 rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      </div>

      <div className="flex-1 p-6 space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 px-2">Voz e Áudio</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <button
              onClick={toggleVoice}
              className="w-full p-6 flex items-center justify-between active:bg-gray-50 transition-colors border-b border-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${settings.voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {settings.voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Voz de orientação</p>
                  <p className="text-sm text-gray-500">pt-BR • Velocidade 0.85</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.voiceEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <motion.div
                  animate={{ x: settings.voiceEnabled ? 24 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </button>

            <button
              onClick={toggleRepeat}
              className="w-full p-6 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${settings.voiceRepeat ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Repeat size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Repetir áudio</p>
                  <p className="text-sm text-gray-500">Repetir instruções automaticamente</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.voiceRepeat ? 'bg-purple-600' : 'bg-gray-200'}`}>
                <motion.div
                  animate={{ x: settings.voiceRepeat ? 24 : 2 }}
                  className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 px-2">Assinatura</h2>
          <div className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-600">
                <Crown size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">{settings.isPremium ? 'Plano Premium' : 'Plano Grátis'}</p>
                <p className="text-sm text-gray-500">{settings.isPremium ? 'Acesso ilimitado' : 'Acesso básico'}</p>
              </div>
            </div>
            {!settings.isPremium && (
              <button className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm">
                Upgrade
              </button>
            )}
          </div>
        </section>
      </div>

      <div className="p-8 text-center">
        <p className="text-sm text-gray-400">NeuroCalm v1.0.0</p>
        <p className="text-xs text-gray-300 mt-1">Feito para você</p>
      </div>
    </motion.div>
  );
};
