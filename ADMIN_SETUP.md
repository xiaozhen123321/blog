# 管理员账号设置指南

⚠️ **安全警告**：切勿将明文密码提交到代码仓库！

## 方法一：使用初始化脚本（推荐）

### 1. 配置环境变量

复制 `.env.example` 为 `.env`，并设置以下环境变量：

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=your_email@example.com
```

### 2. 运行创建脚本

```bash
cd packages/blog-server
npm run create-admin
```

脚本会自动：
- 读取环境变量
- 使用 bcrypt 加密密码
- 将管理员账号插入数据库
- 如果账号已存在，则更新密码和邮箱

### 3. 验证

使用新创建的账号登录后台管理系统：http://localhost:3002

---

## 方法二：手动修改数据库种子文件

### 1. 生成密码 hash

使用 Node.js 生成 bcrypt hash：

```javascript
// 在 Node.js REPL 中运行
const bcrypt = require('bcrypt');
bcrypt.hash('your_password', 10, (err, hash) => {
  console.log(hash);
});
```

### 2. 编辑 seed.sql

复制 `seed.sql.example` 为 `seed.sql`：

```bash
cd packages/blog-server/database
cp seed.sql.example seed.sql
```

编辑 `seed.sql`，替换管理员信息：

```sql
INSERT INTO admin_users (username, password, email) VALUES
('your_username', 'your_bcrypt_hash', 'your_email@example.com')
ON DUPLICATE KEY UPDATE username=username;
```

### 3. 重新初始化数据库

```bash
# 重启 Docker 容器
docker compose down
docker compose up -d
```

---

## 生产环境最佳实践

1. **使用强密码**
   - 至少 12 个字符
   - 包含大小写字母、数字和特殊字符

2. **不要在代码中硬编码**
   - 使用环境变量
   - 使用密钥管理服务（如 AWS Secrets Manager）

3. **定期更换密码**
   - 设置密码过期策略
   - 记录登录日志

4. **使用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止中间人攻击

5. **限制登录尝试**
   - 实施 rate limiting
   - 记录失败的登录尝试

---

## 故障排查

### 问题：脚本运行失败

**解决方案**：
1. 确认 MySQL 容器正在运行：`docker ps`
2. 检查数据库连接配置是否正确
3. 确认 `.env` 文件存在且配置正确

### 问题：无法登录

**解决方案**：
1. 确认使用的是正确的用户名和密码
2. 检查数据库中是否有该用户：
   ```sql
   SELECT username, email FROM admin_users;
   ```
3. 尝试重新运行创建脚本更新密码

---

## 文件清单

- ✅ `.env.example` - 环境变量模板（可提交）
- ❌ `.env` - 实际环境变量（不可提交，已在 .gitignore）
- ✅ `seed.sql.example` - 数据库种子模板（可提交）
- ❌ `seed.sql` - 实际数据库种子（不可提交，已在 .gitignore）
- ✅ `scripts/create-admin.ts` - 创建管理员脚本（可提交）

---

**最后提醒**：永远不要将包含明文密码的文件提交到 Git 仓库！
