import React from 'react';

export const Overview: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <h2>博客管理系统</h2>
      <p style={{ color: '#8c8c8c', marginTop: 16 }}>
        前端和后端已完成，可以通过 API 进行文章、分类、用户管理
      </p>
      <p style={{ color: '#8c8c8c' }}>
        现在你可以通过左侧菜单访问文章管理功能
      </p>
      <div style={{ marginTop: 32, color: '#1890ff' }}>
        <p>📝 文章管理：创建、编辑、发布文章</p>
        <p>🗂 分类管理：即将推出</p>
        <p>👤 用户管理：即将推出</p>
        <p>🖼 图片上传：在文章编辑器中可用</p>
      </div>
    </div>
  );
};
