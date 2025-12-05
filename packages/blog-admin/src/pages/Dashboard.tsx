import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { DashboardOutlined, FileTextOutlined, FolderOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useStores } from '../stores';
import { Overview } from './Overview/Overview';
import { ArticleList } from './ArticleList/ArticleList';
import { ArticleForm } from './ArticleForm/ArticleForm';

const { Header, Sider, Content } = Layout;

export const Dashboard: React.FC = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const routes: Record<string, string> = {
      '1': '/',
      '2': '/articles',
      '3': '/categories',
      '4': '/users',
    };
    navigate(routes[key]);
  };

  const getSelectedKey = (): string => {
    if (location.pathname === '/' || location.pathname === '') return '1';
    if (location.pathname.startsWith('/articles')) return '2';
    if (location.pathname.startsWith('/categories')) return '3';
    if (location.pathname.startsWith('/users')) return '4';
    return '1';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <div style={{
          height: 64,
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          博客管理
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: '仪表盘',
            },
            {
              key: '2',
              icon: <FileTextOutlined />,
              label: '文章管理',
            },
            {
              key: '3',
              icon: <FolderOutlined />,
              label: '分类管理',
            },
            {
              key: '4',
              icon: <UserOutlined />,
              label: '用户管理',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>欢迎回来，{authStore.user?.username}</div>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '24px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/articles/new" element={<ArticleForm />} />
            <Route path="/articles/:id/edit" element={<ArticleForm />} />
            <Route path="/categories" element={<div>分类管理（待实现）</div>} />
            <Route path="/users" element={<div>用户管理（待实现）</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
});
