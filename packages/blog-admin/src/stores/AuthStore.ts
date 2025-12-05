import { makeAutoObservable, runInAction } from 'mobx';
import { apiClient, ApiResponse } from '../api';
import { storage } from '../utils/storage';

export class AuthStore {
  token: string | null = storage.getToken();
  user: any | null = null;
  isAuthenticated = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.verifyToken();
    }
  }

  async login(username: string, password: string) {
    this.loading = true;
    try {
      const response: ApiResponse<{ token: string; user: any }> = await apiClient
        .post('auth/login', { json: { username, password } })
        .json();
      
      runInAction(() => {
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        storage.setToken(this.token);
        this.loading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      throw error;
    }
  }

  async verifyToken() {
    try {
      const response: ApiResponse<{ user: any }> = await apiClient
        .post('auth/verify')
        .json();
      
      runInAction(() => {
        this.user = response.data.user;
        this.isAuthenticated = true;
      });
    } catch {
      this.logout();
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    storage.clearToken();
  }
}
