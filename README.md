# 🤖 AI中转站 - AI Relay Station

统一接入国内外各大主流AI工具的API中转站。一个界面，畅聊所有AI模型。

## ✨ 特性

- 🌍 **国际AI**：OpenAI (GPT-4o)、Anthropic (Claude)、Google (Gemini)
- 🇨🇳 **国内AI**：DeepSeek、通义千问、Kimi、文心一言、豆包、智谱清言
- 🔄 **流式响应**：支持SSE实时流式输出
- 🏷️ **多Tab切换**：点击即可在不同AI间切换，独立会话
- 🔐 **安全存储**：API Key仅保存在浏览器本地，不上传服务器
- 📝 **Markdown渲染**：代码高亮、表格、列表等完美显示
- 🎨 **现代UI**：Tailwind CSS + React 18，简洁美观

## 📁 项目结构

```
ai-relay-station/
├── client/                 # React前端
│   └── src/
│       ├── components/     # 7个核心组件
│       ├── contexts/       # 聊天状态管理
│       ├── services/       # API调用层
│       └── types/          # TypeScript类型
├── server/                 # Node.js后端
│   └── src/
│       ├── providers/      # 10个AI提供商适配器
│       ├── routes/         # Express路由
│       └── types/          # 类型定义
└── .env.example            # 环境变量模板
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ai-relay-station
npm run install:all
```

### 2. 配置API密钥

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的API密钥
```

> **两种密钥配置方式：**
> - **服务端配置**：在 `.env` 中设置，所有用户共享
> - **客户端配置**：在网页设置面板中输入，保存在浏览器本地

### 3. 启动项目

```bash
npm run dev
```

这会同时启动：
- 前端开发服务器：`http://localhost:3000`
- 后端API服务器：`http://localhost:4000`

### 4. 打开浏览器

访问 `http://localhost:3000` 开始使用。

## 🔌 支持的AI模型（2026年6月最新版本）

### 国际

| 提供商 | 模型 | 说明 |
|--------|------|------|
| 🧠 OpenAI | GPT-5.5 / 5.4 / 4.1 / o3 / o4-mini / Codex | 最新GPT-5.5系列 |
| 🎭 Anthropic | Claude Opus 4.6 / Sonnet 4.6 / Haiku 4.5 | 1M超长上下文 |
| 💎 Google | Gemini 3.5 Flash / 3.1 Pro / 3.1 Flash | 2026 I/O最新 |

### 国内

| 提供商 | 模型 | 说明 |
|--------|------|------|
| 🐋 DeepSeek | V4-Pro / V4-Flash / V3.2 / R2 | 最新V4系列 |
| ☁️ 通义千问 | Qwen3.7-Max / 3.6-Max / 3.6-Plus / 3.6-Flash | 万亿参数旗舰 |
| 🚀 Kimi | Kimi K2.6 (1T MoE) / K2.5 | 万亿参数开源 |
| 🐻 文心一言 | ERNIE 4.5 Turbo 128K / 4.5 21B / Thinking | 21款模型开源 |
| 🎵 豆包 | 豆包2.0 Pro / Lite / Mini / Code | 全模态理解 |
| 🏛️ 智谱清言 | GLM-5.1 / 5.1高速版 / GLM-5 / GLM-5V | 400t/s全球最快 |

## 🔧 API设计

### GET /api/providers
返回所有可用AI提供商及模型列表。

### POST /api/chat/:provider
统一聊天接口（SSE流式响应）。

```json
{
  "model": "gpt-5.5",
  "messages": [
    { "role": "user", "content": "你好" }
  ],
  "apiKey": "sk-..." // 可选，不传则使用服务端配置
}
```

## 🛠️ 技术栈

- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **后端**：Node.js + Express + TypeScript
- **流式通信**：Server-Sent Events (SSE)
- **渲染**：react-markdown + syntax highlighting

## 📄 许可

MIT License
