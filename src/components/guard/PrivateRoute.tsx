import { useAuth } from '@/providers';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from './PageLoader';

interface Props {
  children: React.ReactNode;
  authRedirect?: string;
}

export const PrivateRoute: React.FC<Props> = ({ children, authRedirect = '/auth' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader/>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={authRedirect} replace />;
};
