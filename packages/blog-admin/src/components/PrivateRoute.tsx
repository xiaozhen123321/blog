import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Spin } from 'antd';
import { useStores } from '../stores';

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const { authStore } = useStores();

  if (!authStore.token) {
    return <Navigate to="/login" replace />;
  }

  if (!authStore.isAuthenticated && authStore.token) {
    return (
      <div style={{ textAlign: 'center', padding: '200px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
});
