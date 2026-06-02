// ============================================
// API服务层
// ============================================
import { AIProvider, ChatMessage, ProvidersResponse } from '../types';

const API_BASE = '/api';

/** 获取所有AI提供商 */
export async function fetchProviders(): Promise<AIProvider[]> {
  const res = await fetch(`${API_BASE}/providers`);
  if (!res.ok) throw new Error(`Failed to fetch providers: ${res.status}`);
  const data: ProvidersResponse = await res.json();
  return data.data;
}

/** 流式聊天请求 */
export async function* streamChat(
  provider: string,
  model: string,
  messages: ChatMessage[],
  apiKey?: string
): AsyncGenerator<{ content?: string; finishReason?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/chat/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      apiKey: apiKey || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
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

        if (data === '[DONE]') return;

        try {
          yield JSON.parse(data);
        } catch {
          // skip malformed
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
