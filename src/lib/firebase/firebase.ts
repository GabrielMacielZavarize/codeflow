import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, query, where, orderBy, limit, getDocs, updateDoc, deleteDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { firebaseConfig } from './config';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Array para armazenar as funções de unsubscribe
let unsubscribeFunctions: (() => void)[] = [];

// Função para registrar um listener
export const registerListener = (unsubscribe: () => void) => {
    unsubscribeFunctions.push(unsubscribe);
};

// Função para limpar todos os listeners
export const clearAllListeners = () => {
    unsubscribeFunctions.forEach(unsubscribe => {
        try {
            unsubscribe();
        } catch (error) {
            console.error('Erro ao remover listener:', error);
        }
    });
    unsubscribeFunctions = [];
};

export const logoutUser = async () => {
    try {
        // Limpa todos os listeners primeiro
        clearAllListeners();

        // Aguarda um pequeno delay para garantir que os listeners foram removidos
        await new Promise(resolve => setTimeout(resolve, 100));

        // Limpa o estado local
        localStorage.removeItem('user');
        sessionStorage.clear();

        // Faz logout
        await signOut(auth);

        return true;
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

// Função para obter tarefas com listener
export const getTarefasWithListener = (callback: (tarefas: any[]) => void) => {
    const q = query(collection(db, 'tarefas'), orderBy('dataCriacao', 'desc'));
    const unsubscribe = onSnapshot(q,
        (snapshot) => {
            const tarefas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(tarefas);
        },
        (error) => {
            console.error('Erro ao obter tarefas:', error);
        }
    );

    // Registra o listener para limpeza posterior
    registerListener(unsubscribe);

    return unsubscribe;
};

// Função para obter membros com listener
export const getMembrosWithListener = (callback: (membros: any[]) => void) => {
    const q = query(collection(db, 'membros'), orderBy('nome'));
    const unsubscribe = onSnapshot(q,
        (snapshot) => {
            const membros = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(membros);
        },
        (error) => {
            console.error('Erro ao obter membros:', error);
        }
    );

    // Registra o listener para limpeza posterior
    registerListener(unsubscribe);

    return unsubscribe;
};

// Função para obter configurações com listener
export const getConfiguracoesWithListener = (callback: (config: any) => void) => {
    const unsubscribe = onSnapshot(doc(db, 'configuracoes', 'geral'),
        (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() });
            }
        },
        (error) => {
            console.error('Erro ao obter configurações:', error);
        }
    );

    // Registra o listener para limpeza posterior
    registerListener(unsubscribe);

    return unsubscribe;
}; 