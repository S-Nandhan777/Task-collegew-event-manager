import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole: 'user' | 'organizer';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, fetchUserDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const updateRole = async () => {
      if (user && !user.role) {
        console.log('Fetching user details for role...');
        await fetchUserDetails();
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    updateRole();

    return () => {
      isMounted = false;
    };
  }, [user, fetchUserDetails]);

  if (isLoading) {
    console.log('ProtectedRoute is loading, showing placeholder...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('No user, redirecting to login, user:', user);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log('Role mismatch, redirecting to home, user role:', user.role);
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute allowing access, user role:', user.role);
  return <Outlet />;
};

export default ProtectedRoute;