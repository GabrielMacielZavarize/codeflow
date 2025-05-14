
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

// Gera dados mockados para relatório de tarefas por mês
export const getMonthlyTasksReport = async (): Promise<MonthlyTasksData[]> => {
  const today = new Date();
  const data: MonthlyTasksData[] = [];
  
  // Gera dados para os últimos 6 meses
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = format(date, 'MMM', { locale: ptBR });
    
    // Valores aleatórios entre 5 e 30 para tarefas
    const tasks = Math.floor(Math.random() * 25) + 5;
    
    data.push({
      month: monthName,
      tasks
    });
  }
  
  return data;
};

// Gera dados mockados para relatório de tarefas por membro da equipe
export const getTasksByMemberReport = async (): Promise<TasksByMemberData[]> => {
  return [
    { name: 'Ana Silva', tasks: 15, color: '#F97316' },
    { name: 'Carlos Mendes', tasks: 22, color: '#0EA5E9' },
    { name: 'Juliana Costa', tasks: 8, color: '#8B5CF6' },
    { name: 'Rafael Almeida', tasks: 12, color: '#10B981' }
  ];
};

// Função mock para exportar relatórios
export const exportReport = async (format: 'pdf' | 'csv'): Promise<boolean> => {
  console.log(`Relatório exportado no formato ${format} (mock)`);
  return true;
};
