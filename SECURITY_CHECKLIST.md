# 部署前安全检查清单

在将代码提交到 Git 仓库或部署到生产环境之前，请完成以下安全检查：

## ✅ 必做检查项

### 1. 环境变量检查

- [ ] 已创建 `.env` 文件（从 `.env.example` 复制）
- [ ] 已修改 `JWT_SECRET` 为强密钥（至少 32 个字符）
- [ ] 已设置数据库密码（不使用默认值）
- [ ] 已配置管理员账号信息
- [ ] `.env` 文件在 `.gitignore` 中（已配置）

### 2. 密码安全检查

- [ ] 管理员密码强度足够（至少 12 个字符，包含大小写、数字、特殊字符）
- [ ] 没有在代码中硬编码任何密码
- [ ] `seed.sql` 文件在 `.gitignore` 中（已配置）
- [ ] 没有在前端显示默认账号密码提示（已移除）

### 3. 文件提交检查

运行以下命令确认不会提交敏感文件：

```bash
# 检查将要提交的文件
git status

# 确保以下文件不在提交列表中：
# - .env
# - packages/blog-server/database/seed.sql
# - 任何包含密码的文件
```

### 4. 代码审查

搜索代码中是否有硬编码的密码：

```bash
# 搜索可能的明文密码
grep -r "admin123" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "password.*=" . --exclude-dir=node_modules --exclude-dir=.git | grep -v "password:" | grep -v "// password"
```

如果发现任何硬编码密码，立即删除并使用环境变量替代。

### 5. Git 历史检查

如果之前误提交了敏感信息：

```bash
# 查看 git 历史中是否有敏感文件
git log --all --full-history -- .env
git log --all --full-history -- packages/blog-server/database/seed.sql

# 如果发现历史提交包含敏感信息，需要清理 git 历史
# 警告：这会改变 git 历史，谨慎操作
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

## 🔒 生产环境额外检查

### 6. 数据库安全

- [ ] MySQL root 密码已修改
- [ ] 数据库仅允许来自应用服务器的连接
- [ ] 启用 SSL/TLS 连接
- [ ] 定期备份数据库

### 7. 服务器配置

- [ ] `NODE_ENV=production`
- [ ] 已配置防火墙规则
- [ ] 启用 HTTPS（使用 Let's Encrypt 或其他证书）
- [ ] 设置 CORS 白名单（不使用 `*`）
- [ ] 启用 rate limiting

### 8. JWT 安全

- [ ] `JWT_SECRET` 使用强随机字符串（生产环境与开发环境不同）
- [ ] JWT 过期时间合理（不要太长）
- [ ] 考虑实现 refresh token 机制

### 9. 文件上传安全

- [ ] 限制文件大小（已配置 5MB）
- [ ] 限制文件类型（已配置）
- [ ] 实施病毒扫描（可选）
- [ ] 考虑使用专门的对象存储服务（AWS S3、阿里云 OSS 等）

### 10. 监控和日志

- [ ] 配置日志记录
- [ ] 设置错误监控（如 Sentry）
- [ ] 记录登录尝试和失败
- [ ] 设置异常告警

## 📝 部署后验证

### 11. 功能测试

- [ ] 测试管理员登录
- [ ] 测试 JWT 认证
- [ ] 测试 API 端点
- [ ] 测试文件上传
- [ ] 测试前端和后台访问

### 12. 安全测试

- [ ] 使用不正确的密码测试登录（应该失败）
- [ ] 测试未授权访问受保护的 API（应该返回 401）
- [ ] 测试 CORS 配置（只允许配置的域名）
- [ ] 测试文件上传限制（大文件、错误类型应该被拒绝）

## 🚨 如果发现敏感信息泄露

1. **立即撤销受影响的凭证**
   - 修改数据库密码
   - 修改 JWT_SECRET
   - 修改管理员密码

2. **清理 Git 历史**
   - 使用 `git filter-branch` 或 `BFG Repo-Cleaner`
   - 通知所有协作者重新 clone 仓库

3. **审查访问日志**
   - 检查是否有未授权访问
   - 检查异常活动

4. **更新部署**
   - 使用新的凭证重新部署
   - 验证旧凭证已失效

## 📚 相关文档

- [ADMIN_SETUP.md](ADMIN_SETUP.md) - 管理员账号设置指南
- [.env.example](.env.example) - 环境变量配置模板
- [packages/blog-server/database/seed.sql.example](packages/blog-server/database/seed.sql.example) - 数据库种子模板

---

**记住**：安全是持续的过程，不是一次性的任务！定期审查和更新安全措施。
