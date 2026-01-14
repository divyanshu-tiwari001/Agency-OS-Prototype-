export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface ImageGenParams {
  prompt: string;
  size: '1K' | '2K' | '4K';
}

export enum GeminiModel {
  CHAT = 'gemini-3-pro-preview',
  FAST = 'gemini-3-flash-preview',
  IMAGE = 'gemini-3-pro-image-preview',
  TTS = 'gemini-2.5-flash-preview-tts',
  SEARCH = 'gemini-3-flash-preview', // For grounding
}