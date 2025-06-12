import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db, auth } from '../lib/firebase/config';
import { useAuth } from './AuthContext';

export type TaskStatus = 'pendente' | 'em_progresso' | 'concluida' | 'atrasada';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
    id: string;
    titulo: string;
    descricao: string;
    status: TaskStatus;
    prioridade: TaskPriority;
    dataCriacao: Timestamp;
    dataAtualizacao: Timestamp;
    dataInicio?: Timestamp;
    dataFim?: Timestamp;
    responsavelId?: string;
    responsavelNome?: string;
    responsavelAvatar?: string;
    userId: string;
    userEmail: string;
}

export type NewTask = Omit<Task, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'userId' | 'userEmail'>;

interface TaskContextData {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    addTask: (task: NewTask) => Promise<void>;
    updateTask: (id: string, task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextData>({
    tasks: [],
    loading: true,
    error: null,
    addTask: async () => { },
    updateTask: async () => { },
    deleteTask: async () => { },
    refreshTasks: async () => { }
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    const fetchTasks = async () => {
        if (!currentUser) {
            setTasks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const tasksRef = collection(db, 'tarefas');
            const tasksQuery = query(
                tasksRef,
                orderBy('dataCriacao', 'desc')
            );

            const unsubscribe = onSnapshot(
                tasksQuery,
                (snapshot: QuerySnapshot<DocumentData>) => {
                    const tasksList = snapshot.docs
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        })) as Task[];

                    setTasks(tasksList);
                    setLoading(false);
                },
                (err) => {
                    if (err.code === 'permission-denied') {
                        setTasks([]);
                    }
                    setError('Erro ao carregar tarefas');
                    setLoading(false);
                }
            );

            return unsubscribe;
        } catch (err) {
            setError('Erro ao carregar tarefas');
            setLoading(false);
            return undefined;
        }
    };

    const refreshTasks = async () => {
        const unsubscribe = await fetchTasks();
        if (unsubscribe) {
            unsubscribe();
        }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const setupTasks = async () => {
            unsubscribe = await fetchTasks();
        };

        setupTasks();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            setTasks([]);
            setLoading(true);
        };
    }, [currentUser]);

    const addTask = async (task: NewTask): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            setError('Usuário não autenticado');
            return;
        }

        try {
            const tasksRef = collection(db, 'tarefas');
            const now = Timestamp.now();

            const taskWithMetadata = {
                ...task,
                dataCriacao: now,
                dataAtualizacao: now,
                userId: user.uid,
                userEmail: user.email || ''
            };

            await addDoc(tasksRef, taskWithMetadata);
        } catch (err) {
            setError('Erro ao adicionar tarefa');
        }
    };

    const updateTask = async (id: string, task: Partial<Task>): Promise<void> => {
        try {
            const taskRef = doc(db, 'tarefas', id);
            const updateData = {
                ...task,
                dataAtualizacao: Timestamp.now()
            };
            await updateDoc(taskRef, updateData);
        } catch (err) {
            setError('Erro ao atualizar tarefa');
        }
    };

    const deleteTask = async (id: string): Promise<void> => {
        try {
            const taskRef = doc(db, 'tarefas', id);
            await deleteDoc(taskRef);
        } catch (err) {
            setError('Erro ao deletar tarefa');
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                loading,
                error,
                addTask,
                updateTask,
                deleteTask,
                refreshTasks
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks deve ser usado dentro de um TaskProvider');
    }
    return context;
}; 