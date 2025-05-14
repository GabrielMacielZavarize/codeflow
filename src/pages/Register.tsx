
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error(t.general.error);
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t.general.error);
      return;
    }
    
    if (password.length < 6) {
      toast.error(t.general.error);
      return;
    }
    
    setLoading(true);
    const { user, error } = await registerWithEmailAndPassword(email, password);
    setLoading(false);
    
    if (user) {
      toast.success(t.register.success);
      navigate('/dashboard');
    } else {
      toast.error(error || t.register.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-foreground">CodeFlow Solutions</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t.register.description}</p>
        </div>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{t.register.title}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t.register.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">{t.login.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-200">{t.login.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.register.minChars}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="dark:text-gray-200">{t.register.confirmPassword}</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full dark:bg-primary dark:hover:bg-primary/90"
              >
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
  );
};

export default Register;
