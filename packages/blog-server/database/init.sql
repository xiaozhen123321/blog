-- 博客系统数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS blog_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_system;

-- 1. images 表（图片 BLOB 存储）
CREATE TABLE IF NOT EXISTS images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL COMMENT '生成的文件名',
  original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  data LONGBLOB NOT NULL COMMENT '图片二进制数据',
  mime_type VARCHAR(100) NOT NULL COMMENT 'MIME 类型（如 image/jpeg）',
  size INT NOT NULL COMMENT '文件大小（字节）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图片存储表';

-- 2. categories 表（分类表）
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE COMMENT '分类名称',
  slug VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL 友好的分类标识',
  description TEXT COMMENT '分类描述',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';

-- 3. admin_users 表（后台管理员用户表）
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt 加密的密码',
  email VARCHAR(100) COMMENT '邮箱',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员用户表';

-- 4. articles 表（文章表，支持草稿和发布状态）
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL COMMENT '文章标题',
  content LONGTEXT NOT NULL COMMENT '文章内容（HTML 格式）',
  summary TEXT COMMENT '文章摘要',
  category_id INT NOT NULL COMMENT '所属分类 ID',
  cover_image_id INT COMMENT '封面图片 ID',
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft' COMMENT '文章状态',
  author_id INT NOT NULL COMMENT '作者 ID',
  views INT DEFAULT 0 COMMENT '浏览次数',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL COMMENT '发布时间',
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (cover_image_id) REFERENCES images(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE RESTRICT,
  INDEX idx_status (status),
  INDEX idx_category_id (category_id),
  INDEX idx_created_at (created_at),
  INDEX idx_published_at (published_at),
  FULLTEXT INDEX idx_fulltext_search (title, summary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 显示创建的表
SHOW TABLES;
