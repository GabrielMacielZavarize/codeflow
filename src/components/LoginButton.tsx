import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { signInWithGoogle, onAuthStateChange } from '@/lib/firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export function LoginButton() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { currentUser } = useAuth();

    useEffect(() => {
        console.log('Configurando listener de mudança de estado de autenticação...');
        const unsubscribe = onAuthStateChange((user) => {
            console.log('Estado de autenticação alterado:', user ? 'Usuário logado' : 'Usuário deslogado');
            if (user) {
                console.log('Detalhes do usuário:', {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                });
                navigate('/dashboard');
            }
        });

        return () => {
            console.log('Removendo listener de autenticação...');
            unsubscribe();
        };
    }, [navigate]);

    const handleLogin = async () => {
        console.log('Iniciando processo de login...');
        try {
            setIsLoading(true);
            console.log('Chamando função de login com Google...');
            const user = await signInWithGoogle();
            if (user) {
                console.log('Login realizado com sucesso, redirecionando...');
                toast.success(t('login.success'));
            }
        } catch (error: any) {
            console.error('Erro detalhado no componente de login:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });

            // Exibe a mensagem de erro de forma mais amigável
            toast.error(error.message || t('login.error'), {
                duration: 5000,
                action: {
                    label: 'Tentar novamente',
                    onClick: () => {
                        console.log('Tentando login novamente...');
                        handleLogin();
                    }
                }
            });
        } finally {
            setIsLoading(false);
            console.log('Processo de login finalizado');
        }
    };

    return (
        <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            variant="default"
        >
            {isLoading ? t('login.loading') : t('login.button')}
        </Button>
    );
} 