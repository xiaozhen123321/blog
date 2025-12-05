export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryWithCount extends Category {
  article_count: number;
}
