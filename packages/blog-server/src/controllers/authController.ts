import { Request, Response } from 'express';
import { login, getUserById } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

// 登录
export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      sendError(res, 400, 'Username and password are required');
      return;
    }

    const result = await login(username, password);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 401, error.message);
    } else {
      sendError(res, 500, 'Login failed');
    }
  }
}

// 验证 token
export async function verifyHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 401, 'Unauthorized');
      return;
    }

    const user = await getUserById(req.userId);
    if (!user) {
      sendError(res, 404, 'User not found');
      return;
    }

    sendSuccess(res, { user }, 'Token is valid');
  } catch (error) {
    sendError(res, 500, 'Token verification failed');
  }
}
