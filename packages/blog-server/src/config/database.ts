import mysql from 'mysql2/promise';
import { env } from './env';

// 创建连接池
export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  // 明确设置连接字符集参数
  charsetNumber: 255 // utf8mb4 的字符集编号
});

// 泛型查询函数
export async function query<T = any>(sql: string, values?: any[]): Promise<T[]> {
  // 在每次查询前设置字符集
  await pool.query('SET NAMES utf8mb4');
  const [rows] = await pool.query(sql, values || []);
  return rows as T[];
}

// 单行查询函数
export async function queryOne<T = any>(sql: string, values?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, values);
  return rows.length > 0 ? rows[0] : null;
}

// 测试数据库连接
export async function testConnection(): Promise<boolean> {
  try {
    await pool.execute('SELECT 1');
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
