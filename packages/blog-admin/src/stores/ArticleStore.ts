import { makeAutoObservable, runInAction } from 'mobx';
import {
  Article,
  ArticlesResponse,
  CreateArticleDto,
  UpdateArticleDto,
  GetArticlesParams,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
} from '../api/articles';

export class ArticleStore {
  articles: Article[] = [];
  currentArticle: Article | null = null;
  loading = false;
  error: string | null = null;
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };
  filters: {
    status?: 'draft' | 'published' | '';
    category_id?: number;
    keyword?: string;
  } = {};

  constructor() {
    makeAutoObservable(this);
  }

  async fetchArticles(params?: GetArticlesParams) {
    this.loading = true;
    this.error = null;
    try {
      const mergedParams = { ...this.filters, ...params };
      const response = await getArticles(mergedParams);

      runInAction(() => {
        this.articles = response.data.articles;
        this.pagination = response.data.pagination;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch articles';
        this.loading = false;
      });
      throw error;
    }
  }

  async fetchArticleById(id: number) {
    this.loading = true;
    this.error = null;
    try {
      const response = await getArticleById(id);

      runInAction(() => {
        this.currentArticle = response.data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch article';
        this.loading = false;
      });
      throw error;
    }
  }

  async createArticle(data: CreateArticleDto) {
    this.loading = true;
    this.error = null;
    try {
      const response = await createArticle(data);

      runInAction(() => {
        this.loading = false;
      });

      return response.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to create article';
        this.loading = false;
      });
      throw error;
    }
  }

  async updateArticle(id: number, data: UpdateArticleDto) {
    this.loading = true;
    this.error = null;
    try {
      const response = await updateArticle(id, data);

      runInAction(() => {
        this.loading = false;
      });

      return response.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to update article';
        this.loading = false;
      });
      throw error;
    }
  }

  async deleteArticle(id: number) {
    this.loading = true;
    this.error = null;
    try {
      await deleteArticle(id);

      runInAction(() => {
        this.articles = this.articles.filter((article) => article.id !== id);
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to delete article';
        this.loading = false;
      });
      throw error;
    }
  }

  async publishArticle(id: number) {
    this.loading = true;
    this.error = null;
    try {
      await publishArticle(id);

      runInAction(() => {
        const article = this.articles.find((a) => a.id === id);
        if (article) {
          article.status = 'published';
          article.published_at = new Date().toISOString();
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to publish article';
        this.loading = false;
      });
      throw error;
    }
  }

  setFilters(filters: Partial<ArticleStore['filters']>) {
    this.filters = { ...this.filters, ...filters };
  }

  clearFilters() {
    this.filters = {};
  }

  clearCurrentArticle() {
    this.currentArticle = null;
  }

  clearError() {
    this.error = null;
  }
}
