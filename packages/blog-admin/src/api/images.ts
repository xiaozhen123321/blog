import { apiClient, ApiResponse } from './index';

export interface ImageUploadResponse {
  id: number;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export async function uploadImage(file: File): Promise<ApiResponse<ImageUploadResponse>> {
  const formData = new FormData();
  formData.append('image', file);

  return await apiClient
    .post('images/upload', {
      body: formData,
    })
    .json();
}

export async function deleteImage(id: number): Promise<ApiResponse<null>> {
  return await apiClient.delete(`images/${id}`).json();
}

export function getImageUrl(imageId: number | null): string {
  if (!imageId) {
    return 'https://via.placeholder.com/400x200?text=No+Image';
  }
  return `/api/images/${imageId}`;
}
