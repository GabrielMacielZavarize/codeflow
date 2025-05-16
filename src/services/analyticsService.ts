import { Task } from './taskService';
import { subDays, format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, isValid } from 'date-fns';
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
  tasks: number;
}

// Interface para dados do Gráfico de Linha
export interface LineChartData {
  date: string;
  completedTasks: number;
}

// Função auxiliar para converter string em Date de forma segura
const parseDate = (date: Date | string | undefined): Date | null => {
  if (!date) return null;

  try {
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }

    const parsedDate = new Date(date);
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
};

// Gera dados para o gráfico de pizza baseado nas tarefas existentes
export const getPieChartData = (tasks: Task[]): PieChartData[] => {
  const concluidas = tasks.filter(task => task.status === 'concluida').length;
  const pendentes = tasks.filter(task => task.status === 'pendente').length;
  const atrasadas = tasks.filter(task => {
    const hoje = new Date();
    return task.dataFim && task.dataFim < hoje && task.status !== 'concluida';
  }).length;

  return [
    { name: 'Concluídas', value: concluidas, color: '#22C55E' },
    { name: 'Pendentes', value: pendentes, color: '#F59E0B' },
    { name: 'Atrasadas', value: atrasadas, color: '#EF4444' }
  ];
};

// Gera dados reais para o gráfico de barras (tarefas por semana)
export const getBarChartData = (tasks: Task[]): BarChartData[] => {
  const today = new Date();
  const fourWeeksAgo = subDays(today, 28);

  // Obtém todas as semanas no intervalo
  const weeks = eachWeekOfInterval(
    { start: fourWeeksAgo, end: today },
    { weekStartsOn: 1 } // Segunda-feira
  );

  return weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekTasks = tasks.filter(task => {
      const taskDate = parseDate(task.dataCriacao);
      if (!taskDate) return false;
      return taskDate >= weekStart && taskDate <= weekEnd;
    });

    return {
      name: `Sem ${format(weekStart, 'w')}`,
      tasks: weekTasks.length
    };
  });
};

// Gera dados reais para o gráfico de linha (evolução de tarefas concluídas)
export const getLineChartData = (tasks: Task[]): LineChartData[] => {
  const today = new Date();
  const tenDaysAgo = subDays(today, 9);

  // Obtém todos os dias no intervalo
  const days = eachDayOfInterval({ start: tenDaysAgo, end: today });

  return days.map(date => {
    const completedTasks = tasks.filter(task => {
      const taskDate = parseDate(task.dataCriacao);
      if (!taskDate) return false;

      const isSameDay = format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      return isSameDay && task.status === 'concluida';
    }).length;

    return {
      date: format(date, 'dd/MM', { locale: ptBR }),
      completedTasks
    };
  });
};
