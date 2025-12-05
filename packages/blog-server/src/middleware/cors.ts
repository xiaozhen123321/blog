import cors from 'cors';
import { env } from '../config/env';

// CORS 配置
export const corsMiddleware = cors({
  origin: [env.FRONTEND_URL, env.ADMIN_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
