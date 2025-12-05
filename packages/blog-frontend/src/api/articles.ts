import { apiClient, ApiResponse } from './index';

export interface Article {
  id: number;
  title: string;
  summary: string | null;
  content?: string;
  category_id: number;
  category_name: string;
  cover_image_id: number | null;
  status: string;
  author_id: number;
  author_name: string;
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

export async function getArticles(params: {
  page?: number;
  limit?: number;
  category_id?: number;
  keyword?: string;
}): Promise<ApiResponse<ArticlesResponse>> {
  const searchParams = new URLSearchParams();
  searchParams.append('page', String(params.page || 1));
  searchParams.append('limit', String(params.limit || 10));
  searchParams.append('status', 'published'); // 前台只显示已发布文章

  if (params.category_id) {
    searchParams.append('category_id', String(params.category_id));
  }
  if (params.keyword) {
    searchParams.append('keyword', params.keyword);
  }

  return await apiClient.get(`articles?${searchParams.toString()}`).json();
}

export async function getArticleById(id: number): Promise<ApiResponse<Article>> {
  return await apiClient.get(`articles/${id}`).json();
}
