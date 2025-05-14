
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { Priority, TaskStatus } from '../services/taskService';

interface TaskFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (value: Priority | 'all') => void;
  selectedStatus: TaskStatus | 'all';
  setSelectedStatus: (value: TaskStatus | 'all') => void;
  selectedAssignee: string | 'all';
  setSelectedAssignee: (value: string | 'all') => void;
  assignees: { id: string; name: string }[];
  clearFilters: () => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedPriority,
  setSelectedPriority,
  selectedStatus,
  setSelectedStatus,
  selectedAssignee,
  setSelectedAssignee,
  assignees,
  clearFilters
}) => {
  return (
    <Card className="p-4 mb-6 task-filters dark:bg-gray-800 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="dark:text-gray-200">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Título ou descrição"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority" className="dark:text-gray-200">Prioridade</Label>
          <Select
            value={selectedPriority}
            onValueChange={(value) => setSelectedPriority(value as Priority | 'all')}
          >
            <SelectTrigger id="priority" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Selecionar prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as TaskStatus | 'all')}
          >
            <SelectTrigger id="status" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Selecionar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignee" className="dark:text-gray-200">Responsável</Label>
          <Select
            value={selectedAssignee}
            onValueChange={setSelectedAssignee}
          >
            <SelectTrigger id="assignee" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Selecionar responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-gray-500 dark:text-gray-400"
        >
          <X className="h-4 w-4 mr-1" /> Limpar filtros
        </Button>
      </div>
    </Card>
  );
};

export default TaskFilter;
