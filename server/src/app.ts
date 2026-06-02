// ============================================
// Express应用配置
// ============================================
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import providersRouter from './routes/providers';
import chatRouter from './routes/chat';

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 请求日志
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========== 生产模式：提供前端静态文件 ==========
// 查找前端构建产物（支持多个路径）
const possiblePaths = [
  path.join(__dirname, '..', 'public'),                          // Render生产部署
  path.join(__dirname, '..', '..', 'client', 'dist'),            // 本地开发生产
];

let staticPath: string | null = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    staticPath = p;
    break;
  }
}

if (staticPath) {
  console.log('📦 Serving frontend from:', staticPath);
  app.use(express.static(staticPath));

  // SPA fallback：所有非 /api 路由返回 index.html
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(staticPath!, 'index.html'));
  });
} else {
  console.log('ℹ️  Frontend dist not found. Run "npm run build" first.');
}

// ========== API路由 ==========
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'AI Relay Station is running 🚀' });
});

app.use('/api/providers', providersRouter);
app.use('/api/chat', chatRouter);

// 如果前端未构建，API 404兜底
app.use('/api/*', (_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

export default app;
