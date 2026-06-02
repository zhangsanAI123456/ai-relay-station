// ============================================
// 智谱清言 (GLM) 适配器 (OpenAI兼容但base URL不同)
// ============================================
import { createOpenAICompatibleAdapter } from './openai';

const ZHIPU_BASE_URL = process.env.ZHIPU_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

export const zhipuAdapter = createOpenAICompatibleAdapter(ZHIPU_BASE_URL);
