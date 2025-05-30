import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { registerWithEmailAndPassword, loginWithGoogle } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

interface PasswordRequirement {
    text: string;
    regex: RegExp;
    met: boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    { text: 'Pelo menos 8 caracteres', regex: /.{8,}/, met: false },
    { text: 'Pelo menos uma letra maiúscula', regex: /[A-Z]/, met: false },
    { text: 'Pelo menos uma letra minúscula', regex: /[a-z]/, met: false },
    { text: 'Pelo menos um número', regex: /[0-9]/, met: false },
    { text: 'Pelo menos um caractere especial', regex: /[!@#$%^&*(),.?":{}|<>]/, met: false }
];

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const updatedRequirements = passwordRequirements.map(req => ({
            ...req,
            met: req.regex.test(password)
        }));

        const metRequirements = updatedRequirements.filter(req => req.met).length;
        const strength = (metRequirements / passwordRequirements.length) * 100;
        setPasswordStrength(strength);
        setShowPasswordRequirements(password.length > 0 && strength < 100);
    }, [password]);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string) => {
        return name.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            toast.error('Por favor, preencha todos os campos');
            return;
        }

        if (!validateName(name)) {
            toast.error('Nome inválido. Use apenas letras e espaços, com no mínimo 3 caracteres');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email inválido');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (passwordStrength < 100) {
            toast.error('A senha não atende a todos os requisitos de segurança');
            return;
        }

        if (!acceptTerms || !acceptPrivacy) {
            toast.error('Você precisa aceitar os termos de uso e a política de privacidade');
            return;
        }

        setLoading(true);

        try {
            const { user, error } = await registerWithEmailAndPassword(name, email, password);

            if (user) {
                toast.success('Cadastro realizado com sucesso!');
                navigate('/dashboard', { replace: true });
            } else {
                toast.error(error || 'Erro ao realizar cadastro');
            }
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Este email já está em uso');
            } else if (error.code === 'auth/weak-password') {
                toast.error('A senha é muito fraca');
            } else {
                toast.error('Erro ao realizar cadastro');
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
                toast.success('Login realizado com sucesso!');
                navigate('/dashboard');
            } else {
                toast.error(error || 'Erro ao fazer login com Google');
            }
        } catch (error: any) {
            toast.error('Erro ao fazer login com Google');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleTermsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open('/terms', '_blank');
    };

    const handlePrivacyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.open('/privacy', '_blank');
    };

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    onClick={handleGoogleLogin}
                    className="w-full mb-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                    disabled={googleLoading}
                >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <div className="relative my-4">
                    <Separator className="dark:bg-gray-600" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                            ou
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.form
                onSubmit={handleRegister}
                className="space-y-4"
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
                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-2">
                    <Label htmlFor="name" className="dark:text-gray-200">Nome Completo</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                        placeholder="Digite seu nome completo"
                    />
                </motion.div>

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                        placeholder="Digite seu email"
                    />
                </motion.div>

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-2">
                    <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50 pr-10"
                            placeholder="Digite sua senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showPasswordRequirements && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 space-y-2 overflow-hidden"
                            >
                                <Progress
                                    value={passwordStrength}
                                    className={`h-2 ${passwordStrength === 100 ? 'bg-green-200 dark:bg-green-900/30' : 'bg-red-200 dark:bg-red-900/30'}`}
                                />
                                <div className={`text-sm ${passwordStrength === 100 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                    Força da senha: {passwordStrength}%
                                </div>
                                <ul className="space-y-1">
                                    {passwordRequirements.map((req, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center text-sm"
                                        >
                                            {req.met ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 mr-2" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-2" />
                                            )}
                                            <span className={req.met ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                                                {req.text}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-2">
                    <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirmar Senha</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-primary/50 pr-10"
                            placeholder="Confirme sua senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                    className="space-y-4 pt-2"
                >
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Aceito os{' '}
                                <button
                                    onClick={handleTermsClick}
                                    className="text-primary hover:underline focus:outline-none"
                                >
                                    Termos de Uso
                                </button>
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="privacy"
                            checked={acceptPrivacy}
                            onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="privacy"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Aceito a{' '}
                                <button
                                    onClick={handlePrivacyClick}
                                    className="text-primary hover:underline focus:outline-none"
                                >
                                    Política de Privacidade
                                </button>
                            </Label>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                        disabled={loading || passwordStrength < 100 || !acceptTerms || !acceptPrivacy}
                    >
                        {loading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                </motion.div>
            </motion.form>
        </div>
    );
};

export default RegisterForm; 