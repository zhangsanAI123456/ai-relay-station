// ============================================
// 百度文心一言 (ERNIE) 适配器
// 百度使用OAuth 2.0获取access_token，然后调用API
// ============================================
import { ChatMessage, ProviderAdapter, StreamChunk } from '../types';

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(apiKey: string, secretKey: string): Promise<string> {
  // 如果缓存token未过期，直接返回
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const response = await fetch(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`Baidu OAuth error: ${response.status}`);
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000, // 提前1分钟过期
  };
  return data.access_token;
}

export const baiduAdapter: ProviderAdapter = {
  async *chat(
    model: string,
    messages: ChatMessage[],
    apiKey: string,
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<StreamChunk> {
    // 百度API密钥格式: "API_KEY:SECRET_KEY"
    const [clientId, clientSecret] = apiKey.split(':');
    if (!clientId || !clientSecret) {
      throw new Error('Baidu API key must be in format "API_KEY:SECRET_KEY"');
    }

    const accessToken = await getAccessToken(clientId, clientSecret);

    // 转换消息格式为用户查询
    const systemMsg = messages.find(m => m.role === 'system');
    const userMsg = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

    const body: Record<string, unknown> = {
      messages: messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.7,
      stream: true,
    };

    if (systemMsg) {
      body.system = systemMsg.content;
    }

    // 根据模型版本选择正确的API端点
    const isProModel = model.includes('ernie-4.5') || model.includes('ernie-4.0');
    const modelEndpoint = isProModel ? 'completions_pro' : 'completions';
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${modelEndpoint}?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Baidu API error: ${response.status} - ${error}`);
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
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);

          try {
            const parsed = JSON.parse(data);
            if (parsed.result) {
              yield { content: parsed.result };
            }
            if (parsed.is_end) {
              yield { content: '', finishReason: 'stop' };
            }
          } catch {
            // skip malformed
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
