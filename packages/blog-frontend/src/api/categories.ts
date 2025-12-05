import { apiClient, ApiResponse } from './index';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  article_count: number;
  created_at: string;
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return await apiClient.get('categories').json();
}
