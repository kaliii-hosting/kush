import { useState } from 'react';
import AdminLogin from './AdminLogin';

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return children;
};

export default AdminProtectedRoute;