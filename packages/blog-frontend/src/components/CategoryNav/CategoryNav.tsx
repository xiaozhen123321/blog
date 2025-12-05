import React, { useEffect } from 'react';
import { Tag } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStores } from '../../stores';
import styles from './CategoryNav.module.css';

export const CategoryNav: React.FC = observer(() => {
  const { categoryStore } = useStores();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get('category_id');

  useEffect(() => {
    if (categoryStore.categories.length === 0) {
      categoryStore.fetchCategories();
    }
  }, [categoryStore]);

  const handleCategoryClick = (categoryId?: number) => {
    if (categoryId) {
      navigate(`/?category_id=${categoryId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.categoryNav}>
      <div className={styles.title}>分类</div>
      <div className={styles.categories}>
        <Tag
          color={!currentCategoryId ? 'blue' : 'default'}
          onClick={() => handleCategoryClick()}
          className={styles.categoryTag}
        >
          全部 ({categoryStore.categories.reduce((sum, cat) => sum + cat.article_count, 0)})
        </Tag>
        {categoryStore.categories.map((category) => (
          <Tag
            key={category.id}
            color={currentCategoryId === String(category.id) ? 'blue' : 'default'}
            onClick={() => handleCategoryClick(category.id)}
            className={styles.categoryTag}
          >
            {category.name} ({category.article_count})
          </Tag>
        ))}
      </div>
    </div>
  );
});
