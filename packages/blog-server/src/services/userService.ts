import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { User, UserResponse } from '../models/User';

// 获取所有用户
export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await query<User>('SELECT id, username, email, created_at FROM admin_users ORDER BY created_at DESC');
  return users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
  }));
}

// 创建用户
export async function createUser(username: string, password: string, email?: string): Promise<number> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result: any = await query(
    'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email || null]
  );

  return result.insertId;
}
