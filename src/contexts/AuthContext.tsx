import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, logoutUser } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logout: async () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      const { success, error } = await logoutUser();
      if (success) {
        setCurrentUser(null);
        toast.success(t.logout.success);
        navigate('/', { replace: true });
      } else {
        toast.error(error || t.logout.error);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t.logout.error);
    }
  };

  const value = {
    currentUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
