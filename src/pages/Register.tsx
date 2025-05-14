import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmailAndPassword, loginWithGoogle } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error(t.register.error);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t.register.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await registerWithEmailAndPassword(name, email, password);

      if (user) {
        toast.success(t.register.success);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(error || t.register.error);
      }
    } catch (error) {
      toast.error(t.register.error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { user, error } = await loginWithGoogle();
    setGoogleLoading(false);

    if (user) {
      toast.success(t.login.success);
      navigate('/dashboard');
    } else {
      toast.error(error || t.login.error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container px-4 py-8 sm:px-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Voltar para Home
          </Link>
        </Button>

        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-foreground">CodeFlow Solutions</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{t.register.description}</p>
          </div>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="dark:text-white text-2xl">{t.register.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t.register.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGoogleLogin}
                className="w-full mb-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
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

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-200">{t.register.name}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-gray-200">{t.register.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-200">{t.register.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="dark:text-gray-200">{t.register.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.register.processing : t.register.submitButton}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.register.haveAccount}{' '}
                <Link to="/login" className="text-primary hover:underline dark:text-primary-foreground">
                  {t.register.login}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
