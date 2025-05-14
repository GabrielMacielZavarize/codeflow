import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

export interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error(t.login.error);
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate, t]);

  // Show loader while checking auth status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.general.loading}</p>
        </div>
      </div>
    );
  }

  // If not loading and has user, render children
  return currentUser ? <>{children}</> : null;
};

export default PrivateRoute;
