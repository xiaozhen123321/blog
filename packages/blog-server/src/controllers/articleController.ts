import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
} from '../services/articleService';
import { sendSuccess, sendError } from '../utils/response';

// 获取文章列表
export async function getArticlesHandler(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const category_id = req.query.category_id ? parseInt(req.query.category_id as string, 10) : undefined;
    const status = req.query.status as string | undefined;
    const keyword = req.query.keyword as string | undefined;

    const result = await getArticles({ page, limit, category_id, status, keyword });
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch articles');
  }
}

// 获取文章详情
export async function getArticleHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const article = await getArticleById(id);

    if (!article) {
      sendError(res, 404, 'Article not found');
      return;
    }

    sendSuccess(res, article);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch article');
  }
}

// 创建文章
export async function createArticleHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, content, summary, category_id, cover_image_id, status } = req.body;

    if (!title || !content || !category_id) {
      sendError(res, 400, 'Title, content, and category_id are required');
      return;
    }

    if (!req.userId) {
      sendError(res, 401, 'Unauthorized');
      return;
    }

    const id = await createArticle({
      title,
      content,
      summary,
      category_id,
      cover_image_id,
      status: status || 'draft',
      author_id: req.userId,
    });

    sendSuccess(res, { id }, 'Article created successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to create article');
  }
}

// 更新文章
export async function updateArticleHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content, summary, category_id, cover_image_id, status } = req.body;

    if (!title || !content || !category_id) {
      sendError(res, 400, 'Title, content, and category_id are required');
      return;
    }

    await updateArticle(id, {
      title,
      content,
      summary,
      category_id,
      cover_image_id,
      status: status || 'draft',
    });

    sendSuccess(res, { id }, 'Article updated successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to update article');
  }
}

// 删除文章
export async function deleteArticleHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteArticle(id);
    sendSuccess(res, null, 'Article deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete article');
  }
}

// 发布文章
export async function publishArticleHandler(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    await publishArticle(id);
    sendSuccess(res, null, 'Article published successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to publish article');
  }
}
