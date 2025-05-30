import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import RegisterHeader from '@/components/auth/RegisterHeader';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container px-4 py-8 sm:px-8 relative z-10">
        <div className="max-w-md mx-auto">
          <RegisterHeader />

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="dark:bg-gray-800/80 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="dark:text-white text-2xl">Criar Conta</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Preencha os dados abaixo para criar sua conta
              </CardDescription>
                </motion.div>
            </CardHeader>
              <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex justify-center">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-primary hover:underline dark:text-blue-500 transition-colors">
                    Fazer login
                </Link>
                </motion.p>
            </CardFooter>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
