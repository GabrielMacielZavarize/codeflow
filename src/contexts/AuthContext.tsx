import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, logoutUser } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  loading: true,
  logout: async () => {} 
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Check for mocked user in localStorage first
    const storedUser = localStorage.getItem('mockCurrentUser');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser) as User);
      setLoading(false);
    } else {
      // Otherwise try with Firebase
      const unsubscribe = onAuthChange((user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const logout = async () => {
    try {
      const { success, error } = await logoutUser();
      if (success) {
        setCurrentUser(null);
        localStorage.removeItem('mockCurrentUser'); // Remove stored user on logout
        
        toast({
          description: t.logout.success
        });
        
        // Navigate to home after logout without page reload
        navigate('/', { replace: true });
      } else {
        toast({
          description: error || t.logout.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        description: t.logout.error,
        variant: 'destructive'
      });
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
