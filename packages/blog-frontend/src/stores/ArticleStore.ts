import { makeAutoObservable, runInAction } from 'mobx';
import { getArticles, getArticleById, Article, ArticlesResponse } from '../api/articles';

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

  constructor() {
    makeAutoObservable(this);
  }

  async fetchArticles(params: {
    page?: number;
    category_id?: number;
    keyword?: string;
  } = {}) {
    this.loading = true;
    this.error = null;

    try {
      const response = await getArticles({
        page: params.page || this.pagination.page,
        limit: this.pagination.limit,
        category_id: params.category_id,
        keyword: params.keyword,
      });

      runInAction(() => {
        this.articles = response.data.articles;
        this.pagination = response.data.pagination;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch articles';
        this.loading = false;
      });
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
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch article';
        this.loading = false;
      });
    }
  }

  setPage(page: number) {
    this.pagination.page = page;
  }
}
