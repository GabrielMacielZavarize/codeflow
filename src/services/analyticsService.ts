
import { Task } from './taskService';
import { subDays, format, parseISO } from 'date-fns';
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

// Gera dados para o gráfico de pizza baseado nas tarefas existentes
export const getPieChartData = (tasks: Task[]): PieChartData[] => {
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;

  return [
    { name: 'Alta', value: highPriorityTasks, color: '#F97316' },
    { name: 'Média', value: mediumPriorityTasks, color: '#0EA5E9' },
    { name: 'Baixa', value: lowPriorityTasks, color: '#8B5CF6' }
  ];
};

// Gera dados mockados para o gráfico de barras (tarefas por semana)
export const getBarChartData = (): BarChartData[] => {
  // Mockando dados para as últimas 4 semanas
  return [
    { name: 'Semana 1', tasks: 12 },
    { name: 'Semana 2', tasks: 19 },
    { name: 'Semana 3', tasks: 7 },
    { name: 'Semana 4', tasks: 23 }
  ];
};

// Gera dados mockados para o gráfico de linha (evolução de tarefas concluídas)
export const getLineChartData = (): LineChartData[] => {
  const today = new Date();
  const data: LineChartData[] = [];
  
  // Gera dados para os últimos 10 dias
  for (let i = 9; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'dd/MM', { locale: ptBR });
    
    // Valores aleatórios entre 1 e 8 para tarefas concluídas
    const completedTasks = Math.floor(Math.random() * 8) + 1;
    
    data.push({
      date: formattedDate,
      completedTasks
    });
  }
  
  return data;
};
