const TOKEN_KEY = 'blog_admin_token';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
