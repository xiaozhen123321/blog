import cors from 'cors';
import { env } from '../config/env';

// 解析多个 CORS 源（支持逗号分隔）
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  if (env.FRONTEND_URL) {
    origins.push(...env.FRONTEND_URL.split(',').map(url => url.trim()));
  }

  if (env.ADMIN_URL) {
    origins.push(...env.ADMIN_URL.split(',').map(url => url.trim()));
  }

  return origins;
}

// CORS 配置
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // 开发环境允许无 origin（Postman 等工具）
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 检查是否在允许列表中
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
