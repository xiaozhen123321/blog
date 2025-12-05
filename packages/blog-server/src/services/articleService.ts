import { query, queryOne } from '../config/database';
import { Article, ArticleWithDetails, ArticleListItem } from '../models/Article';

export interface GetArticlesParams {
  page: number;
  limit: number;
  category_id?: number;
  status?: string;
  keyword?: string;
}

export interface ArticlesResult {
  articles: ArticleListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 获取文章列表
export async function getArticles(params: GetArticlesParams): Promise<ArticlesResult> {
  const offset = (params.page - 1) * params.limit;
  const whereClauses: string[] = [];
  const values: any[] = [];

  if (params.status) {
    whereClauses.push('a.status = ?');
    values.push(params.status);
  }

  if (params.category_id) {
    whereClauses.push('a.category_id = ?');
    values.push(params.category_id);
  }

  if (params.keyword) {
    whereClauses.push('(a.title LIKE ? OR a.summary LIKE ?)');
    values.push(`%${params.keyword}%`, `%${params.keyword}%`);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const articles = await query<ArticleListItem>(`
    SELECT
      a.id,
      a.title,
      a.summary,
      a.category_id,
      c.name as category_name,
      a.cover_image_id,
      a.status,
      a.author_id,
      u.username as author_name,
      a.views,
      a.created_at,
      a.updated_at,
      a.published_at
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN admin_users u ON a.author_id = u.id
    ${whereSQL}
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `, [...values, params.limit, offset]);

  const totalResult = await query<{ total: number }>(`
    SELECT COUNT(*) as total FROM articles a ${whereSQL}
  `, values);

  const total = totalResult[0]?.total || 0;

  return {
    articles,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

// 根据 ID 获取文章详情
export async function getArticleById(id: number): Promise<ArticleWithDetails | null> {
  const article = await queryOne<ArticleWithDetails>(`
    SELECT
      a.*,
      c.name as category_name,
      u.username as author_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN admin_users u ON a.author_id = u.id
    WHERE a.id = ?
  `, [id]);

  // 增加浏览次数
  if (article) {
    await query('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
  }

  return article;
}

// 创建文章
export async function createArticle(data: {
  title: string;
  content: string;
  summary?: string;
  category_id: number;
  cover_image_id?: number;
  status: 'draft' | 'published';
  author_id: number;
}): Promise<number> {
  const summary = data.summary || data.content.substring(0, 200).replace(/<[^>]*>/g, '');
  const published_at = data.status === 'published' ? new Date() : null;

  const result: any = await query(`
    INSERT INTO articles
    (title, content, summary, category_id, cover_image_id, status, author_id, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.title,
    data.content,
    summary,
    data.category_id,
    data.cover_image_id || null,
    data.status,
    data.author_id,
    published_at,
  ]);

  return result.insertId;
}

// 更新文章
export async function updateArticle(
  id: number,
  data: {
    title: string;
    content: string;
    summary?: string;
    category_id: number;
    cover_image_id?: number;
    status: 'draft' | 'published';
  }
): Promise<void> {
  const summary = data.summary || data.content.substring(0, 200).replace(/<[^>]*>/g, '');

  // 获取当前文章状态
  const currentArticle = await queryOne<Article>(
    'SELECT status, published_at FROM articles WHERE id = ?',
    [id]
  );

  let published_at = currentArticle?.published_at;

  // 如果从草稿变为发布，设置发布时间
  if (currentArticle && currentArticle.status === 'draft' && data.status === 'published') {
    published_at = new Date();
  }

  await query(`
    UPDATE articles
    SET title = ?, content = ?, summary = ?, category_id = ?, cover_image_id = ?, status = ?, published_at = ?
    WHERE id = ?
  `, [
    data.title,
    data.content,
    summary,
    data.category_id,
    data.cover_image_id || null,
    data.status,
    published_at,
    id,
  ]);
}

// 删除文章
export async function deleteArticle(id: number): Promise<void> {
  await query('DELETE FROM articles WHERE id = ?', [id]);
}

// 发布文章
export async function publishArticle(id: number): Promise<void> {
  await query(`
    UPDATE articles
    SET status = 'published', published_at = NOW()
    WHERE id = ?
  `, [id]);
}
