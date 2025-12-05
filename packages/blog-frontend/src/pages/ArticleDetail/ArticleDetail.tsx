import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Spin, Result } from 'antd';
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import { getImageUrl, formatDate } from '../../utils/helpers';
import styles from './ArticleDetail.module.css';

export const ArticleDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articleStore } = useStores();

  useEffect(() => {
    if (id) {
      articleStore.fetchArticleById(Number(id));
    }
  }, [id, articleStore]);

  if (articleStore.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (articleStore.error || !articleStore.currentArticle) {
    return (
      <Result
        status="404"
        title="文章不存在"
        subTitle="抱歉，您访问的文章不存在或已被删除"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    );
  }

  const article = articleStore.currentArticle;

  return (
    <div className={styles.article}>
      <div className={styles.header}>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Tag color="blue">{article.category_name}</Tag>
          </span>
          <span className={styles.metaItem}>
            <UserOutlined /> {article.author_name}
          </span>
          <span className={styles.metaItem}>
            <CalendarOutlined /> {formatDate(article.created_at)}
          </span>
          <span className={styles.metaItem}>
            <EyeOutlined /> {article.views} 次浏览
          </span>
        </div>
      </div>

      {article.cover_image_id && (
        <img
          src={getImageUrl(article.cover_image_id)}
          alt={article.title}
          className={styles.cover}
        />
      )}

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />

      <div className={styles.backButton}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
    </div>
  );
});
