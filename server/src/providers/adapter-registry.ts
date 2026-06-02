// ============================================
// 适配器注册表 - 将provider id映射到对应的adapter
// ============================================
import { ProviderAdapter } from '../types';
import { createOpenAICompatibleAdapter } from './openai';
import { anthropicAdapter } from './anthropic';
import { googleAdapter } from './google';
import { deepseekAdapter } from './deepseek';
import { qwenAdapter } from './qwen';
import { moonshotAdapter } from './moonshot';
import { baiduAdapter } from './baidu';
import { bytedanceAdapter } from './bytedance';
import { zhipuAdapter } from './zhipu';

const adapterRegistry: Record<string, ProviderAdapter> = {
  openai: createOpenAICompatibleAdapter(
    process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  ),
  anthropic: anthropicAdapter,
  google: googleAdapter,
  deepseek: deepseekAdapter,
  qwen: qwenAdapter,
  moonshot: moonshotAdapter,
  baidu: baiduAdapter,
  bytedance: bytedanceAdapter,
  zhipu: zhipuAdapter,
};

/** 获取provider对应的adapter */
export function getAdapter(providerId: string): ProviderAdapter {
  const adapter = adapterRegistry[providerId];
  if (!adapter) {
    throw new Error(`Unknown provider: ${providerId}`);
  }
  return adapter;
}

/** 获取provider对应的默认API Key（从环境变量） */
export function getDefaultApiKey(providerId: string): string {
  const envMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    qwen: 'QWEN_API_KEY',
    moonshot: 'MOONSHOT_API_KEY',
    baidu: 'BAIDU_API_KEY',
    bytedance: 'BYTEDANCE_API_KEY',
    zhipu: 'ZHIPU_API_KEY',
  };

  const envKey = envMap[providerId];
  if (!envKey) return '';

  // 百度特殊处理：拼接API_KEY:SECRET_KEY
  if (providerId === 'baidu') {
    const ak = process.env.BAIDU_API_KEY || '';
    const sk = process.env.BAIDU_SECRET_KEY || '';
    return ak && sk ? `${ak}:${sk}` : '';
  }

  return process.env[envKey] || '';
}
