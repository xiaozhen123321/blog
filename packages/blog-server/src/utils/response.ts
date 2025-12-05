import { Response } from 'express';

// 标准化 API 响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 成功响应
export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message: string = 'success'
): Response {
  const response: ApiResponse<T> = {
    code: 0,
    message,
    data,
  };
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json(response);
}

// 错误响应
export function sendError(
  res: Response,
  code: number,
  message: string,
  data?: any
): Response {
  const statusCode = code >= 500 ? 500 : code >= 400 ? code : 400;
  const response: ApiResponse = {
    code,
    message,
    data,
  };
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(statusCode).json(response);
}
