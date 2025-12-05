import { Request, Response } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import { sendSuccess, sendError } from '../utils/response';

// 获取所有分类
export async function getAllCategoriesHandler(req: Request, res: Response): Promise<void> {
  try {
    const categories = await getAllCategories();
    sendSuccess(res, categories);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch categories');
  }
}

// 获取单个分类
export async function getCategoryHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const category = await getCategoryById(id);

    if (!category) {
      sendError(res, 404, 'Category not found');
      return;
    }

    sendSuccess(res, category);
  } catch (error) {
    sendError(res, 500, 'Failed to fetch category');
  }
}

// 创建分类
export async function createCategoryHandler(req: Request, res: Response): Promise<void> {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      sendError(res, 400, 'Category name is required');
      return;
    }

    const id = await createCategory(name, slug, description);
    sendSuccess(res, { id }, 'Category created successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('Duplicate')) {
      sendError(res, 409, 'Category name or slug already exists');
    } else {
      sendError(res, 500, 'Failed to create category');
    }
  }
}

// 更新分类
export async function updateCategoryHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, slug, description } = req.body;

    if (!name) {
      sendError(res, 400, 'Category name is required');
      return;
    }

    await updateCategory(id, name, slug, description);
    sendSuccess(res, null, 'Category updated successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to update category');
  }
}

// 删除分类
export async function deleteCategoryHandler(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteCategory(id);
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('articles')) {
      sendError(res, 400, error.message);
    } else {
      sendError(res, 500, 'Failed to delete category');
    }
  }
}
