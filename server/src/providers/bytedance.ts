// ============================================
// 字节豆包 (Doubao) 适配器 (OpenAI兼容 via Ark)
// ============================================
import { createOpenAICompatibleAdapter } from './openai';

const BYTEDANCE_BASE_URL = process.env.BYTEDANCE_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';

export const bytedanceAdapter = createOpenAICompatibleAdapter(BYTEDANCE_BASE_URL);
