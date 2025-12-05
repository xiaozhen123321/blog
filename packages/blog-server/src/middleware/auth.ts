import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { sendError } from '../utils/response';

// 扩展 Express Request 类型，添加 userId 字段
export interface AuthRequest extends Request {
  userId?: number;
}

// JWT 认证中间件
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      sendError(res, 401, 'No authorization token provided');
      return;
    }

    // 提取 Bearer token
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      sendError(res, 401, 'Invalid authorization format');
      return;
    }

    // 验证 token
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as { userId: number };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        sendError(res, 401, 'Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        sendError(res, 401, 'Invalid token');
      } else {
        sendError(res, 401, 'Token verification failed');
      }
    }
  } catch (error) {
    sendError(res, 500, 'Authentication error');
  }
}
