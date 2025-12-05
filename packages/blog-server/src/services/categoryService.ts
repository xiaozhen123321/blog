import { query, queryOne } from '../config/database';
import { Category, CategoryWithCount } from '../models/Category';

// 获取所有分类（带文章数量）
export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const categories = await query<CategoryWithCount>(`
    SELECT
      c.*,
      COUNT(a.id) as article_count
    FROM categories c
    LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `);

  return categories;
}

// 根据 ID 获取分类
export async function getCategoryById(id: number): Promise<Category | null> {
  return await queryOne<Category>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
}

// 根据 slug 获取分类
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return await queryOne<Category>(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );
}

// 创建分类
export async function createCategory(name: string, slug?: string, description?: string): Promise<number> {
  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-');

  const result: any = await query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, finalSlug, description || null]
  );

  return result.insertId;
}

// 更新分类
export async function updateCategory(id: number, name: string, slug?: string, description?: string): Promise<void> {
  await query(
    'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
    [name, slug || name.toLowerCase().replace(/\s+/g, '-'), description || null, id]
  );
}

// 删除分类
export async function deleteCategory(id: number): Promise<void> {
  // 检查是否有文章使用该分类
  const articles = await query(
    'SELECT COUNT(*) as count FROM articles WHERE category_id = ?',
    [id]
  );

  if (articles[0] && (articles[0] as any).count > 0) {
    throw new Error('Cannot delete category with existing articles');
  }

  await query('DELETE FROM categories WHERE id = ?', [id]);
}
