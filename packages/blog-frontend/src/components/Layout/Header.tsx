import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.navLinkActive : '';
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          我的博客
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
            首页
          </Link>
          <Link to="/search" className={`${styles.navLink} ${isActive('/search')}`}>
            搜索
          </Link>
        </nav>
      </div>
    </header>
  );
};
