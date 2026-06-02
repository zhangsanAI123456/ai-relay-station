// ============================================
// DeepSeek 适配器 (OpenAI兼容)
// ============================================
import { createOpenAICompatibleAdapter } from './openai';

const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

export const deepseekAdapter = createOpenAICompatibleAdapter(DEEPSEEK_BASE_URL);
