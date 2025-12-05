import ky from 'ky';
import { storage } from '../utils/storage';

// 从 window 对象读取运行时注入的 API URL
const API_BASE_URL = typeof window !== 'undefined'
  ? (window as any).__API_BASE_URL__ || '/api'
  : '/api';

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = storage.getToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          storage.clearToken();
          window.location.href = '/login';
        }
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Request failed');
        }
        return response;
      },
    ],
  },
});

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
