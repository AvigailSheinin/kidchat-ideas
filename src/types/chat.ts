export interface Sender {
  id: string;
  name: string;
  type: 'ai' | 'kid' | 'user';
}

export interface Message {
  id: string;
  content: string;
  sender: Sender;
  timestamp: number;
}

export interface LessonState {
  currentPhase: 'intro' | 'scenario' | 'discussion' | 'planning' | 'summary';
  currentSpeaker: string | null;
  participantIndex: number;
  isComplete: boolean;
}

export interface Kid {
  id: string;
  name: string;
  avatar: string;
  personality: string;
}

export interface ChatSession {
  id: string;
  lessonTitle: string;
  participants: Kid[];
  messages: Message[];
  state: LessonState;
}