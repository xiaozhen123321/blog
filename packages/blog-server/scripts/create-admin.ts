/**
 * 创建管理员账号脚本
 * 使用方式：
 *   npm run create-admin
 *
 * 从环境变量读取：
 *   ADMIN_USERNAME - 管理员用户名
 *   ADMIN_PASSWORD - 管理员密码（明文，将自动加密）
 *   ADMIN_EMAIL - 管理员邮箱
 */

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// 加载环境变量
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../../.env') });

interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'blog_user',
  password: process.env.DB_PASSWORD || 'blog_password',
  database: process.env.DB_NAME || 'blog_system',
};

async function createAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;

  if (!username || !password || !email) {
    console.error('❌ 错误：请在 .env 文件中设置以下环境变量：');
    console.error('   - ADMIN_USERNAME');
    console.error('   - ADMIN_PASSWORD');
    console.error('   - ADMIN_EMAIL');
    process.exit(1);
  }

  let connection;

  try {
    console.log('🔄 连接数据库...');
    connection = await mysql.createConnection(dbConfig);

    // 检查用户是否已存在
    const [rows] = await connection.execute(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      console.log('⚠️  警告：用户已存在，正在更新密码和邮箱...');

      // 加密密码
      console.log('🔐 加密密码...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // 更新用户
      await connection.execute(
        'UPDATE admin_users SET password = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?',
        [hashedPassword, email, username]
      );

      console.log('✅ 管理员账号已更新！');
    } else {
      console.log('🔐 加密密码...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // 插入新用户
      await connection.execute(
        'INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email]
      );

      console.log('✅ 管理员账号创建成功！');
    }

    console.log('');
    console.log('📋 账号信息：');
    console.log(`   用户名: ${username}`);
    console.log(`   邮箱: ${email}`);
    console.log('');
    console.log('⚠️  请妥善保管密码，不要将密码提交到代码仓库！');

  } catch (error) {
    console.error('❌ 创建管理员账号失败：', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();
