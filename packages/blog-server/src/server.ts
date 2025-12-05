import { createApp } from './app';
import { env } from './config/env';
import { testConnection } from './config/database';

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // 创建 Express 应用
    const app = createApp();

    // 启动服务器
    app.listen(env.SERVER_PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${env.SERVER_PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🗄️  Database: ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 运行服务器
startServer();
