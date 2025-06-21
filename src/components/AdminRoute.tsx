import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import React from 'react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
}
