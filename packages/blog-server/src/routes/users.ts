import { Router } from 'express';
import { getAllUsersHandler, createUserHandler } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/users - 获取所有用户（需认证）
router.get('/', authMiddleware, getAllUsersHandler);

// POST /api/users - 创建用户（需认证）
router.post('/', authMiddleware, createUserHandler);

export default router;
