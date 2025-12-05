import React, { useState } from 'react';
import { Input, Row, Col, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';

const { Search } = Input;

export const SearchPage: React.FC = observer(() => {
  const { articleStore } = useStores();
  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setKeyword(value);
      setHasSearched(true);
      articleStore.fetchArticles({ keyword: value, page: 1 });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Search
          placeholder="搜索文章标题或摘要"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
        />
      </div>

      {articleStore.loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="搜索中..." />
        </div>
      ) : hasSearched ? (
        articleStore.articles.length === 0 ? (
          <Empty description={`未找到与 "${keyword}" 相关的文章`} style={{ marginTop: 64 }} />
        ) : (
          <>
            <div style={{ marginBottom: 16, color: '#8c8c8c' }}>
              找到 {articleStore.pagination.total} 篇与 "{keyword}" 相关的文章
            </div>
            <Row gutter={[24, 24]}>
              {articleStore.articles.map((article) => (
                <Col xs={24} sm={12} lg={8} key={article.id}>
                  <ArticleCard article={article} />
                </Col>
              ))}
            </Row>
          </>
        )
      ) : (
        <Empty description="请输入关键词搜索文章" style={{ marginTop: 64 }} />
      )}
    </div>
  );
});
