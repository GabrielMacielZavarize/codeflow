import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    browserLocalPersistence,
    setPersistence
} from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
    authType: 'signInWithPopup',
    includeGrantedScopes: true
});

export const signInWithGoogle = async () => {
    try {
        console.log('Iniciando processo de login com Google...');

        // Configura persistência local
        console.log('Configurando persistência local...');
        await setPersistence(auth, browserLocalPersistence);
        console.log('Persistência local configurada com sucesso');

        // Tenta fazer login com popup
        console.log('Abrindo popup de autenticação...');
        const result = await signInWithPopup(auth, provider);
        console.log('Login realizado com sucesso:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
        });

        return result.user;
    } catch (error: any) {
        console.error('Erro detalhado no login com Google:', {
            code: error.code,
            message: error.message,
            name: error.name,
            stack: error.stack
        });

        // Tratamento específico para erros de popup
        if (error.code === 'auth/popup-blocked') {
            throw new Error('O popup de login foi bloqueado pelo navegador. Por favor, permita popups para este site e tente novamente.');
        } else if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('A janela de login foi fechada. Por favor, tente novamente e complete o processo de login.');
        } else if (error.code === 'auth/cancelled-popup-request') {
            throw new Error('A operação de login foi cancelada. Por favor, tente novamente.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Erro de conexão. Por favor, verifique sua conexão com a internet e tente novamente.');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Muitas tentativas de login. Por favor, aguarde alguns minutos e tente novamente.');
        } else if (error.code === 'auth/user-disabled') {
            throw new Error('Esta conta foi desativada. Por favor, entre em contato com o suporte.');
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            throw new Error('Já existe uma conta com este email usando outro método de login.');
        }

        // Erro genérico
        throw new Error(`Ocorreu um erro ao tentar fazer login: ${error.message}`);
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
}; 