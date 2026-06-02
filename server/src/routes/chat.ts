// ============================================
// Chat路由 - 统一聊天接口（SSE流式）
// ============================================
import { Router, Request, Response } from 'express';
import { getAdapter, getDefaultApiKey } from '../providers/adapter-registry';
import { ChatRequest } from '../types';

const router = Router();

// POST /api/chat/:provider - 发送聊天请求
router.post('/:provider', async (req: Request, res: Response) => {
  const { provider } = req.params;
  const { model, messages, apiKey: userApiKey, temperature, maxTokens } = req.body as ChatRequest;

  // 验证参数
  if (!model || !messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: model, messages',
    });
    return;
  }

  // 获取API Key（优先使用用户提供的，否则使用环境变量）
  const apiKey = userApiKey || getDefaultApiKey(provider);
  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: `No API key configured for "${provider}". Please provide an API key or configure it in the server environment.`,
    });
    return;
  }

  try {
    const adapter = getAdapter(provider);

    // 设置SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // 流式发送响应
    const stream = adapter.chat(model, messages, apiKey, { temperature, maxTokens });

    for await (const chunk of stream) {
      if (chunk.content) {
        res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
      }
      if (chunk.finishReason) {
        res.write(`data: ${JSON.stringify({ finishReason: chunk.finishReason })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // 如果header还没发送，返回JSON错误
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    } else {
      // 如果已经开始流式输出，发送错误事件
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
});

export default router;
