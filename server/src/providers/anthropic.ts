// ============================================
// Anthropic (Claude) 适配器
// ============================================
import { ChatMessage, ProviderAdapter, StreamChunk } from '../types';

export const anthropicAdapter: ProviderAdapter = {
  async *chat(
    model: string,
    messages: ChatMessage[],
    apiKey: string,
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<StreamChunk> {
    // 提取system消息（Anthropic需要单独的system字段）
    const systemMessages = messages.filter(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const body: Record<string, unknown> = {
      model,
      messages: chatMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
      stream: true,
    };

    if (systemMessages.length > 0) {
      body.system = systemMessages.map(m => m.content).join('\n\n');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
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

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text;
              if (text) {
                yield { content: text };
              }
            } else if (parsed.type === 'message_stop') {
              yield { content: '', finishReason: 'stop' };
            } else if (parsed.type === 'error') {
              throw new Error(`Anthropic stream error: ${parsed.error?.message}`);
            }
          } catch (e) {
            if (e instanceof Error && e.message.includes('Anthropic')) throw e;
            // skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
