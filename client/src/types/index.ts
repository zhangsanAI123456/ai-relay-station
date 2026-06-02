// ============================================
// 前端类型定义
// ============================================

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
}

export interface AIProvider {
  id: string;
  name: string;
  category: 'international' | 'domestic';
  icon: string;
  models: AIModel[];
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface Conversation {
  providerId: string;
  modelId: string;
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface ProvidersResponse {
  success: boolean;
  data: AIProvider[];
  total: number;
}
