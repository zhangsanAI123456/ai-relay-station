// ============================================
// 统一类型定义
// ============================================

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system';

/** 聊天消息 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/** AI模型 */
export interface AIModel {
  id: string;
  name: string;
  description?: string;
  maxTokens?: number;
}

/** AI提供商 */
export interface AIProvider {
  id: string;
  name: string;
  category: 'international' | 'domestic';
  icon: string;
  models: AIModel[];
  requiresApiKey: boolean;
  description: string;
}

/** 聊天请求 */
export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

/** 流式响应块 */
export interface StreamChunk {
  content: string;
  finishReason?: 'stop' | 'length' | 'error';
}

/** 提供商适配器接口 */
export interface ProviderAdapter {
  chat(
    model: string,
    messages: ChatMessage[],
    apiKey: string,
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<StreamChunk>;
}
