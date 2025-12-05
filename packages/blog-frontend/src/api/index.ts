import ky from 'ky';

// 从 window 对象读取运行时注入的 API URL
const API_BASE_URL = typeof window !== 'undefined'
  ? (window as any).__API_BASE_URL__ || '/api'
  : '/api';

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get'],
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
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
