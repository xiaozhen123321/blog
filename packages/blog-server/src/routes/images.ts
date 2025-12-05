import { Router } from 'express';
import { uploadImageHandler, getImageHandler, deleteImageHandler } from '../controllers/imageController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// POST /api/images/upload - 上传图片（需认证）
router.post('/upload', authMiddleware, upload.single('image'), uploadImageHandler);

// GET /api/images/:id - 获取图片（公开）
router.get('/:id', getImageHandler);

// DELETE /api/images/:id - 删除图片（需认证）
router.delete('/:id', authMiddleware, deleteImageHandler);

export default router;
