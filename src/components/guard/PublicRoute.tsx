import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { PageLoader } from './PageLoader';

interface Props {
  children: React.ReactNode;
  redirect?: string;
}

export const PublicRoute: React.FC<Props> = ({ children, redirect = '/' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader/>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to={redirect} replace />;
};
