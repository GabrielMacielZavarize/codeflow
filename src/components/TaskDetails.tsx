import React from 'react';
import { Task } from '../services/taskService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';

interface TaskDetailsProps {
    task: Task;
    onBack: () => void;
    getResponsavelNome: (id: string) => string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onBack, getResponsavelNome }) => {
    const { t } = useLanguage();

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'media':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'baixa':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'concluida':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'em_progresso':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'duvida':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'pendente':
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'concluida':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'em_progresso':
                return <Clock className="h-4 w-4 text-blue-500" />;
            case 'duvida':
                return <HelpCircle className="h-4 w-4 text-orange-500" />;
            case 'pendente':
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'concluida':
                return 'Concluída';
            case 'em_progresso':
                return 'Em Progresso';
            case 'duvida':
                return 'Com Dúvida';
            case 'pendente':
            default:
                return 'Pendente';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'Alta Prioridade';
            case 'media':
                return 'Média Prioridade';
            case 'baixa':
                return 'Baixa Prioridade';
            default:
                return 'Prioridade Não Definida';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <CardTitle className="text-xl sm:text-2xl">{task.title}</CardTitle>
                        <CardDescription className="text-sm sm:text-base mt-1">{task.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={`${getPriorityClass(task.prioridade)} text-sm sm:text-base px-3 py-1`}>
                        {getPriorityText(task.prioridade)}
                    </Badge>
                    <Badge variant="secondary" className={`${getStatusClass(task.status)} text-sm sm:text-base px-3 py-1 flex items-center gap-1`}>
                        {getStatusIcon(task.status)}
                        {getStatusText(task.status)}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <Calendar className="h-5 w-5" />
                        <div className="flex flex-col">
                            <span className="font-medium">Data de Início</span>
                            <span>{task.dataInicio ? format(task.dataInicio, 'PPP', { locale: ptBR }) : 'Não definida'}</span>
                        </div>
                    </div>
                    {task.dataFim && (
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            <Clock className="h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="font-medium">Data de Término</span>
                                <span>{format(task.dataFim, 'PPP', { locale: ptBR })}</span>
                            </div>
                        </div>
                    )}
                    {task.responsavelId && (
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            <User className="h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="font-medium">Responsável</span>
                                <span>{getResponsavelNome(task.responsavelId)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskDetails; 