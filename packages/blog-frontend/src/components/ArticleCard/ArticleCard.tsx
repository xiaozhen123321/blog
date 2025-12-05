import React from 'react';
import { Card, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Article } from '../../api/articles';
import { getImageUrl, formatDate } from '../../utils/helpers';
import styles from './ArticleCard.module.css';

interface Props {
  article: Article;
}

export const ArticleCard: React.FC<Props> = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <img
          alt={article.title}
          src={getImageUrl(article.cover_image_id)}
          className={styles.cover}
        />
      }
      onClick={handleClick}
    >
      <Card.Meta
        title={article.title}
        description={
          <>
            <p className={styles.summary}>{article.summary || '暂无摘要'}</p>
            <div className={styles.meta}>
              <Tag color="blue">{article.category_name}</Tag>
              <span className={styles.date}>{formatDate(article.created_at)}</span>
            </div>
          </>
        }
      />
    </Card>
  );
};
