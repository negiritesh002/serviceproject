import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, token } = useSelector(state => state.auth);
  const location = useLocation();

  if (!token && !isAuthenticated) {
    const loginPath = role === 'vendor' ? '/vendor/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (isAuthenticated && role && userRole !== role) {
    const dashboardPath = userRole === 'customer' ? '/customer' : '/vendor/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;