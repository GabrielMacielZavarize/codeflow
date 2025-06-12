import { rtdb } from './firebase';
import { ref, onValue, onDisconnect, serverTimestamp, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

interface OnlineUser {
    id: string;
    name: string;
    email: string;
    lastSeen: number;
    state: 'online' | 'offline';
}

export const setupPresence = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const userStatusRef = ref(rtdb, `status/${user.uid}`);

    // Quando o usuário se conecta
    const isOfflineForDatabase = {
        state: 'offline',
        lastSeen: serverTimestamp(),
        name: user.displayName || 'Usuário',
        email: user.email || '',
        id: user.uid
    };

    const isOnlineForDatabase = {
        state: 'online',
        lastSeen: serverTimestamp(),
        name: user.displayName || 'Usuário',
        email: user.email || '',
        id: user.uid
    };

    // Quando o usuário se desconecta
    onDisconnect(userStatusRef).update({
        state: 'offline',
        lastSeen: serverTimestamp()
    });

    // Quando o usuário se conecta
    set(userStatusRef, isOnlineForDatabase);

    return () => {
        // Quando o componente é desmontado
        set(userStatusRef, isOfflineForDatabase);
    };
};

export const subscribeToOnlineUsers = (
    callback: (users: OnlineUser[]) => void,
    onError?: (error: Error) => void
) => {
    try {
        const statusRef = ref(rtdb, 'status');

        return onValue(statusRef, (snapshot) => {
            const users: OnlineUser[] = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data) {
                    users.push({
                        id: childSnapshot.key || '',
                        name: data.name || 'Usuário',
                        email: data.email || '',
                        lastSeen: data.lastSeen || Date.now(),
                        state: data.state || 'offline'
                    });
                }
            });
            callback(users);
        }, (error) => {
            console.error('Erro ao receber status dos usuários:', error);
            onError?.(error);
        });
    } catch (error) {
        console.error('Erro ao configurar listener de status:', error);
        throw error;
    }
}; 