import React from 'react';
import { Task, Priority } from '../services/taskService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, FileText, Tag, CalendarClock } from 'lucide-react';

interface TaskDetailsModalProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
    if (!task) return null;

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500 text-white';
            case 'medium':
                return 'bg-yellow-500 text-white';
            case 'low':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getPriorityLabel = (priority: Priority) => {
        switch (priority) {
            case 'high':
                return 'Alta';
            case 'medium':
                return 'Média';
            case 'low':
                return 'Baixa';
            default:
                return 'Não definida';
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {task.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status e Prioridade */}
                    <div className="flex items-center space-x-4">
                        <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                        </Badge>
                        <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'secondary'}>
                            {task.status === 'completed' ? 'Concluído' : task.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                        </Badge>
                    </div>

                    {/* Responsável */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://avatar.vercel.sh/${task.assignee}`} />
                            <AvatarFallback>{task.assignee?.split(' ')[0][0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Responsável</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{task.assignee}</p>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Descrição</h3>
                        <p className="text-gray-900 dark:text-white">{task.description}</p>
                    </div>

                    {/* Progresso */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</h3>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{task.progress || 0}%</span>
                        </div>
                        <Progress value={task.progress || 0} className="h-2" />
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Criação</p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(task.createdAt)} às {formatTime(task.createdAt)}
                                </p>
                            </div>
                        </div>
                        {task.dueDate && (
                            <div className="flex items-center space-x-2">
                                <CalendarClock className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Entrega</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(task.dueDate)} às {formatTime(task.dueDate)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-sm">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsModal; 