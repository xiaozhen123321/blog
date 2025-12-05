import { Router } from 'express';
import {
  getAllCategoriesHandler,
  getCategoryHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/categories - 获取所有分类（公开）
router.get('/', getAllCategoriesHandler);

// GET /api/categories/:id - 获取单个分类（公开）
router.get('/:id', getCategoryHandler);

// POST /api/categories - 创建分类（需认证）
router.post('/', authMiddleware, createCategoryHandler);

// PUT /api/categories/:id - 更新分类（需认证）
router.put('/:id', authMiddleware, updateCategoryHandler);

// DELETE /api/categories/:id - 删除分类（需认证）
router.delete('/:id', authMiddleware, deleteCategoryHandler);

export default router;
