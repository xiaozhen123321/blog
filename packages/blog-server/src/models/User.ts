export interface User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string | null;
}
