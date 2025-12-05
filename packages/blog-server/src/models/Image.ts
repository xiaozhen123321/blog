export interface Image {
  id: number;
  filename: string;
  original_name: string;
  data: Buffer;
  mime_type: string;
  size: number;
  created_at: Date;
}

export interface ImageResponse {
  id: number;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  created_at: string;
}
