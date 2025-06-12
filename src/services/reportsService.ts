import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '../lib/firebase/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';

// Interface para dados de relatório mensal
export interface MonthlyTasksData {
  month: string;
  tasks: number;
}

// Interface para dados de tarefas por membro da equipe
export interface TasksByMemberData {
  name: string;
  tasks: number;
  color: string;
}

// Interface para relatório
export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'completed';
  createdAt: string;
  createdBy: string;
  fileContent?: string;
  fileName?: string;
  fileType?: string;
  userId: string;
}

// Função para converter arquivo em base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Constante para o tamanho máximo do arquivo (900KB para dar margem de segurança)
const MAX_FILE_SIZE = 900 * 1024; // 900KB em bytes

// Função para gerar um novo relatório
export const generateReport = async (
  file: File,
  title: string,
  type: 'daily' | 'weekly' | 'monthly',
  userId: string,
  userName: string
): Promise<Report> => {
  try {
    // Verificar tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`O arquivo é muito grande. O tamanho máximo permitido é ${Math.round(MAX_FILE_SIZE / 1024)}KB`);
    }

    // Converter arquivo para base64
    const fileContent = await fileToBase64(file);

    // Verificar tamanho do base64
    if (fileContent.length > MAX_FILE_SIZE) {
      throw new Error('O arquivo convertido é muito grande para ser armazenado');
    }

    // Salvar no Firestore
    const reportData = {
      title,
      type,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      createdBy: userName,
      fileContent,
      fileName: file.name,
      fileType: file.type,
      userId
    };

    const docRef = await addDoc(collection(db, 'reports'), reportData);

    return {
      id: docRef.id,
      ...reportData
    };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Falha ao gerar relatório');
  }
};

// Função para listar relatórios
export const listReports = async (): Promise<Report[]> => {
  try {
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Report[];
  } catch (error) {
    console.error('Erro ao listar relatórios:', error);
    throw new Error('Falha ao listar relatórios');
  }
};

// Função para excluir um relatório
export const deleteReport = async (report: Report): Promise<void> => {
  try {
    // Excluir documento do Firestore
    await deleteDoc(doc(db, 'reports', report.id));
  } catch (error) {
    console.error('Erro ao excluir relatório:', error);
    throw new Error('Falha ao excluir relatório');
  }
};

// Função para baixar um relatório
export const downloadReport = async (report: Report): Promise<void> => {
  try {
    if (!report.fileContent || !report.fileName) {
      throw new Error('Conteúdo do arquivo não disponível');
    }

    // Converter base64 para blob
    const base64Response = await fetch(report.fileContent);
    const blob = await base64Response.blob();

    // Criar URL do blob
    const url = window.URL.createObjectURL(blob);

    // Criar link e iniciar download
    const link = document.createElement('a');
    link.href = url;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpar URL do blob
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar relatório:', error);
    throw new Error('Falha ao baixar relatório');
  }
};
