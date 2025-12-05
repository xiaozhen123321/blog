import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { saveImage, getImageById, deleteImage, formatImageResponse } from '../services/imageService';
import { sendSuccess, sendError } from '../utils/response';

// 上传图片
export async function uploadImageHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      sendError(res, 400, 'No file uploaded');
      return;
    }

    const imageId = await saveImage(req.file);
    const image = await getImageById(imageId);

    if (!image) {
      sendError(res, 500, 'Failed to retrieve uploaded image');
      return;
    }

    sendSuccess(res, formatImageResponse(image), 'Image uploaded successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('file type')) {
      sendError(res, 400, error.message);
    } else {
      sendError(res, 500, 'Failed to upload image');
    }
  }
}

// 获取图片
export async function getImageHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const image = await getImageById(id);

    if (!image) {
      sendError(res, 404, 'Image not found');
      return;
    }

    // 设置响应头并返回二进制数据
    res.setHeader('Content-Type', image.mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    res.send(image.data);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch image');
  }
}

// 删除图片
export async function deleteImageHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteImage(id);
    sendSuccess(res, null, 'Image deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete image');
  }
}
