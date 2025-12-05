import multer from 'multer';
import { env } from '../config/env';

// 配置 Multer 使用内存存储（图片将存储在数据库）
const storage = multer.memoryStorage();

// 文件过滤器
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = env.ALLOWED_IMAGE_TYPES.split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${env.ALLOWED_IMAGE_TYPES}`));
  }
};

// Multer 配置
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 默认 5MB
  },
});
