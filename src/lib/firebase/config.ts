import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Verifica se as variáveis de ambiente estão definidas
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
];

// Verifica se todas as variáveis de ambiente necessárias estão definidas
const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Variáveis de ambiente do Firebase faltando:', missingEnvVars);
    throw new Error('Configuração do Firebase incompleta. Verifique as variáveis de ambiente.');
}

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa o Firebase apenas se não houver uma instância existente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa o Auth
const auth = getAuth(app);

export { app, auth, db }; 