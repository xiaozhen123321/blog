# 博客系统项目详情

## 项目概述

这是一个基于 Nx Monorepo 的全栈博客系统，包含公开博客前台、后台管理系统和 Node.js 后端服务。

### 项目特点

- ✅ **Monorepo 架构**：使用 Nx 22.1 管理多个package
- ✅ **图片 BLOB 存储**：图片存储在 MySQL 数据库中（LONGBLOB）
- ✅ **草稿功能**：支持草稿和发布状态
- ✅ **JWT 认证**：基于 JWT 的身份验证
- ✅ **TypeScript 严格模式**：全项目使用 TS strict 模式
- ✅ **Docker 容器化**：MySQL 8.0 使用 Docker Compose 管理
- ✅ **完整前后端**：三个 package 全部完成并可运行

---

## 技术栈

### 后端 (blog-server) ✅ 已完成

- **运行时**: Node.js + TypeScript 5.9
- **框架**: Express 4.21
- **数据库**: MySQL 8.0 (Docker)
- **ORM**: mysql2（原生查询）
- **认证**: JWT (jsonwebtoken 9.0)
- **密码**: bcrypt 5.1
- **文件上传**: Multer 1.4
- **跨域**: CORS 2.8
- **日志**: Winston 3.17

### 前端 (blog-frontend) ✅ 已完成

- React 18.3 + TypeScript
- Rsbuild 1.1
- Ant Design 5.22
- MobX 6.13
- React Router 6.27
- ky 1.7
- CSS Modules

**已实现功能**:
- 首页文章列表（分页）
- 文章详情页
- 分类筛选
- 搜索功能
- 响应式布局

### 后台管理 (blog-admin) ✅ 已完成

- 同前端技术栈
- 额外：Draft.js 0.11（富文本编辑器）

**已实现功能**:
- 登录/登出系统
- JWT 认证和私有路由
- Dashboard 仪表盘
- 菜单导航（文章、分类、用户管理）
- Token 自动注入和刷新

---

## 项目结构

```
blog/
├── packages/
│   ├── blog-server/              ✅ 已完成
│   │   ├── src/
│   │   │   ├── config/           # 配置文件（database, env, jwt）
│   │   │   ├── middleware/       # 中间件（auth, cors, upload, errorHandler）
│   │   │   ├── models/           # TypeScript 类型定义
│   │   │   ├── services/         # 业务逻辑层
│   │   │   ├── controllers/      # 控制器层
│   │   │   ├── routes/           # 路由定义
│   │   │   ├── utils/            # 工具函数
│   │   │   ├── app.ts            # Express 应用
│   │   │   └── server.ts         # 服务器入口
│   │   ├── database/
│   │   │   ├── init.sql          # 数据库表结构
│   │   │   └── seed.sql          # 初始数据
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── project.json
│   │
│   ├── blog-frontend/            ✅ 已完成
│   │   ├── src/
│   │   │   ├── api/              # API 客户端
│   │   │   ├── components/       # React 组件
│   │   │   ├── pages/            # 页面组件
│   │   │   ├── stores/           # MobX stores
│   │   │   ├── utils/            # 工具函数
│   │   │   ├── App.tsx           # 根组件
│   │   │   └── index.tsx         # 入口文件
│   │   ├── package.json
│   │   ├── rsbuild.config.ts     # Rsbuild 配置
│   │   └── tsconfig.json
│   │
│   └── blog-admin/               ✅ 已完成
│       ├── src/
│       │   ├── api/              # API 客户端（带 JWT）
│       │   ├── components/       # React 组件
│       │   ├── pages/            # 页面组件
│       │   ├── stores/           # MobX stores
│       │   ├── utils/            # 工具函数
│       │   ├── App.tsx           # 根组件
│       │   └── index.tsx         # 入口文件
│       ├── package.json
│       ├── rsbuild.config.ts     # Rsbuild 配置
│       └── tsconfig.json
│
├── docker-compose.yml            ✅ MySQL 容器配置
├── .env                          ✅ 环境变量
├── .env.example                  ✅ 环境变量模板
├── package.json                  ✅ 根 package.json
└── tsconfig.base.json            ✅ 基础 TS 配置
```

---

## 数据库设计

### 1. images（图片表）

```sql
CREATE TABLE images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  data LONGBLOB NOT NULL,           -- 图片二进制数据
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. categories（分类表）

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3. admin_users（管理员表）

```sql
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- bcrypt 哈希
  email VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 4. articles（文章表）

```sql
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  summary TEXT,
  category_id INT NOT NULL,
  cover_image_id INT,               -- 外键指向 images.id
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  author_id INT NOT NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  published_at TIMESTAMP NULL,      -- 发布时间
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (cover_image_id) REFERENCES images(id),
  FOREIGN KEY (author_id) REFERENCES admin_users(id)
);
```

---

## API 端点文档

