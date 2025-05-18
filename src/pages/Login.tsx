import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginWithEmailAndPassword, resetPassword, loginWithGoogle } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Star } from 'lucide-react';

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

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t.login.error);
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await loginWithEmailAndPassword(email, password);

      if (user) {
        toast.success(t.login.success);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(error || t.login.credentials);
      }
    } catch (error) {
      toast.error(t.login.error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const { user, error } = await loginWithGoogle();

      if (user) {
        toast.success(t.login.success);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(error || t.login.error);
      }
    } catch (error) {
      toast.error(t.login.error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t.login.error);
      return;
    }

    setLoading(true);

    try {
      const { success, error } = await resetPassword(email);

      if (success) {
        toast.success(t.resetPassword.success);
        setResetMode(false);
      } else {
        toast.error(error || t.resetPassword.error);
      }
    } catch (error) {
      toast.error(t.resetPassword.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 py-8 sm:px-8">
        <Button variant="ghost" asChild className="mb-8 hover:scale-105 transition-all duration-300">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Voltar para Home
          </Link>
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                <Star className="w-4 h-4 mr-2" />
                Solução Open Source
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CodeFlow Solutions</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{t.login.description}</p>
          </div>

          <Card className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="dark:text-white text-2xl">{t.login.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t.login.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                className="w-full mb-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                disabled={googleLoading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill={googleLoading ? "#aaa" : "#4285F4"} />
                </svg>
                {googleLoading ? t.login.processing : t.login.googleButton}
              </Button>

              <div className="relative my-4">
                <Separator className="dark:bg-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                    {t.login.or}
                  </span>
                </div>
              </div>

              <form onSubmit={resetMode ? handleResetPassword : handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">{t.login.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {!resetMode && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="dark:text-gray-200">{t.login.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                )}

                {!resetMode && (
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 dark:text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setResetMode(true)}
                  >
                    {t.login.forgotPassword}
                  </Button>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  disabled={loading || googleLoading}
                >
                  {loading ? t.login.processing : resetMode ? t.resetPassword.submitButton : t.login.submitButton}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              {resetMode ? (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 dark:text-gray-400 hover:text-primary transition-colors"
                  onClick={() => setResetMode(false)}
                >
                  {t.resetPassword.backToLogin}
                </Button>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.login.noAccount}{' '}
                  <Link to="/register" className="text-primary hover:underline dark:text-primary-foreground transition-colors">
                    {t.login.register}
                  </Link>
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
