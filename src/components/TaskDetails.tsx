import React from 'react';
import { Task } from '../services/taskService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';

interface TaskDetailsProps {
    task: Task;
    onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack }) => {
    const { t } = useLanguage();

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
            case 'medium':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
            case 'low':
                return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
            case 'in_progress':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-2 sm:p-4">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="p-3 sm:p-6">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onBack}
                                className="sm:hidden"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle className="dark:text-white text-lg sm:text-xl">{task.title}</CardTitle>
                                <CardDescription className="dark:text-gray-400 text-sm sm:text-base">
                                    {task.description}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={`${getPriorityClass(task.priority)}`}>
                                {task.priority === 'high' ? t.tasks.priority.high :
                                    task.priority === 'medium' ? t.tasks.priority.medium :
                                        t.tasks.priority.low}
                            </Badge>
                            <Badge variant="secondary" className={`${getStatusClass(task.status)}`}>
                                {task.status === 'completed' ? t.tasks.status.completed :
                                    task.status === 'in_progress' ? t.tasks.status.inProgress :
                                        t.tasks.status.pending}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>{t.tasks.dueDate}: {task.dueDate ? format(new Date(task.dueDate), 'PPP', { locale: ptBR }) : t.tasks.noDueDate}</span>
                            </div>
                            {task.assignee && (
                                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    <User className="h-4 w-4" />
                                    <span>{t.tasks.assignee}: {task.assignee}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="w-full sm:w-auto text-sm sm:text-base"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t.general.back}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default TaskDetails; 