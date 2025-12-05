import { Router } from 'express';
import { loginHandler, verifyHandler } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/auth/login - 登录
router.post('/login', loginHandler);

// POST /api/auth/verify - 验证 token
router.post('/verify', authMiddleware, verifyHandler);

export default router;
