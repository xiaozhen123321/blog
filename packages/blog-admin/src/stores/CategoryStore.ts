import { makeAutoObservable, runInAction } from 'mobx';
import { Category, getCategories } from '../api/categories';

export class CategoryStore {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCategories() {
    this.loading = true;
    this.error = null;
    try {
      const response = await getCategories();

      runInAction(() => {
        this.categories = response.data;
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch categories';
        this.loading = false;
      });
      throw error;
    }
  }

  clearError() {
    this.error = null;
  }
}
