# 博客系统 Blog System

一个基于 Nx Monorepo 的全栈博客系统，支持文章发布、分类管理、草稿功能和图片存储。

## ✨ 特性

- 🏗️ **Monorepo 架构** - 使用 Nx 22.1 管理多个 package
- 🖼️ **图片 BLOB 存储** - 图片存储在 MySQL 数据库中
- 📝 **草稿功能** - 支持草稿和发布状态
- 🔐 **JWT 认证** - 基于 JWT 的身份验证系统
- 📦 **Docker 容器化** - MySQL 8.0 使用 Docker Compose 管理
- 🎨 **TypeScript 严格模式** - 全项目使用 TypeScript strict 模式

## 📦 项目结构

```
blog/
├── packages/
│   ├── blog-frontend/     # 博客前台（React + Ant Design）✅ 已完成
│   ├── blog-admin/        # 后台管理（React + Ant Design）✅ 已完成
│   └── blog-server/       # Node.js 后端服务 ✅ 已完成
├── docker-compose.yml     # MySQL 容器配置
├── .env                   # 环境变量
└── claude.md             # 完整项目详情文档
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Docker 和 Docker Compose
- npm 或 yarn

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
# 启动 MySQL 容器（首次启动会自动初始化数据库）
docker compose up -d

# 等待数据库初始化完成（约 30 秒）
docker logs -f blog_mysql
```

### 3. 创建管理员账号

⚠️ **重要**：首次部署需要创建管理员账号

#### 方法一：使用脚本创建（推荐）

```bash
# 1. 在 .env 文件中设置管理员信息
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=your_email@example.com

# 2. 运行创建脚本
cd packages/blog-server
npm run create-admin
cd ../..
```

#### 方法二：手动配置数据库种子文件

详见 [ADMIN_SETUP.md](ADMIN_SETUP.md)

### 4. 启动所有服务

```bash
# 终端 1: 启动后端服务
cd packages/blog-server
npm run dev

# 终端 2: 启动前端（新终端窗口）
cd packages/blog-frontend
npm run dev

# 终端 3: 启动后台管理（新终端窗口）
cd packages/blog-admin
npm run dev
```

现在可以访问：
- 前端：`http://localhost:3000`
- 后台管理：`http://localhost:3002`
- 后端 API：`http://localhost:3001`

### 4. 测试 API

访问健康检查端点：
```bash
curl http://localhost:3001/api/health
```

测试登录（使用你配置的管理员账号）：
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

## 🔑 管理员账号设置

管理员账号需要在部署时通过环境变量或初始化脚本设置。详见 `.env.example` 和 `packages/blog-server/database/seed.sql.example`。

⚠️ **切勿在代码仓库中提交明文密码！**

## 📚 技术栈

### 后端 (blog-server) ✅ 已完成

- Node.js + TypeScript 5.9
- Express 4.21
- MySQL 8.0 (Docker)
- JWT (jsonwebtoken 9.0)
- bcrypt 5.1
- Multer 1.4（文件上传）
- CORS 2.8

### 前端 (blog-frontend) ✅ 已完成

- React 18.3 + TypeScript
- Rsbuild 1.1
- Ant Design 5.22
- MobX 6.13
- React Router 6.27
- ky 1.7

### 后台管理 (blog-admin) ✅ 已完成

- 同前端技术栈
- JWT 认证系统
- 登录/登出功能

## 📖 API 文档

详细的 API 文档请查看 [claude.md](claude.md) 文件。

### 主要端点

- **认证**: `/api/auth/login`, `/api/auth/verify`
- **分类**: `/api/categories` (GET, POST, PUT, DELETE)
- **图片**: `/api/images` (上传、获取、删除)
- **文章**: `/api/articles` (CRUD + 发布)
- **用户**: `/api/users` (GET, POST)

## 🗄️ 数据库

数据库包含 4 张表：

1. **images** - 图片 BLOB 存储
2. **categories** - 文章分类
3. **admin_users** - 管理员用户
4. **articles** - 文章（支持草稿和发布状态）

详细表结构请查看 [packages/blog-server/database/init.sql](packages/blog-server/database/init.sql)。

## 🔧 环境变量

复制 `.env.example` 为 `.env` 并根据需要修改：

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

## 📝 使用说明

### 前端访问（http://localhost:3000）

- **首页**: 查看已发布的文章列表
- **分类筛选**: 点击分类标签筛选文章
- **文章详情**: 点击文章卡片查看完整内容
- **搜索**: 搜索文章标题或摘要

### 后台管理（http://localhost:3002）

1. **登录**: 使用默认账号 `admin / admin123`
2. **管理**: 通过 API 管理文章、分类和用户
3. **API 端点**:
   - 文章: `POST /api/articles`
   - 分类: `POST /api/categories`
   - 图片: `POST /api/images/upload`
   - 用户: `POST /api/users`

**提示**: 当前后台提供了登录界面和 Dashboard，文章的创建、编辑可以通过 API 工具（如 Postman）进行。

## 🐛 故障排查

### MySQL 连接失败

1. 检查 Docker 容器是否运行：`docker ps`
2. 检查 .env 中的数据库配置
3. 等待数据库初始化完成（首次启动需 30 秒）
4. 查看容器日志：`docker logs blog_mysql`

### JWT 认证失败

1. 确认 JWT_SECRET 配置正确
2. 检查 token 是否包含在 Authorization header
3. 确认 token 未过期

## 📄 License

MIT

---

**完整项目文档**: 请查看 [claude.md](claude.md)
