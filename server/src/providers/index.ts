// ============================================
// AI提供商注册表
// ============================================
import { AIProvider } from '../types';

export const providers: AIProvider[] = [
  // ========== 国际 ==========
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'international',
    icon: '🧠',
    description: 'GPT-5.5系列，最新旗舰模型',
    requiresApiKey: true,
    models: [
      { id: 'gpt-5.5', name: 'GPT-5.5', description: '最新旗舰通用模型 (2026.4)', maxTokens: 1050000 },
      { id: 'gpt-5.5-pro', name: 'GPT-5.5 Pro', description: '最高精度推理版', maxTokens: 1050000 },
      { id: 'gpt-5.4', name: 'GPT-5.4', description: '高性价比前沿模型 (2026.3)', maxTokens: 1050000 },
      { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', description: '高产量生产首选 (2026.3)', maxTokens: 400000 },
      { id: 'gpt-4.1', name: 'GPT-4.1', description: '强指令遵循/工具调用', maxTokens: 1047576 },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: '低延迟工具调用', maxTokens: 1047576 },
      { id: 'o3', name: 'o3', description: '深度推理模型 (2025.4)', maxTokens: 200000 },
      { id: 'o4-mini', name: 'o4-mini', description: '高效推理模型 (2025.4)', maxTokens: 200000 },
      { id: 'gpt-5.3-codex', name: 'GPT-5.3 Codex', description: '专业编程模型 (2026.2)', maxTokens: 400000 },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    category: 'international',
    icon: '🎭',
    description: 'Claude 4.6系列，安全可靠的AI助手',
    requiresApiKey: true,
    models: [
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', description: '最强旗舰，1M上下文', maxTokens: 1000000 },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', description: '性能与速度平衡', maxTokens: 1000000 },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5', description: '极速轻量模型', maxTokens: 200000 },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    category: 'international',
    icon: '💎',
    description: 'Gemini 3.5系列，Google最新AI技术',
    requiresApiKey: true,
    models: [
      { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', description: '最新旗舰Flash (2026.5 I/O)', maxTokens: 1048576 },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', description: '旗舰推理模型', maxTokens: 1048576 },
      { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', description: '高速通用模型', maxTokens: 1048576 },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', description: '极致性价比 (2026.5)', maxTokens: 1048576 },
    ],
  },

  // ========== 国内 ==========
  {
    id: 'deepseek',
    name: 'DeepSeek',
    category: 'domestic',
    icon: '🐋',
    description: '深度求索，V4系列最新旗舰',
    requiresApiKey: true,
    models: [
      { id: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', description: '最新旗舰专业版 (2026)', maxTokens: 131072 },
      { id: 'deepseek-v4-flash', name: 'DeepSeek-V4-Flash', description: '最新极速版 (2026)', maxTokens: 131072 },
      { id: 'deepseek-v3.2', name: 'DeepSeek-V3.2', description: '通用主力 (685B MoE)', maxTokens: 131072 },
      { id: 'deepseek-r2', name: 'DeepSeek-R2', description: '深度推理模型，R1继任者', maxTokens: 131072 },
    ],
  },
  {
    id: 'qwen',
    name: '通义千问',
    category: 'domestic',
    icon: '☁️',
    description: '阿里云出品，Qwen3.7系列',
    requiresApiKey: true,
    models: [
      { id: 'qwen3.7-max-preview', name: 'Qwen3.7-Max', description: '最新万亿参数旗舰 (2026.5)', maxTokens: 262144 },
      { id: 'qwen3.6-max-preview', name: 'Qwen3.6-Max', description: '旗舰模型 (2026.4)', maxTokens: 262144 },
      { id: 'qwen3.6-plus', name: 'Qwen3.6-Plus', description: '增强版模型', maxTokens: 262144 },
      { id: 'qwen3.6-flash', name: 'Qwen3.6-Flash', description: '极速版，1M上下文', maxTokens: 1000000 },
      { id: 'qwen3-max', name: 'Qwen3-Max', description: '上一代旗舰，256K', maxTokens: 262144 },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot (Kimi)',
    category: 'domestic',
    icon: '🚀',
    description: '月之暗面，Kimi K2.6万亿参数',
    requiresApiKey: true,
    models: [
      { id: 'kimi-k2.6', name: 'Kimi K2.6', description: '最新旗舰 (1T MoE, 256K)', maxTokens: 262144 },
      { id: 'kimi-k2.5', name: 'Kimi K2.5', description: '上一代旗舰', maxTokens: 131072 },
    ],
  },
  {
    id: 'baidu',
    name: '文心一言',
    category: 'domestic',
    icon: '🐻',
    description: '百度出品，ERNIE 4.5系列',
    requiresApiKey: true,
    models: [
      { id: 'ernie-4.5-turbo-128k', name: 'ERNIE 4.5 Turbo 128K', description: '最新旗舰，128K超长上下文', maxTokens: 131072 },
      { id: 'ernie-4.5-21b-a3b', name: 'ERNIE 4.5 21B', description: '开源通用模型 (21B/3B激活)', maxTokens: 32768 },
      { id: 'ernie-4.5-21b-a3b-thinking', name: 'ERNIE 4.5 21B Thinking', description: '深度推理增强版', maxTokens: 32768 },
    ],
  },
  {
    id: 'bytedance',
    name: '字节豆包',
    category: 'domestic',
    icon: '🎵',
    description: '字节跳动，豆包2.0全模态',
    requiresApiKey: true,
    models: [
      { id: 'doubao-seed-2.0-pro', name: '豆包2.0 Pro', description: '旗舰深度推理 (2026.2)', maxTokens: 32768 },
      { id: 'doubao-seed-2.0-lite', name: '豆包2.0 Lite', description: '全模态理解 (2026.5升级)', maxTokens: 32768 },
      { id: 'doubao-seed-2.0-mini', name: '豆包2.0 Mini', description: '低延迟高并发', maxTokens: 32768 },
      { id: 'doubao-seed-2.0-code', name: '豆包2.0 Code', description: '专业编程模型', maxTokens: 32768 },
    ],
  },
  {
    id: 'zhipu',
    name: '智谱清言',
    category: 'domestic',
    icon: '🏛️',
    description: '智谱AI，GLM-5.1系列',
    requiresApiKey: true,
    models: [
      { id: 'glm-5.1', name: 'GLM-5.1', description: '最新旗舰 (744B MoE, 200K)', maxTokens: 200000 },
      { id: 'glm-5.1-highspeed', name: 'GLM-5.1 高速版', description: '400 t/s全球最快API (2026.5)', maxTokens: 200000 },
      { id: 'glm-5', name: 'GLM-5', description: '开源旗舰基座 (MIT协议)', maxTokens: 200000 },
      { id: 'glm-5-turbo', name: 'GLM-5 Turbo', description: 'Agent场景优化版', maxTokens: 200000 },
      { id: 'glm-5v-turbo', name: 'GLM-5V Turbo', description: '多模态视觉编程模型', maxTokens: 202752 },
    ],
  },
];

// 获取所有provider信息（不暴露API密钥）
export function getPublicProviders(): Omit<AIProvider, 'requiresApiKey'>[] {
  return providers.map(({ requiresApiKey, ...rest }) => rest);
}
