import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';

async function initDatabase() {
  console.log('🚀 Starting database initialization...');

  const config = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    multipleStatements: true,
  };

  console.log(`📡 Connecting to ${config.host}:${config.port}...`);

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // 检查表是否已存在
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'articles'"
    );

    if ((tables as any[]).length > 0) {
      console.log('⚠️  Tables already exist, skipping initialization');
      return;
    }

    // 读取并执行 init.sql
    console.log('📝 Reading init.sql...');
    const initSqlPath = path.join(__dirname, '../database/init.sql');
    const initSql = await fs.readFile(initSqlPath, 'utf-8');

    console.log('⚙️  Executing init.sql...');
    await connection.query(initSql);
    console.log('✅ Tables created successfully');

    // 读取并执行 seed.sql
    console.log('📝 Reading seed.sql...');
    const seedSqlPath = path.join(__dirname, '../database/seed.sql');
    const seedSql = await fs.readFile(seedSqlPath, 'utf-8');

    console.log('🌱 Executing seed.sql...');
    await connection.query(seedSql);
    console.log('✅ Seed data inserted successfully');

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 仅当直接运行此脚本时执行
if (require.main === module) {
  initDatabase();
}

export { initDatabase };
