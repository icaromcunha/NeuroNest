export type EmotionalState = 'leve' | 'sobrecarga' | 'crise';

export type StepType = 'breathing' | 'grounding' | 'countdown';

export interface ProtocolStep {
  type: StepType;
  duration?: number; // in seconds
  instruction?: string;
}

export const STATE_PROTOCOL: Record<EmotionalState, ProtocolStep[]> = {
  leve: [
    { type: 'breathing', duration: 120, instruction: 'Respire com calma' },
    { type: 'breathing', duration: 180, instruction: 'Mantenha o ritmo' }
  ],
  sobrecarga: [
    { type: 'grounding', instruction: 'Vamos focar no agora' },
    { type: 'breathing', duration: 120, instruction: 'Agora, respire comigo' }
  ],
  crise: [
    { type: 'countdown', duration: 60, instruction: 'Foque nos números' },
    { type: 'breathing', duration: 60, instruction: 'Respire devagar' }
  ]
};

export interface CommunicationMessage {
  id: string;
  label: string;
  color: string;
}

export interface RoutineTask {
  id: string;
  time?: string;
  task: string;
  completed: boolean;
  repeat?: boolean;
}

export interface AppSettings {
  voiceEnabled: boolean;
  repeatVoice: boolean;
  isPremium: boolean;
}
