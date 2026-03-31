import { EmotionalState, ProtocolStep } from '../types/neurocalm';

export const STATE_PROTOCOL: Record<EmotionalState, ProtocolStep[]> = {
  leve: [
    { type: 'breathing', duration: 120, title: 'Respiração Calma', description: 'Siga o ritmo suave' },
    { type: 'breathing', duration: 180, title: 'Respiração Profunda', description: 'Mantenha o foco no ar' }
  ],
  sobrecarga: [
    { type: 'grounding', title: 'Ancoragem (5-4-3-2-1)', description: 'Foque no que está ao seu redor' },
    { type: 'breathing', duration: 120, title: 'Respiração de Alívio', description: 'Solte a tensão' }
  ],
  crise: [
    { type: 'countdown', duration: 60, title: 'Estabilização', description: 'Acompanhe os números' },
    { type: 'breathing', duration: 60, title: 'Respiração de Segurança', description: 'Você está seguro agora' }
  ]
};

export const STATE_METADATA = {
  leve: {
    label: 'Leve',
    subtitle: 'início de tensão',
    color: '#E8F5E9', // soft green tint
    overlay: 'bg-green-50/30'
  },
  sobrecarga: {
    label: 'Sobrecarga',
    subtitle: 'muito estímulo',
    color: '#FFF3E0', // warm tint
    overlay: 'bg-orange-50/30'
  },
  crise: {
    label: 'Crise',
    subtitle: 'difícil se controlar',
    color: '#FFEBEE', // soft red tint
    overlay: 'bg-red-50/30'
  }
};
