import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath && currentPath !== '/login' && currentPath !== '/') {
        navigate(`/login?next=${encodeURIComponent(currentPath)}`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  if (isLoadingAuth) return fallback;
  if (!isAuthenticated) return unauthenticatedElement;
  return <Outlet />;
}
