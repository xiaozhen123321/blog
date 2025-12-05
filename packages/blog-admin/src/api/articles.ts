import { apiClient, ApiResponse } from './index';

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  category_id: number;
  category_name?: string;
  cover_image_id: number | null;
  status: 'draft' | 'published';
  author_id: number;
  author_name?: string;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateArticleDto {
  title: string;
  content: string;
  summary?: string;
  category_id: number;
  cover_image_id?: number | null;
  status: 'draft' | 'published';
}

export interface UpdateArticleDto extends CreateArticleDto {}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  category_id?: number;
  status?: 'draft' | 'published' | '';
  keyword?: string;
}

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<ApiResponse<ArticlesResponse>> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', String(params.page));
  if (params.limit) searchParams.append('limit', String(params.limit));
  if (params.category_id) searchParams.append('category_id', String(params.category_id));
  if (params.status) searchParams.append('status', params.status);
  if (params.keyword) searchParams.append('keyword', params.keyword);

  return await apiClient.get(`articles?${searchParams.toString()}`).json();
}

export async function getArticleById(id: number): Promise<ApiResponse<Article>> {
  return await apiClient.get(`articles/${id}`).json();
}

export async function createArticle(
  data: CreateArticleDto
): Promise<ApiResponse<{ id: number }>> {
  return await apiClient.post('articles', { json: data }).json();
}

export async function updateArticle(
  id: number,
  data: UpdateArticleDto
): Promise<ApiResponse<{ id: number }>> {
  return await apiClient.put(`articles/${id}`, { json: data }).json();
}

export async function deleteArticle(id: number): Promise<ApiResponse<null>> {
  return await apiClient.delete(`articles/${id}`).json();
}

export async function publishArticle(id: number): Promise<ApiResponse<null>> {
  return await apiClient.post(`articles/${id}/publish`).json();
}
