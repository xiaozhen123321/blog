import { Router } from 'express';
import authRoutes from './auth';
import categoryRoutes from './categories';
import imageRoutes from './images';
import articleRoutes from './articles';
import userRoutes from './users';

// 创建主路由
export const routes = Router();

// 健康检查路由
routes.get('/health', (req, res) => {
  res.json({
    code: 0,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// 注册 API 路由
routes.use('/auth', authRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/images', imageRoutes);
routes.use('/articles', articleRoutes);
routes.use('/users', userRoutes);

