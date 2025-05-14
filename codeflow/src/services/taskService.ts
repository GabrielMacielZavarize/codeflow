
import { db } from './firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'canceled';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  createdAt: Date;
  userId: string;
  status?: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;
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
    // Para desenvolvimento, retornamos os mocks
    // Em produção, descomente o código abaixo e comente a parte de mock
    /*
    const tasksCollection = collection(db, 'tasks');
    const taskSnapshot = await getDocs(tasksCollection);
    return taskSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Task))
      .filter(task => task.userId === userId);
    */
    
    // Versão mock para desenvolvimento
    return mockTasks.map((task, index) => ({
      ...task,
      id: `mock-task-${index}`,
      userId
    }));
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    // Versão mock para desenvolvimento
    const allTasks = await getTasks('mock-user-id');
    const task = allTasks.find(task => task.id === id);
    return task || null;
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return null;
  }
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task | null> => {
  try {
    // Para produção, descomente o código abaixo
    /*
    const docRef = await addDoc(collection(db, 'tasks'), task);
    return { ...task, id: docRef.id };
    */
    
    // Versão mock para desenvolvimento
    console.log('Task adicionada (mock):', task);
    return { ...task, id: `mock-task-${new Date().getTime()}` };
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return null;
  }
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<boolean> => {
  try {
    // Para produção, descomente o código abaixo
    /*
    await updateDoc(doc(db, 'tasks', id), taskData);
    */
    
    // Versão mock para desenvolvimento
    console.log(`Task ${id} atualizada (mock):`, taskData);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return false;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    // Para produção, descomente o código abaixo
    /*
    await deleteDoc(doc(db, 'tasks', id));
    */
    
    // Versão mock para desenvolvimento
    console.log(`Task ${id} removida (mock)`);
    return true;
  } catch (error) {
    console.error('Erro ao remover tarefa:', error);
    return false;
  }
};
