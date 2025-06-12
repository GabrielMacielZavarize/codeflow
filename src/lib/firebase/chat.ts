import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs, deleteDoc, doc, where, or, and } from 'firebase/firestore';

export interface ChatMessage {
    id: string;
    content: string;
    userId: string;
    userName: string;
    userEmail: string;
    timestamp: Date;
    chatId: string;
    isPrivate: boolean;
    participants: string[];
}

export interface Conversation {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageTime?: Date;
}

export const sendMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    try {
        const messagesRef = collection(db, 'chats');
        const messageData = {
            ...message,
            timestamp: serverTimestamp(),
            isPrivate: message.isPrivate || false,
            participants: message.participants || []
        };
        await addDoc(messagesRef, messageData);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
};

export const deleteMessage = async (messageId: string) => {
    try {
        const messageRef = doc(db, 'chats', messageId);
        await deleteDoc(messageRef);
    } catch (error) {
        console.error('Erro ao apagar mensagem:', error);
        throw error;
    }
};

export const subscribeToMessages = (
    callback: (messages: ChatMessage[]) => void,
    onError?: (error: Error) => void,
    chatId: string = 'forum'
) => {
    try {
        const messagesRef = collection(db, 'chats');
        const q = query(
            messagesRef,
            where('chatId', '==', chatId),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    content: data.content,
                    userId: data.userId,
                    userName: data.userName,
                    userEmail: data.userEmail,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    chatId: data.chatId,
                    isPrivate: data.isPrivate || false,
                    participants: data.participants || [],
                });
            });
            callback(messages);
        }, (error) => {
            console.error('Erro ao receber mensagens:', error);
            onError?.(error);
        });
    } catch (error) {
        console.error('Erro ao configurar listener de mensagens:', error);
        throw error;
    }
};

export const getMessages = async (chatId: string = 'forum'): Promise<ChatMessage[]> => {
    try {
        const messagesRef = collection(db, 'chats');
        const q = query(
            messagesRef,
            where('chatId', '==', chatId),
            orderBy('timestamp', 'asc')
        );
        const snapshot = await getDocs(q);

        const messages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({
                id: doc.id,
                content: data.content,
                userId: data.userId,
                userName: data.userName,
                userEmail: data.userEmail,
                timestamp: data.timestamp?.toDate() || new Date(),
                chatId: data.chatId,
                isPrivate: data.isPrivate || false,
                participants: data.participants || [],
            });
        });

        return messages;
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        throw error;
    }
};

export const createConversation = async (participants: string[]): Promise<string> => {
    try {
        const conversationsRef = collection(db, 'conversations');
        const docRef = await addDoc(conversationsRef, {
            participants,
            createdAt: serverTimestamp(),
            lastMessage: null,
            lastMessageTime: null
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar conversa:', error);
        throw error;
    }
};

export const subscribeToConversations = (
    userId: string,
    callback: (conversations: Conversation[]) => void,
    onError?: (error: Error) => void
) => {
    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where('participants', 'array-contains', userId)
        );

        return onSnapshot(q, (snapshot) => {
            const conversations: Conversation[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                conversations.push({
                    id: doc.id,
                    participants: data.participants,
                    lastMessage: data.lastMessage,
                    lastMessageTime: data.lastMessageTime?.toDate(),
                });
            });
            callback(conversations);
        }, (error) => {
            console.error('Erro ao receber conversas:', error);
            onError?.(error);
        });
    } catch (error) {
        console.error('Erro ao configurar listener de conversas:', error);
        throw error;
    }
};

export const deleteConversation = async (conversationId: string) => {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        await deleteDoc(conversationRef);
    } catch (error) {
        console.error('Erro ao excluir conversa:', error);
        throw error;
    }
}; 