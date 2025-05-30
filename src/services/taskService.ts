import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

export type StatusTarefa = 'concluida' | 'pendente' | 'atrasada' | 'em_progresso' | 'duvida';
export type Prioridade = 'alta' | 'media' | 'baixa';

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: StatusTarefa;
  prioridade: Prioridade;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataInicio?: Date;
  dataFim?: Date;
  responsavelId?: string;
  responsavelNome?: string;
  responsavelAvatar?: string;
  userId: string;
  userEmail: string;
  concluida: boolean;
}

// Mock de tarefas para desenvolvimento inicial
const mockTasks: Omit<Task, 'id' | 'userId' | 'userEmail'>[] = [
  {
    titulo: 'Atualizar documentação do projeto',
    descricao: 'Revisar e atualizar a documentação técnica do projeto principal',
    prioridade: 'media',
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: 'pendente',
    responsavelId: 'user-1',
    dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    concluida: false
  },
  {
    titulo: 'Implementar autenticação por OAuth',
    descricao: 'Adicionar suporte a login social via Google e Github',
    prioridade: 'alta',
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: 'em_progresso',
    responsavelId: 'user-2',
    dataFim: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    concluida: false
  },
  {
    titulo: 'Otimizar consultas do banco de dados',
    descricao: 'Melhorar performance das consultas principais',
    prioridade: 'alta',
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: 'pendente',
    responsavelId: 'user-3',
    dataFim: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    concluida: false
  },
  {
    titulo: 'Planejar reunião de sprint',
    descricao: 'Organizar pauta e convocar equipe para planejamento',
    prioridade: 'baixa',
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: 'concluida',
    responsavelId: 'user-1',
    dataFim: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    concluida: true
  },
  {
    titulo: 'Corrigir bug na validação de formulários',
    descricao: 'O formulário permite envio com campos obrigatórios vazios',
    prioridade: 'media',
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    status: 'em_progresso',
    responsavelId: 'user-4',
    dataFim: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    concluida: false
  }
];

// Funções para gerenciar tarefas
export const getTasks = async (): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, 'tarefas');
    const q = query(tasksCollection);

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
