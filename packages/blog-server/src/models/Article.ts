export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  category_id: number;
  cover_image_id: number | null;
  status: 'draft' | 'published';
  author_id: number;
  views: number;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

export interface ArticleWithDetails {
  id: number;
  title: string;
  content: string;
  summary: string | null;
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

export interface ArticleListItem {
  id: number;
  title: string;
  summary: string | null;
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
