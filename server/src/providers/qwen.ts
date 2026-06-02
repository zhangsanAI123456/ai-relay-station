// ============================================
// 通义千问 (Qwen) 适配器 (OpenAI兼容 via DashScope)
// ============================================
import { createOpenAICompatibleAdapter } from './openai';

const QWEN_BASE_URL = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';

export const qwenAdapter = createOpenAICompatibleAdapter(QWEN_BASE_URL);
