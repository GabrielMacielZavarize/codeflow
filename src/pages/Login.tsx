import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Função para traduzir mensagens de erro do Firebase
  const getErrorMessage = (error: any) => {
    const errorCode = error?.code;
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'O e-mail informado é inválido. Por favor, verifique e tente novamente.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada. Entre em contato com o suporte.';
      case 'auth/user-not-found':
        return 'Não encontramos uma conta com este e-mail. Verifique o e-mail ou crie uma nova conta.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Verifique sua senha e tente novamente.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas de login. Por favor, aguarde alguns minutos ou redefina sua senha.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      case 'auth/popup-closed-by-user':
        return 'Login com Google cancelado. Tente novamente.';
      case 'auth/cancelled-popup-request':
        return 'Login com Google cancelado. Tente novamente.';
      case 'auth/popup-blocked':
        return 'O popup de login foi bloqueado. Verifique as configurações do seu navegador.';
      case 'auth/account-exists-with-different-credential':
        return 'Já existe uma conta com este e-mail usando outro método de login.';
      default:
        return 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
    }
  };

  // Função para mostrar toast de erro
  const showErrorToast = (error: any) => {
    toast.error('Erro ao fazer login', {
      description: getErrorMessage(error),
      duration: 5000,
      action: {
        label: 'Entendi',
        onClick: () => toast.dismiss()
      }
    });
  };

  // Função para mostrar toast de sucesso
  const showSuccessToast = (message: string) => {
    toast.success('Sucesso!', {
      description: message,
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-auto">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex flex-col">
        <div className="w-full p-2 sm:p-4">
          <LoginHeader />
        </div>

        <div className="flex-1 flex items-start justify-center pt-4">
          <div className="w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-8 items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden xl:block space-y-3"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Bem-vindo de volta!
                  </h2>
                  <p className="text-sm sm:text-base xl:text-lg 2xl:text-xl text-gray-600 dark:text-gray-300">
                    Acesse sua conta para gerenciar seus projetos e colaborar com sua equipe.
                  </p>
                  <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-300">Gerencie seus projetos</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-300">Colabore com sua equipe</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg text-gray-600 dark:text-gray-300">Acompanhe o progresso</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full flex justify-center xl:justify-end"
              >
                <Card className="w-full max-w-md sm:max-w-lg dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="text-center space-y-2">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CardTitle className="dark:text-white text-2xl sm:text-3xl">Entrar</CardTitle>
                      <CardDescription className="dark:text-gray-300 text-base sm:text-lg">
                        Acesse sua conta para continuar
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <LoginForm onError={showErrorToast} onSuccess={showSuccessToast} />
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
                    >
                      Não tem uma conta?{' '}
                      <Link to="/register" className="text-primary hover:underline dark:text-blue-500 transition-colors">
                        Criar conta
                      </Link>
                    </motion.p>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
