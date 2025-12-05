import { query, queryOne } from '../config/database';
import { Image, ImageResponse } from '../models/Image';

// 保存图片到数据库
export async function saveImage(file: Express.Multer.File): Promise<number> {
  const filename = `${Date.now()}-${file.originalname}`;

  const result: any = await query(
    'INSERT INTO images (filename, original_name, data, mime_type, size) VALUES (?, ?, ?, ?, ?)',
    [filename, file.originalname, file.buffer, file.mimetype, file.size]
  );

  return result.insertId;
}

// 根据 ID 获取图片
export async function getImageById(id: number): Promise<Image | null> {
  return await queryOne<Image>(
    'SELECT * FROM images WHERE id = ?',
    [id]
  );
}

// 删除图片
export async function deleteImage(id: number): Promise<void> {
  await query('DELETE FROM images WHERE id = ?', [id]);
}

// 格式化图片响应
export function formatImageResponse(image: Image): ImageResponse {
  return {
    id: image.id,
    filename: image.filename,
    url: `/api/images/${image.id}`,
    size: image.size,
    mime_type: image.mime_type,
    created_at: image.created_at.toISOString(),
  };
}
