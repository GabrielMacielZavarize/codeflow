import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where
} from 'firebase/firestore';
import { db } from './config';
import { auth } from './config';

// Função para verificar autenticação
const verificarAutenticacao = () => {
    if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
    }
    return auth.currentUser;
};

// Função para adicionar um documento
export const addDocument = async (collectionName: string, data: any) => {
    try {
        verificarAutenticacao();
        const docRef = await addDoc(collection(db, collectionName), data);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Erro ao adicionar documento:', error);
        throw error;
    }
};

// Função para buscar um documento específico
export const getDocument = async (collectionName: string, documentId: string) => {
    try {
        verificarAutenticacao();
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar documento:', error);
        throw error;
    }
};

// Função para buscar todos os documentos de uma coleção
export const getDocuments = async (collectionName: string) => {
    try {
        verificarAutenticacao();
        const querySnapshot = await getDocs(collection(db, collectionName));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        throw error;
    }
};

// Função para atualizar um documento
export const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: any
) => {
    try {
        verificarAutenticacao();
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, data);
        return { id: documentId, ...data };
    } catch (error) {
        console.error('Erro ao atualizar documento:', error);
        throw error;
    }
};

// Função para deletar um documento
export const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
        verificarAutenticacao();
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao deletar documento:', error);
        throw error;
    }
};

// Função para buscar documentos com filtro
export const queryDocuments = async (
    collectionName: string,
    field: string,
    operator: any,
    value: any
) => {
    try {
        verificarAutenticacao();
        const q = query(
            collection(db, collectionName),
            where(field, operator, value)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Erro ao buscar documentos com filtro:', error);
        throw error;
    }
}; 