import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2024 我的博客. All rights reserved.</p>
      <p>Built with React + TypeScript + Ant Design</p>
    </footer>
  );
};
