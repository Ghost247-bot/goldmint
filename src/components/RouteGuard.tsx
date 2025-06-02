import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAdmin = false }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading } = useAuth();
  const { admin, isAuthenticated: isAdminAuthenticated, isLoading: adminLoading } = useAdminAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for authentication state to be determined
    if (userLoading || adminLoading) return;

    const checkAuth = async () => {
      try {
        if (requireAdmin) {
          if (!isAdminAuthenticated) {
            router.push('/login');
            return;
          }
        } else {
          if (!isAuthenticated) {
            router.push('/login');
            return;
          }
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [isAuthenticated, isAdminAuthenticated, userLoading, adminLoading, requireAdmin, router]);

  // Show loading state while checking authentication
  if (userLoading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authorized, don't render children
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}; 