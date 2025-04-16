import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole: 'user' | 'organizer';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, fetchUserDetails } = useAuth();

  useEffect(() => {
    if (user && !user.role) {
      fetchUserDetails();
    }
  }, [user, fetchUserDetails]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;