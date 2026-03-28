import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Volume2, VolumeX, Crown, Info } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { settings, toggleVoice, togglePremium, updateSettings } = useSettings();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-8 pt-12">
      <button
        onClick={() => navigate('/')}
        className="p-3 rounded-full bg-white shadow-sm text-[#6B7280] self-start mb-12 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#1F2937] mb-4">Configurações</h1>
        <p className="text-xl text-[#6B7280]">Personalize sua experiência.</p>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        {/* Voice Control */}
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-[#4A90E2]10">
                {settings.voiceEnabled ? <Volume2 className="w-6 h-6 text-[#4A90E2]" /> : <VolumeX className="w-6 h-6 text-[#6B7280]" />}
              </div>
              <div>
                <h2 className="text-xl font-medium text-[#1F2937]">Voz e Áudio</h2>
                <p className="text-[#6B7280]">Instruções faladas</p>
              </div>
            </div>
            <button
              onClick={toggleVoice}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.voiceEnabled ? 'bg-[#4A90E2]' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: settings.voiceEnabled ? 24 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-[#4A90E2]10">
                <Info className="w-6 h-6 text-[#4A90E2]" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-[#1F2937]">Repetir Instruções</h2>
                <p className="text-[#6B7280]">Repetir áudio automaticamente</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ repeatVoice: !settings.repeatVoice })}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.repeatVoice ? 'bg-[#4A90E2]' : 'bg-gray-200'}`}
            >
              <motion.div
                animate={{ x: settings.repeatVoice ? 24 : 4 }}
                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Premium Status */}
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-[#E5E7EB] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-amber-100">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-[#1F2937]">NeuroCalm Premium</h2>
                <p className="text-[#6B7280]">{settings.isPremium ? 'Assinatura Ativa' : 'Versão Gratuita'}</p>
              </div>
            </div>
            <button
              onClick={togglePremium}
              className="px-6 py-2 bg-[#4A90E2] text-white rounded-xl font-medium active:scale-95 transition-transform"
            >
              {settings.isPremium ? 'Gerenciar' : 'Ver Planos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
