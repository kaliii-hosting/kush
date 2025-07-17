import { Navigate } from 'react-router-dom';

const WholesaleProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('wholesaleAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/wholesale-login" replace />;
  }
  
  return children;
};

export default WholesaleProtectedRoute;