import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// 全局错误处理中间件
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  // 如果响应已经发送，传递给默认错误处理器
  if (res.headersSent) {
    return next(error);
  }

  // 返回通用错误响应
  sendError(
    res,
    500,
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'Internal server error'
  );
}

// 404 处理中间件
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendError(res, 404, `Route not found: ${req.method} ${req.path}`);
}
