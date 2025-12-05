import { Router } from 'express';
import {
  getArticlesHandler,
  getArticleHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler,
  publishArticleHandler,
} from '../controllers/articleController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/articles - 获取文章列表（公开）
router.get('/', getArticlesHandler);

// GET /api/articles/:id - 获取文章详情（公开）
router.get('/:id', getArticleHandler);

// POST /api/articles - 创建文章（需认证）
router.post('/', authMiddleware, createArticleHandler);

// PUT /api/articles/:id - 更新文章（需认证）
router.put('/:id', authMiddleware, updateArticleHandler);

// DELETE /api/articles/:id - 删除文章（需认证）
router.delete('/:id', authMiddleware, deleteArticleHandler);

// POST /api/articles/:id/publish - 发布文章（需认证）
router.post('/:id/publish', authMiddleware, publishArticleHandler);

export default router;
