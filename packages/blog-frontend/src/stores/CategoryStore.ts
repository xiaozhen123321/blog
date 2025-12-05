import { makeAutoObservable, runInAction } from 'mobx';
import { getCategories, Category } from '../api/categories';

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
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to fetch categories';
        this.loading = false;
      });
    }
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }
}
