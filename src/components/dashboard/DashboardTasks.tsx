import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tarefa } from '@/lib/firebase/tarefas';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { extrairUsernameGithub } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardTasksProps {
    tasks: Tarefa[];
    onTaskClick: (task: Tarefa) => void;
}

export const DashboardTasks: React.FC<DashboardTasksProps> = ({
    tasks,
    onTaskClick
}) => {
    const { t } = useLanguage();

    const getPriorityColor = (priority: Tarefa['prioridade']) => {
        switch (priority) {
            case 'alta':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'media':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'baixa':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusColor = (status: Tarefa['status']) => {
        switch (status) {
            case 'concluida':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'em_progresso':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'pendente':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'duvida':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-gradient-to-br from-background to-muted/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        {t.dashboard.tasks.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                variants={item}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
                                onClick={() => onTaskClick(task)}
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-base">{task.titulo}</h3>
                                        <div className="flex gap-2">
                                            <Badge
                                                variant="secondary"
                                                className={`${getPriorityColor(task.prioridade)} text-xs`}
                                            >
                                                {task.prioridade}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className={`${getStatusColor(task.status)} text-xs`}
                                            >
                                                {task.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {task.descricao}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6 ring-2 ring-primary/10">
                                                <AvatarImage src={task.responsavelAvatar} alt={task.responsavelNome} />
                                                <AvatarFallback>
                                                    {extrairUsernameGithub(task.responsavelNome)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{task.responsavelNome}</span>
                                        </div>
                                        <span className="text-xs">
                                            {format(new Date(task.dataCriacao), "d 'de' MMMM", { locale: ptBR })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}; 