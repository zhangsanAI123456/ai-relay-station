// ============================================
// 服务器入口
// ============================================
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════╗');
  console.log('║     🤖 AI中转站 - AI Relay Station    ║');
  console.log('║                                      ║');
  console.log(`║  Server running on: http://localhost:${PORT}  ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log('Available providers:');
  console.log('  🌍 International: OpenAI, Anthropic, Google');
  console.log('  🇨🇳 Domestic: DeepSeek, Qwen, Moonshot, Baidu, ByteDance, Zhipu');
  console.log('');
});
