import PasswordLogin from '../PasswordLogin';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = ({ onSuccess }) => {
  const { signInAdmin } = useAdminAuth();

  const handleSuccess = () => {
    // Sign in admin Firebase account
    signInAdmin().then(() => {
      if (onSuccess) {
        onSuccess();
      }
    }).catch((err) => {
      console.error('Admin Firebase sign in failed:', err);
      // Still proceed even if Firebase fails
      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return <PasswordLogin type="admin" onSuccess={handleSuccess} />;
};

export default AdminLogin;