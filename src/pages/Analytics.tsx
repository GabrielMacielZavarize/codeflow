import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import MetricCard from '../components/analytics/MetricCard';
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import AreaChartCard from '../components/analytics/AreaChartCard';
import { getPieChartData, getBarChartData, getLineChartData, getResponsibleChartData, getPriorityChartData, getCompletionRateData } from '../services/analyticsService';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

const Analytics: React.FC = () => {
  const { tasks, loading: tasksLoading, error } = useTasks();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  // Atualiza os dados filtrados quando tasks ou period mudar
  useEffect(() => {
    if (!tasks) return;

    const filtered = tasks.filter(task => {
      const taskDate = task.dataCriacao.toDate();
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - taskDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (period) {
        case '7d':
          return diffDays <= 7;
        case '30d':
          return diffDays <= 30;
        case '90d':
          return diffDays <= 90;
        case '1y':
          return diffDays <= 365;
        default:
          return true;
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, period]);

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === 'concluida').length;
  const pendingTasks = filteredTasks.filter(task => task.status === 'pendente').length;
  const overdueTasks = filteredTasks.filter(task => task.status === 'atrasada').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Erro ao carregar dados: {error}</div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Análises</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa encontrada para análise</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Análise de Desempenho
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualize métricas e tendências do seu time
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Tabs defaultValue="7d" className="w-full" onValueChange={(value) => setPeriod(value as '7d' | '30d' | '90d' | '1y')}>
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="7d" className="text-xs sm:text-sm">7 dias</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs sm:text-sm">30 dias</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs sm:text-sm">90 dias</TabsTrigger>
              <TabsTrigger value="1y" className="text-xs sm:text-sm">1 ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Tarefas"
          value={totalTasks}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${completionRate}%`}
          icon={CheckCircle}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Tarefas Pendentes"
          value={pendingTasks}
          icon={Clock}
          trend={{ value: 3, isPositive: false }}
        />
        <MetricCard
          title="Tarefas Atrasadas"
          value={overdueTasks}
          icon={AlertCircle}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PieChartCard
          data={getPieChartData(filteredTasks)}
          title="Distribuição por Status"
          description="Visualização da distribuição de tarefas por status"
        />
        <PieChartCard
          data={getPriorityChartData(filteredTasks)}
          title="Distribuição por Prioridade"
          description="Visualização da distribuição de tarefas por prioridade"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChartCard
          data={getBarChartData(filteredTasks)}
          title="Tarefas por Mês"
          description="Quantidade de tarefas criadas, concluídas e atrasadas por mês"
        />
        <PieChartCard
          data={getResponsibleChartData(filteredTasks)}
          title="Tarefas por Responsável"
          description="Top 5 responsáveis com mais tarefas"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AreaChartCard
          data={getLineChartData(filteredTasks)}
          title="Evolução de Tarefas"
          description="Evolução do número de tarefas criadas e concluídas ao longo do tempo"
        />
        <AreaChartCard
          data={getCompletionRateData(filteredTasks)}
          title="Taxa de Conclusão ao Longo do Tempo"
          description="Evolução da taxa de conclusão de tarefas nos últimos 30 dias"
        />
      </div>
    </div>
  );
};

export default Analytics;
