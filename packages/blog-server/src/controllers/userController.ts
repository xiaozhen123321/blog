import { Request, Response } from 'express';
import { getAllUsers, createUser } from '../services/userService';
import { sendSuccess, sendError } from '../utils/response';

// 获取所有用户
export async function getAllUsersHandler(req: Request, res: Response): Promise<void> {
  try {
    const users = await getAllUsers();
    sendSuccess(res, users);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch users');
  }
}

// 创建用户
export async function createUserHandler(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      sendError(res, 400, 'Username and password are required');
      return;
    }

    const id = await createUser(username, password, email);
    sendSuccess(res, { id }, 'User created successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('Duplicate')) {
      sendError(res, 409, 'Username already exists');
    } else {
      sendError(res, 500, 'Failed to create user');
    }
  }
}
