
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../services/taskService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Carregando tarefas...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">
          Nenhuma tarefa encontrada nesta prioridade
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Adicione uma nova tarefa para começar
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-priority-high text-priority-high">Alta</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-priority-medium text-priority-medium">Média</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-priority-low text-priority-low">Baixa</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="ml-2">Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="ml-2 bg-blue-500">Em Progresso</Badge>;
      case 'completed':
        return <Badge variant="default" className="ml-2 bg-green-500">Concluída</Badge>;
      case 'canceled':
        return <Badge variant="destructive" className="ml-2">Cancelada</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Link key={task.id} to={`/task/${task.id}`} className="no-underline">
          <Card key={task.id} className={`border-l-4 border-l-priority-${task.priority} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">{task.title}</CardTitle>
                <div className="flex items-center">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
              <CardDescription>
                {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                {task.assignedTo && 
                  <span className="ml-2 text-sm text-muted-foreground">
                    • Atribuída a: {task.assignedTo.split('-')[1]}
                  </span>
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-2">{task.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TaskList;
