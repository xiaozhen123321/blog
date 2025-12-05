import dotenv from 'dotenv';
import path from 'path';

// 从项目根目录加载 .env 文件
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface Environment {
  // 数据库配置
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;

  // 服务器配置
  SERVER_PORT: number;
  NODE_ENV: string;

  // JWT 配置
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // CORS 配置
  FRONTEND_URL: string;
  ADMIN_URL: string;

  // 文件上传配置
  MAX_FILE_SIZE: number;
  ALLOWED_IMAGE_TYPES: string;
}

function getEnv(): Environment {
  return {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'blog_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'blog_password',
    DB_NAME: process.env.DB_NAME || 'blog_system',

    SERVER_PORT: parseInt(process.env.SERVER_PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3002',

    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    ALLOWED_IMAGE_TYPES: process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp',
  };
}

export const env = getEnv();