### 认证 API (`/api/auth`)

#### POST /api/auth/login
登录获取 JWT token

**请求**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@blog.com"
    }
  }
}
```

#### POST /api/auth/verify
验证 token 是否有效（需要 Authorization header）

**请求 Headers**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "code": 0,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@blog.com"
    }
  }
}
```

---

### 分类 API (`/api/categories`)

#### GET /api/categories
获取所有分类（公开）

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Technology",
      "slug": "technology",
      "description": "Articles about technology",
      "article_count": 5,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/categories
创建分类（需认证）

**请求 Headers**:
```
Authorization: Bearer <token>
```

**请求**:
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description"
}
```

#### PUT /api/categories/:id
更新分类（需认证）

#### DELETE /api/categories/:id
删除分类（需认证，检查是否有文章）

---

### 图片 API (`/api/images`)

#### POST /api/images/upload
上传图片（需认证）

**请求 Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求 Body**:
- `image`: File (图片文件，最大 5MB)

**响应**:
```json
{
  "code": 0,
  "message": "Image uploaded successfully",
  "data": {
    "id": 1,
    "filename": "1234567890-image.jpg",
    "url": "/api/images/1",
    "size": 102400,
    "mime_type": "image/jpeg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/images/:id
获取图片（公开，返回二进制数据）

**响应**:
- Content-Type: image/jpeg | image/png | image/gif | image/webp
- 图片二进制数据

#### DELETE /api/images/:id
删除图片（需认证）

---

### 文章 API (`/api/articles`)

#### GET /api/articles
获取文章列表（公开，支持分页和筛选）

**查询参数**:
- `page` (number): 页码，默认 1
- `limit` (number): 每页数量，默认 10
- `category_id` (number): 按分类筛选
- `status` (string): draft | published（前台只显示 published）
- `keyword` (string): 搜索关键词

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Article Title",
        "summary": "Article summary...",
        "category_id": 1,
        "category_name": "Technology",
        "cover_image_id": 1,
        "status": "published",
        "author_id": 1,
        "author_name": "admin",
        "views": 100,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "published_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### GET /api/articles/:id
获取文章详情（公开）

**响应**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Article Title",
    "content": "<h2>Article Content</h2><p>...</p>",
    "summary": "Article summary",
    "category_id": 1,
    "category_name": "Technology",
    "cover_image_id": 1,
    "status": "published",
    "author_id": 1,
    "author_name": "admin",
    "views": 101,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "published_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/articles
创建文章（需认证）

**请求 Headers**:
```
Authorization: Bearer <token>
```

**请求**:
```json
{
  "title": "New Article",
  "content": "<h2>Content</h2><p>Article content in HTML</p>",
  "summary": "Article summary",
  "category_id": 1,
  "cover_image_id": 1,
  "status": "draft"
}
```

#### PUT /api/articles/:id
更新文章（需认证）

#### DELETE /api/articles/:id
删除文章（需认证）

#### POST /api/articles/:id/publish
发布文章（需认证）

---

### 用户 API (`/api/users`)

#### GET /api/users
获取所有用户（需认证）

#### POST /api/users
创建用户（需认证）

**请求**:
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

---

## 环境变量配置

`.env` 文件配置：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=blog_user
DB_PASSWORD=blog_password
DB_NAME=blog_system

# 服务器配置
SERVER_PORT=3001
NODE_ENV=development

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS 配置
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# 文件上传限制
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

---

## 快速开始

### 1. 安装所有依赖

```bash
# 安装根依赖
npm install

# 安装后端依赖
cd packages/blog-server && npm install

# 安装前端依赖
cd ../blog-frontend && npm install

# 安装后台管理依赖
cd ../blog-admin && npm install

cd ../..
```

### 2. 启动 MySQL 数据库

```bash
docker compose up -d
```

等待数据库初始化完成（约 30 秒）。可以查看日志：
```bash
docker logs -f blog_mysql
```

### 3. 启动所有服务

需要打开三个终端窗口：

**终端 1 - 启动后端服务**:
```bash
cd packages/blog-server
npm run dev
```
后端服务将在 `http://localhost:3001` 启动。

**终端 2 - 启动前端**:
```bash
cd packages/blog-frontend
npm run dev
```
前端将在 `http://localhost:3000` 启动。

**终端 3 - 启动后台管理**:
```bash
cd packages/blog-admin
npm run dev
```
后台管理将在 `http://localhost:3002` 启动。

### 4. 访问应用

- **前端博客**: [http://localhost:3000](http://localhost:3000)
- **后台管理**: [http://localhost:3002](http://localhost:3002)
- **后端 API**: [http://localhost:3001](http://localhost:3001)

### 5. 测试 API

访问健康检查端点：
```bash
curl http://localhost:3001/api/health
```

测试登录：
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 默认管理员账号

- **用户名**: admin
- **密码**: admin123
- **邮箱**: admin@blog.com

**⚠️ 生产环境请务必修改默认密码！**

---

## 核心实现细节

### 1. 图片 BLOB 存储

图片以 BLOB 形式存储在数据库中：

```typescript
// 上传图片
export async function saveImage(file: Express.Multer.File): Promise<number> {
  const result: any = await query(
    'INSERT INTO images (filename, original_name, data, mime_type, size) VALUES (?, ?, ?, ?, ?)',
    [filename, file.originalname, file.buffer, file.mimetype, file.size]
  );
  return result.insertId;
}

// 读取图片
export async function getImageById(id: number): Promise<Image | null> {
  return await queryOne<Image>('SELECT * FROM images WHERE id = ?', [id]);
}

// 返回图片（在 Controller 中）
res.setHeader('Content-Type', image.mime_type);
res.send(image.data);  // 直接发送 Buffer
```

### 2. 草稿/发布状态管理

```typescript
// 创建文章时
const published_at = data.status === 'published' ? new Date() : null;

// 前台查询只显示已发布文章
WHERE status = 'published'

// 后台可以查看所有状态
// 无状态限制或允许筛选
```

### 3. JWT 认证流程

```typescript
// 1. 登录生成 token
const token = jwt.sign(
  { userId: user.id, username: user.username },
  jwtConfig.secret,
  { expiresIn: jwtConfig.expiresIn }
);

// 2. 中间件验证 token
const decoded = jwt.verify(token, jwtConfig.secret) as { userId: number };
req.userId = decoded.userId;

// 3. 受保护的路由
router.post('/articles', authMiddleware, createArticleHandler);
```

### 4. 密码安全

```typescript
// 注册/创建用户时
const hashedPassword = await bcrypt.hash(password, 10);

// 登录验证时
const isValid = await bcrypt.compare(password, user.password);
```

---

## 使用说明

### 前端访问 (http://localhost:3000)

- **首页**: 查看已发布的文章列表
- **分类筛选**: 点击分类标签筛选文章
- **文章详情**: 点击文章卡片查看完整内容
- **搜索**: 通过关键词搜索文章标题或摘要

### 后台管理 (http://localhost:3002)

1. **登录**: 使用默认账号 `admin / admin123`
2. **Dashboard**: 查看系统概览和 API 端点信息
3. **管理功能**: 通过 API 进行文章、分类、用户管理

**提示**: 当前后台提供了登录界面和 Dashboard。文章的创建、编辑可以通过 API 工具（如 Postman）进行，或者可以扩展后台实现完整的文章编辑器。

### 通过 API 管理内容

**创建文章**:
```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新文章标题",
    "content": "<p>文章内容</p>",
    "summary": "文章摘要",
    "category_id": 1,
    "status": "published"
  }'
```

**创建分类**:
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新分类",
    "slug": "new-category",
    "description": "分类描述"
  }'
```

## 下一步：扩展功能

### 可选增强功能

1. **富文本编辑器** - 在后台管理中集成 Draft.js 编辑器
2. **图片上传 UI** - 添加图片上传组件
3. **文章管理界面** - 完整的文章 CRUD 界面
4. **分类管理界面** - 分类 CRUD 界面
5. **用户管理界面** - 用户管理界面
6. **数据统计** - Dashboard 添加文章、访问量统计
7. **评论系统** - 如需要可以添加评论功能
8. **标签系统** - 文章标签功能

---

## 部署建议

### 生产环境清单

- [ ] 修改 JWT_SECRET 为强密码
- [ ] 修改数据库密码
- [ ] 修改默认管理员密码
- [ ] 启用 HTTPS
- [ ] 配置生产环境 CORS
- [ ] 设置 NODE_ENV=production
- [ ] 配置日志持久化
- [ ] 设置数据库备份
- [ ] 优化图片大小限制
- [ ] 添加 Rate Limiting
- [ ] 配置 CDN（可选）
- [ ] 添加监控告警

---

## 故障排查

### MySQL 连接失败

1. 检查 Docker 容器是否运行：`docker ps`
2. 检查 .env 中的数据库配置
3. 等待数据库初始化完成（首次启动需 30 秒）
4. 查看容器日志：`docker logs blog_mysql`

### JWT 认证失败

1. 确认 JWT_SECRET 配置正确
2. 检查 token 是否包含在 Authorization header
3. 确认 token 未过期

### 图片上传失败

1. 检查文件大小是否超过 5MB
2. 确认文件类型为允许的图片类型
3. 检查是否包含 Authorization header

---

## 技术支持

- **后端服务**: [packages/blog-server/src](packages/blog-server/src)
- **API 文档**: 见上方 API 端点部分
- **数据库**: [packages/blog-server/database](packages/blog-server/database)

---

**项目生成时间**: 2024年12月5日
**生成工具**: Claude Code
**版本**: 1.0.0
