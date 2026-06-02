// ============================================
// OpenAI 适配器
// ============================================
import { ChatMessage, ProviderAdapter, StreamChunk } from '../types';

export async function* openaiChat(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): AsyncGenerator<StreamChunk> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);

        if (data === '[DONE]') {
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          const finishReason = parsed.choices?.[0]?.finish_reason;

          if (delta?.content) {
            yield { content: delta.content };
          }
          if (finishReason) {
            yield { content: '', finishReason };
          }
        } catch {
          // skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================
// OpenAI兼容适配器工厂
// 适用于: DeepSeek, Moonshot, Qwen(DashScope), ByteDance(Ark) 等兼容OpenAI格式的API
// ============================================
export function createOpenAICompatibleAdapter(baseUrl: string): ProviderAdapter {
  return {
    chat(model: string, messages: ChatMessage[], apiKey: string, options?: { temperature?: number; maxTokens?: number }) {
      return openaiChat(baseUrl, apiKey, model, messages, options);
    },
  };
}
