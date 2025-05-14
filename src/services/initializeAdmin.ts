import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

const initializeAdmin = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@seudominio.com',
      'senha_segura'
    );

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@seudominio.com',
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date()
    });

    console.log('Usuário admin criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
};

initializeAdmin();