import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { ArticleDetail } from './pages/ArticleDetail/ArticleDetail';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { StoreProvider } from './stores';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="article/:id" element={<ArticleDetail />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ConfigProvider>
  );
}

export default App;
