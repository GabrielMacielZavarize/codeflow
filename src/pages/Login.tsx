
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginWithEmailAndPassword, resetPassword, loginWithGoogle } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        description: t.login.error,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock login for demonstration
      // In a real application this should call the authentication service
      if (email === 'admin@admin.com' && password === '1234') {
        const mockUser = {
          uid: 'mock-user-123',
          email: email,
          displayName: 'Admin User',
        };
        
        // Store mock user in localStorage to persist login
        localStorage.setItem('mockCurrentUser', JSON.stringify(mockUser));
        
        toast({
          description: t.login.success
        });
        
        navigate('/dashboard', { replace: true });
      } else {
        toast({
          description: t.login.credentials,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        description: t.login.error,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { user, error } = await loginWithGoogle();
    setGoogleLoading(false);
    
    if (user) {
      toast({
        description: t.login.success
      });
      // Navigate without page reload
      navigate('/dashboard', { replace: true });
    } else {
      toast({
        description: error || t.login.error,
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        description: t.resetPassword.error,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const { success, error } = await resetPassword(email);
    setLoading(false);
    
    if (success) {
      toast({
        description: t.resetPassword.success
      });
      setResetMode(false);
    } else {
      toast({
        description: error || t.resetPassword.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-foreground">CodeFlow Solutions</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t.login.description}</p>
        </div>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{resetMode ? t.resetPassword.title : t.login.title}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {resetMode 
                ? t.resetPassword.description
                : t.login.description
              }
            </CardDescription>
            {!resetMode && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t.login.fixedCredentials}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!resetMode && (
              <Button 
                onClick={handleGoogleLogin} 
                className="w-full mb-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={googleLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" 
                  fill={googleLoading ? "#aaa" : "#4285F4"}/>
                </svg>
                {googleLoading ? t.login.processing : t.login.googleButton}
              </Button>
            )}
            
            {!resetMode && (
              <div className="relative my-4">
                <Separator className="dark:bg-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                    {t.login.or}
                  </span>
                </div>
              </div>
            )}
            
            <form onSubmit={resetMode ? handleResetPassword : handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">{t.login.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              {!resetMode && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="dark:text-gray-200">{t.login.password}</Label>
                    <button 
                      type="button" 
                      onClick={() => setResetMode(true)}
                      className="text-xs text-primary hover:underline dark:text-primary-foreground"
                    >
                      {t.login.forgotPassword}
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading 
                  ? t.login.processing
                  : resetMode 
                    ? t.resetPassword.submitButton
                    : t.login.submitButton
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            {resetMode ? (
              <button 
                onClick={() => setResetMode(false)} 
                className="text-sm text-primary hover:underline dark:text-primary-foreground"
              >
                {t.resetPassword.backToLogin}
              </button>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.login.noAccount}{' '}
                <Link to="/register" className="text-primary hover:underline dark:text-primary-foreground">
                  {t.login.register}
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
