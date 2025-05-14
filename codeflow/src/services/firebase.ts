
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - O usuário precisará substituir por suas próprias chaves
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Mock user para desenvolvimento
const MOCK_USERS = [
  {
    email: 'admin@admin.com',
    password: '1234',
    uid: 'mock-admin-uid',
    role: 'admin',
    name: 'Administrador'
  }
];

// Configura o provider do Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Serviços de autenticação
export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Mock para desenvolvimento
    const mockUser = MOCK_USERS.find(user => user.email === email);
    if (mockUser) {
      return { user: null, error: "Este email já está sendo usado por outra conta." };
    }
    
    // Em modo de produção, usaria o Firebase
    // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Mock de usuário para desenvolvimento
    const mockNewUser = {
      uid: `mock-uid-${Date.now()}`,
      email,
      displayName: null,
      emailVerified: false,
      isAnonymous: false,
      providerData: [],
      metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
      phoneNumber: null,
      photoURL: null,
      refreshToken: '',
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve('mock-token'),
      getIdTokenResult: () => Promise.resolve({ token: 'mock-token', claims: {}, issuedAtTime: new Date().toISOString(), expirationTime: new Date().toISOString(), authTime: new Date().toISOString(), signInProvider: null, signInSecondFactor: null }),
      reload: () => Promise.resolve(),
      toJSON: () => ({})
    } as unknown as User;
    
    // Adicionar o novo usuário ao mock
    MOCK_USERS.push({ email, password, uid: mockNewUser.uid, role: 'user', name: 'Novo Usuário' });
    
    localStorage.setItem('mockCurrentUser', JSON.stringify(mockNewUser));
    
    return { user: mockNewUser, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Verificar apenas o usuário fixo admin@admin.com com senha 1234
    if (email === 'admin@admin.com' && password === '1234') {
      const mockUser = MOCK_USERS[0];
      
      const mockLoggedUser = {
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.name,
        emailVerified: true,
        isAnonymous: false,
        providerData: [],
        metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
        phoneNumber: null,
        photoURL: null,
        refreshToken: '',
        tenantId: null,
        delete: () => Promise.resolve(),
        getIdToken: () => Promise.resolve('mock-token'),
        getIdTokenResult: () => Promise.resolve({ token: 'mock-token', claims: {}, issuedAtTime: new Date().toISOString(), expirationTime: new Date().toISOString(), authTime: new Date().toISOString(), signInProvider: null, signInSecondFactor: null }),
        reload: () => Promise.resolve(),
        toJSON: () => ({})
      } as unknown as User;
      
      localStorage.setItem('mockCurrentUser', JSON.stringify({ ...mockLoggedUser, role: mockUser.role }));
      
      return { user: mockLoggedUser, error: null };
    } else {
      return { user: null, error: "Email ou senha incorretos" };
    }
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    // Mock para desenvolvimento
    const mockUser = MOCK_USERS[0]; // Admin por padrão ao fazer login com Google
    
    // Em modo de produção, usaria o Firebase
    // const result = await signInWithPopup(auth, googleProvider);
    
    // Mock de usuário para desenvolvimento
    const mockLoggedUser = {
      uid: mockUser.uid,
      email: mockUser.email,
      displayName: "Google User",
      emailVerified: true,
      isAnonymous: false,
      providerData: [{ providerId: 'google.com' }],
      metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
      phoneNumber: null,
      photoURL: "https://via.placeholder.com/150",
      refreshToken: '',
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve('mock-token'),
      getIdTokenResult: () => Promise.resolve({ token: 'mock-token', claims: {}, issuedAtTime: new Date().toISOString(), expirationTime: new Date().toISOString(), authTime: new Date().toISOString(), signInProvider: 'google.com', signInSecondFactor: null }),
      reload: () => Promise.resolve(),
      toJSON: () => ({})
    } as unknown as User;
    
    localStorage.setItem('mockCurrentUser', JSON.stringify({ ...mockLoggedUser, role: mockUser.role }));
    
    return { user: mockLoggedUser, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    // Em modo de produção, usaria o Firebase
    // await signOut(auth);
    
    localStorage.removeItem('mockCurrentUser');
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    // Mock para desenvolvimento
    const mockUser = MOCK_USERS.find(user => user.email === email);
    if (!mockUser) {
      return { success: false, error: "Email não encontrado" };
    }
    
    // Em modo de produção, usaria o Firebase
    // await sendPasswordResetEmail(auth, email);
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  // Em modo de produção, usaria o Firebase
  // return onAuthStateChanged(auth, callback);
  
  // Mock para desenvolvimento
  const storedUser = localStorage.getItem('mockCurrentUser');
  if (storedUser) {
    const mockUser = JSON.parse(storedUser) as User;
    callback(mockUser);
  } else {
    callback(null);
  }
  
  // Retornando uma função para simular a função de unsubscribe
  return () => {};
};
