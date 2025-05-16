import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'concluida' | 'pendente' | 'atrasada';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataInicio?: Date;
  dataFim?: Date;
  responsavelId?: string;
  progress?: number;
  userId: string;
}

// Mock de tarefas para desenvolvimento inicial
const mockTasks: Omit<Task, 'id' | 'userId'>[] = [
  {
    title: 'Atualizar documentação do projeto',
    description: 'Revisar e atualizar a documentação técnica do projeto principal',
    priority: 'medium',
    createdAt: new Date(),
    status: 'pending',
    assignedTo: 'user-1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
  },
  {
    title: 'Implementar autenticação por OAuth',
    description: 'Adicionar suporte a login social via Google e Github',
    priority: 'high',
    createdAt: new Date(),
    status: 'in_progress',
    assignedTo: 'user-2',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    title: 'Otimizar consultas do banco de dados',
    description: 'Melhorar performance das consultas principais',
    priority: 'high',
    createdAt: new Date(),
    status: 'pending',
    assignedTo: 'user-3',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    title: 'Planejar reunião de sprint',
    description: 'Organizar pauta e convocar equipe para planejamento',
    priority: 'low',
    createdAt: new Date(),
    status: 'completed',
    assignedTo: 'user-1',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    title: 'Corrigir bug na validação de formulários',
    description: 'O formulário permite envio com campos obrigatórios vazios',
    priority: 'medium',
    createdAt: new Date(),
    status: 'in_progress',
    assignedTo: 'user-4',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  }
];

// Funções para gerenciar tarefas
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, 'tarefas');
    const q = query(
      tasksCollection,
      where('userId', '==', userId)
    );

    const taskSnapshot = await getDocs(q);
    const tasks = taskSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dataCriacao: data.dataCriacao?.toDate?.() || new Date(),
        dataAtualizacao: data.dataAtualizacao?.toDate?.() || new Date(),
        dataInicio: data.dataInicio?.toDate?.() || null,
        dataFim: data.dataFim?.toDate?.() || null
      } as Task;
    });

    // Ordena as tarefas por data de criação após buscar
    return tasks.sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const tasksCollection = collection(db, 'tarefas');
    const q = query(tasksCollection, where('id', '==', id));
    const taskSnapshot = await getDocs(q);

    if (taskSnapshot.empty) return null;

    const doc = taskSnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dataCriacao: data.dataCriacao?.toDate?.() || new Date(),
      dataAtualizacao: data.dataAtualizacao?.toDate?.() || new Date(),
      dataInicio: data.dataInicio?.toDate?.() || null,
      dataFim: data.dataFim?.toDate?.() || null
    } as Task;
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return null;
  }
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    const taskData = {
      ...task,
      dataCriacao: Timestamp.fromDate(new Date()),
      dataAtualizacao: Timestamp.fromDate(new Date()),
      dataInicio: task.dataInicio ? Timestamp.fromDate(task.dataInicio) : null,
      dataFim: task.dataFim ? Timestamp.fromDate(task.dataFim) : null
    };

    const docRef = await addDoc(collection(db, 'tarefas'), taskData);
    return { ...task, id: docRef.id };
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return null;
  }
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<boolean> => {
  try {
    const updateData = {
      ...taskData,
      dataAtualizacao: Timestamp.fromDate(new Date()),
      dataInicio: taskData.dataInicio ? Timestamp.fromDate(taskData.dataInicio) : null,
      dataFim: taskData.dataFim ? Timestamp.fromDate(taskData.dataFim) : null
    };

    await updateDoc(doc(db, 'tarefas', id), updateData);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return false;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'tarefas', id));
    return true;
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    return false;
  }
};
