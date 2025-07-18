import { useState } from 'react';
import WholesaleLogin from '../pages/WholesaleLogin';

const WholesaleProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <WholesaleLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return children;
};

export default WholesaleProtectedRoute;