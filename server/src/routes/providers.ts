// ============================================
// Providers路由 - 返回可用AI提供商信息
// ============================================
import { Router } from 'express';
import { getPublicProviders } from '../providers/index';

const router = Router();

// GET /api/providers - 获取所有可用提供商
router.get('/', (_req, res) => {
  const providers = getPublicProviders();
  res.json({
    success: true,
    data: providers,
    total: providers.length,
  });
});

export default router;
