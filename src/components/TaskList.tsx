import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { tarefasService } from '@/lib/firebase/tarefas';
import { toast } from '@/components/ui/sonner';
import { Trash2, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade: 'alta' | 'media' | 'baixa';
  status: string;
  userId: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

export const TaskList = ({ tasks, onTaskUpdate }: TaskListProps) => {
  const { t } = useLanguage();

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      await tarefasService.atualizarTarefa(taskId, {
        concluida: !currentStatus
      });
      onTaskUpdate();
      toast.success(t.tasks.added);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error(t.tasks.addError);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      if (window.confirm(t.tasks.confirmDelete)) {
        await tarefasService.deletarTarefa(taskId);
        onTaskUpdate();
        toast.success(t.tasks.added);
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      toast.error(t.tasks.addError);
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-500';
      case 'media':
        return 'bg-yellow-500';
      case 'baixa':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return t.tasks.priority.high;
      case 'media':
        return t.tasks.priority.medium;
      case 'baixa':
        return t.tasks.priority.low;
      default:
        return t.tasks.unassigned;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={task.concluida}
                  onCheckedChange={() => handleToggleComplete(task.id, task.concluida)}
                />
                <div>
                  <h3 className="font-medium">{task.titulo}</h3>
                  <p className="text-sm text-gray-500">{task.descricao}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(task.prioridade)}>
                  {getPriorityLabel(task.prioridade)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t.tarefas.nenhumaTarefa}
        </div>
      )}
    </div>
  );
};
