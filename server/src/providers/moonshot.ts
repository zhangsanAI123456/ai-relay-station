// ============================================
// Moonshot (Kimi) 适配器 (OpenAI兼容)
// ============================================
import { createOpenAICompatibleAdapter } from './openai';

const MOONSHOT_BASE_URL = process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.cn/v1';

export const moonshotAdapter = createOpenAICompatibleAdapter(MOONSHOT_BASE_URL);
