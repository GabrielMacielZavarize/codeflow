import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmailAndPassword, resetPassword, loginWithGoogle } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormProps {
    onError: (error: any) => void;
    onSuccess: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onError, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const { user, error } = await loginWithEmailAndPassword(email, password);

            if (user) {
                onSuccess('Login realizado com sucesso!');
                navigate('/dashboard', { replace: true });
            } else {
                onError(error || 'Credenciais inválidas');
            }
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                onError('Usuário não encontrado');
            } else if (error.code === 'auth/wrong-password') {
                onError('Senha incorreta');
            } else {
                onError('Erro ao fazer login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);

        try {
            const { user, error } = await loginWithGoogle();

            if (user) {
                onSuccess('Login realizado com sucesso!');
                navigate('/dashboard', { replace: true });
            } else {
                onError(error || 'Erro ao fazer login com Google');
            }
        } catch (error) {
            onError('Erro ao fazer login com Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Por favor, informe seu email');
            return;
        }

        setLoading(true);

        try {
            const { success, error } = await resetPassword(email);

            if (success) {
                onSuccess('Email de recuperação enviado com sucesso!');
                setResetMode(false);
            } else {
                onError(error || 'Erro ao enviar email de recuperação');
            }
        } catch (error) {
            onError('Erro ao enviar email de recuperação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    onClick={handleGoogleLogin}
                    className="w-full mb-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                    disabled={googleLoading}
                >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                            fill={googleLoading ? "#aaa" : "#4285F4"} />
                    </svg>
                    {googleLoading ? 'Processando...' : 'Continuar com Google'}
                </Button>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="relative my-2">
                    <Separator className="dark:bg-gray-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                            ou
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.form
                onSubmit={resetMode ? handleResetPassword : handleLogin}
                className="space-y-2"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-1">
                    <Label htmlFor="email" className="dark:text-gray-200 text-sm">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50 h-8 text-sm"
                        placeholder="Digite seu email"
                    />
                </motion.div>

                {!resetMode && (
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-1">
                        <Label htmlFor="password" className="dark:text-gray-200 text-sm">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50 pr-10 h-8 text-sm"
                                placeholder="Digite sua senha"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </motion.div>
                )}

                {!resetMode && (
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Button
                            type="button"
                            variant="link"
                            className="px-0 dark:text-gray-400 hover:text-primary transition-colors text-xs h-6"
                            onClick={() => setResetMode(true)}
                        >
                            Esqueceu sua senha?
                        </Button>
                    </motion.div>
                )}

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105 h-8 text-sm"
                        disabled={loading || googleLoading}
                    >
                        {loading ? 'Processando...' : resetMode ? 'Recuperar Senha' : 'Entrar'}
                    </Button>
                </motion.div>

                {resetMode && (
                    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Button
                            type="button"
                            variant="link"
                            className="px-0 dark:text-gray-400 hover:text-primary transition-colors text-xs h-6"
                            onClick={() => setResetMode(false)}
                        >
                            Voltar para o login
                        </Button>
                    </motion.div>
                )}
            </motion.form>
        </div>
    );
};

export default LoginForm; 