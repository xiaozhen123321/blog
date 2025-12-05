import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: '/api',
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
