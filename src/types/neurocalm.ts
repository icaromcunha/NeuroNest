
export type EmotionalState = 'leve' | 'sobrecarga' | 'crise';

export type StepType = 'breathing' | 'grounding' | 'countdown';

export interface ProtocolStep {
  type: StepType;
  duration?: number; // in seconds
  title?: string;
  description?: string;
}

export interface UserSettings {
  voiceEnabled: boolean;
  voiceRepeat: boolean;
  isPremium: boolean;
  trialsUsed: {
    sobrecarga: number;
    crise: number;
  };
}

export interface RoutineTask {
  id: string;
  title: string;
  time?: string;
  completed: boolean;
}

export interface CommunicationMessage {
  id: string;
  text: string;
  icon?: string;
}
