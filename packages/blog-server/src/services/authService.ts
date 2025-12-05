import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../config/database';
import { jwtConfig } from '../config/jwt';
import { User, UserResponse } from '../models/User';

// 登录
export async function login(username: string, password: string): Promise<{ token: string; user: UserResponse }> {
  const user = await queryOne<User>(
    'SELECT * FROM admin_users WHERE username = ?',
    [username]
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

// 验证 token 并获取用户信息
export async function getUserById(id: number): Promise<UserResponse | null> {
  const user = await queryOne<User>(
    'SELECT id, username, email FROM admin_users WHERE id = ?',
    [id]
  );

  return user ? {
    id: user.id,
    username: user.username,
    email: user.email,
  } : null;
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
