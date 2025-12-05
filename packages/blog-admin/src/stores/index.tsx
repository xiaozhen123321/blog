import React, { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore';
import { ArticleStore } from './ArticleStore';
import { CategoryStore } from './CategoryStore';

class RootStore {
  authStore: AuthStore;
  articleStore: ArticleStore;
  categoryStore: CategoryStore;

  constructor() {
    this.authStore = new AuthStore();
    this.articleStore = new ArticleStore();
    this.categoryStore = new CategoryStore();
  }
}

const rootStore = new RootStore();
const StoreContext = createContext(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within StoreProvider');
  }
  return context;
};
