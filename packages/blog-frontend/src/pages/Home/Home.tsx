import React, { useEffect } from 'react';
import { Row, Col, Pagination, Spin, Empty } from 'antd';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import { useStores } from '../../stores';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import { CategoryNav } from '../../components/CategoryNav/CategoryNav';

export const Home: React.FC = observer(() => {
  const { articleStore } = useStores();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const category_id = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;

  useEffect(() => {
    articleStore.setPage(page);
    articleStore.fetchArticles({ page, category_id });
  }, [page, category_id, articleStore]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  if (articleStore.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div>
      <CategoryNav />

      {articleStore.articles.length === 0 ? (
        <Empty description="暂无文章" style={{ marginTop: 64 }} />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {articleStore.articles.map((article) => (
              <Col xs={24} sm={12} lg={8} key={article.id}>
                <ArticleCard article={article} />
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Pagination
              current={articleStore.pagination.page}
              total={articleStore.pagination.total}
              pageSize={articleStore.pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `共 ${total} 篇文章`}
            />
          </div>
        </>
      )}
    </div>
  );
});
