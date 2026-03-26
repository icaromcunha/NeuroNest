export type PauseState = 'AMARELO' | 'LARANJA' | 'VERMELHO';

export interface Task {
  id: string;
  title: string;
  status: 'AGORA' | 'DEPOIS' | 'CONCLUÍDO';
}

export interface Phrase {
  id: string;
  category: string;
  text: string;
}
