
export interface DailyHoroscope {
  date: string;
  overall_score: number;
  lucky_color: string;
  lucky_direction: string;
  summary: string;
  action_items: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export enum AppSection {
  HOME = 'HOME',
  DAILY = 'DAILY',
  CHAT = 'CHAT',
  VISION = 'VISION',
  PROFILE = 'PROFILE'
}
