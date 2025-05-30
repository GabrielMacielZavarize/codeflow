import { Task } from '../contexts/TaskContext';
import { format, subDays, subMonths, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para dados do Gráfico de Pizza
export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

// Interface para dados do Gráfico de Barras
export interface BarChartData {
  name: string;
  criadas: number;
  concluidas: number;
  atrasadas: number;
}

// Interface para dados do Gráfico de Linha
export interface LineChartData {
  date: string;
  criadas: number;
  concluidas: number;
}

// Função auxiliar para converter Timestamp em Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate();
};

// Gera dados para o gráfico de pizza baseado nas tarefas existentes
export const getPieChartData = (tasks: Task[]): PieChartData[] => {
  const statusCount = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = {
    pendente: '#F59E0B',
    concluida: '#10B981',
    atrasada: '#EF4444',
    em_progresso: '#3B82F6'
  };

  const statusLabels = {
    pendente: 'Pendente',
    concluida: 'Concluída',
    atrasada: 'Atrasada',
    em_progresso: 'Em Progresso'
  };

  return Object.entries(statusCount)
    .filter(([_, value]) => value > 0)
    .map(([status, value]) => ({
      name: statusLabels[status as keyof typeof statusLabels] || status,
      value,
      color: colors[status as keyof typeof colors] || '#6B7280'
    }));
};

// Gera dados reais para o gráfico de barras (tarefas por mês)
export const getBarChartData = (tasks: Task[]): BarChartData[] => {
  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('pt-BR', { month: 'short' });
  }).reverse();

  return lastSixMonths.map(month => {
    const monthTasks = tasks.filter(task => {
      const taskDate = timestampToDate(task.dataCriacao);
      return taskDate.toLocaleString('pt-BR', { month: 'short' }) === month;
    });

    return {
      name: month,
      criadas: monthTasks.length,
      concluidas: monthTasks.filter(task => task.status === 'concluida').length,
      atrasadas: monthTasks.filter(task => task.status === 'atrasada').length
    };
  });
};

// Gera dados reais para o gráfico de linha (evolução de tarefas)
export const getLineChartData = (tasks: Task[]): LineChartData[] => {
  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return lastSevenDays.map(date => {
    const dayTasks = tasks.filter(task => {
      const taskDate = timestampToDate(task.dataCriacao).toISOString().split('T')[0];
      return taskDate === date;
    });

    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      criadas: dayTasks.length,
      concluidas: dayTasks.filter(task => task.status === 'concluida').length
    };
  });
};

export const getPriorityChartData = (tasks: Task[]): PieChartData[] => {
  const priorityCount = tasks.reduce((acc, task) => {
    acc[task.prioridade] = (acc[task.prioridade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityLabels = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  };

  const data = [
    { name: priorityLabels.alta, value: priorityCount['alta'] || 0, color: '#EF4444' },
    { name: priorityLabels.media, value: priorityCount['media'] || 0, color: '#F59E0B' },
    { name: priorityLabels.baixa, value: priorityCount['baixa'] || 0, color: '#10B981' }
  ];

  return data.filter(item => item.value > 0);
};

export const getResponsibleChartData = (tasks: Task[]): PieChartData[] => {
  const responsibleCount = tasks.reduce((acc, task) => {
    if (task.responsavelNome) {
      acc[task.responsavelNome] = (acc[task.responsavelNome] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Ordena por quantidade de tarefas e pega os 5 primeiros
  const sortedResponsibles = Object.entries(responsibleCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const colors = [
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#F59E0B', // Laranja
    '#EF4444', // Vermelho
    '#8B5CF6'  // Roxo
  ];

  return sortedResponsibles.map(([name, value], index) => ({
    name: name.split(' ')[0], // Pega apenas o primeiro nome
    value,
    color: colors[index % colors.length]
  }));
};

export const getCompletionRateData = (tasks: Task[]): LineChartData[] => {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  return last30Days.map(date => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const dayTasks = tasks.filter(task => {
      const taskDate = timestampToDate(task.dataCriacao);
      return taskDate >= startOfDay && taskDate <= endOfDay;
    });

    const completedTasks = dayTasks.filter(t => t.status === 'concluida').length;
    const completionRate = dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0;

    return {
      date: format(date, 'dd/MM'),
      criadas: dayTasks.length,
      concluidas: completedTasks
    };
  });
};
