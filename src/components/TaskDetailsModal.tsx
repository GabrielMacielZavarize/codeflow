import React, { useState, useEffect } from 'react';
import { Tarefa, Comentario } from '../lib/firebase/tarefas';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, FileText, Tag, CalendarClock, Trash2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { tarefasService } from '@/lib/firebase/tarefas';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { extrairUsernameGithub } from '@/lib/utils';
import { membrosService } from '@/lib/firebase/membros';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskDetailsModalProps {
    task: Tarefa | null;
    isOpen: boolean;
    onClose: () => void;
    onTaskDeleted?: (taskId: string) => void;
    onTaskUpdated?: (taskId: string, updates: Partial<Tarefa>) => void;
    teamMembers: any[];
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose, onTaskDeleted, onTaskUpdated, teamMembers }) => {
    const [novoComentario, setNovoComentario] = useState('');
    const [respostaComentario, setRespostaComentario] = useState<{ id: string; texto: string } | null>(null);
    const [currentTask, setCurrentTask] = useState<Tarefa | null>(null);
    const { currentUser } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        if (task) {
            setCurrentTask(task);
        }
    }, [task]);

    if (!currentTask) return null;

    const handleDelete = async () => {
        if (!currentTask?.id) {
            toast.error('Tarefa sem ID. Não é possível excluir.');
            return;
        }

        try {
            if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
                // Primeiro, atualizar o contador de tarefas do membro responsável
                if (currentTask.responsavelId) {
                    const membroResponsavel = teamMembers.find(m => m.id === currentTask.responsavelId);
                    if (membroResponsavel) {
                        const novoContador = Math.max(0, (membroResponsavel.tarefas || 0) - 1);
                        await membrosService.atualizarMembro(membroResponsavel.id, {
                            tarefas: novoContador,
                            dataEntrada: membroResponsavel.dataEntrada
                        });
                    }
                }

                await tarefasService.deletarTarefa(currentTask.id);
                onTaskDeleted?.(currentTask.id);
                onClose();
                toast.success('Tarefa excluída com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            toast.error('Erro ao excluir tarefa. Tente novamente.');
        }
    };

    const handleStatusChange = async (novoStatus: Tarefa['status']) => {
        if (!currentTask.id) return;

        try {
            setCurrentTask(prevTask => ({
                ...prevTask!,
                status: novoStatus,
                concluida: novoStatus === 'concluida'
            }));

            await tarefasService.atualizarTarefa(currentTask.id, {
                status: novoStatus,
                concluida: novoStatus === 'concluida'
            });

            onTaskUpdated?.(currentTask.id, {
                status: novoStatus,
                concluida: novoStatus === 'concluida'
            });
            toast.success('Status atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast.error('Erro ao atualizar status. Tente novamente.');

            setCurrentTask(prevTask => ({
                ...prevTask!,
                status: currentTask.status,
                concluida: currentTask.concluida
            }));
        }
    };

    const handleAddComment = async () => {
        if (!currentTask?.id || !currentUser || !novoComentario.trim()) return;

        try {
            const comentario = {
                id: Date.now().toString(),
                texto: novoComentario.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
                userAvatar: currentUser.photoURL || '',
                dataCriacao: new Date(),
                respostas: []
            };

            const tarefaAtualizada = {
                ...currentTask,
                comentarios: [...(currentTask.comentarios || []), comentario]
            };

            await tarefasService.atualizarTarefa(currentTask.id, tarefaAtualizada);
            setCurrentTask(tarefaAtualizada);
            setNovoComentario('');
            toast.success('Comentário adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            toast.error('Erro ao adicionar comentário. Tente novamente.');
        }
    };

    const handleReplyComment = async (comentarioId: string) => {
        if (!currentTask?.id || !currentUser || !respostaComentario?.texto.trim()) return;

        try {
            const resposta = {
                id: Date.now().toString(),
                texto: respostaComentario.texto.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Usuário',
                userAvatar: currentUser.photoURL || '',
                dataCriacao: new Date()
            };

            const comentariosAtualizados = currentTask.comentarios?.map(comentario => {
                if (comentario.id === comentarioId) {
                    return {
                        ...comentario,
                        respostas: [...(comentario.respostas || []), resposta]
                    };
                }
                return comentario;
            });

            const tarefaAtualizada = {
                ...currentTask,
                comentarios: comentariosAtualizados
            };

            await tarefasService.atualizarTarefa(currentTask.id, tarefaAtualizada);
            setCurrentTask(tarefaAtualizada);
            setRespostaComentario(null);
            toast.success('Resposta adicionada com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar resposta:', error);
            toast.error('Erro ao adicionar resposta. Tente novamente.');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'bg-red-500 text-white';
            case 'media':
                return 'bg-yellow-500 text-white';
            case 'baixa':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'alta':
                return 'Alta';
            case 'media':
                return 'Média';
            case 'baixa':
                return 'Baixa';
            default:
                return 'Não definida';
        }
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Data não definida';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Data não definida';
            return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data não definida';
        }
    };

    const formatTime = (date: Date | string | undefined) => {
        if (!date) return '';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return '';
            return format(dateObj, "HH:mm", { locale: ptBR });
        } catch (error) {
            console.error('Erro ao formatar hora:', error);
            return '';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[90vh] flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border border-primary/10 shadow-2xl">
                <DialogHeader className="flex-shrink-0 pb-4 sm:pb-6 border-b border-primary/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 shadow-lg shadow-primary/10 ring-1 ring-primary/20">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {currentTask.titulo}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {t.tasks.description}
                </DialogDescription>

                <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
                    <div className="space-y-4 sm:space-y-8">
                        {/* Status e Prioridade */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200 gap-3">
                            <div className="flex items-center gap-3">
                                <Badge className={`${getPriorityColor(currentTask.prioridade || '')} px-3 sm:px-4 py-1.5 text-sm font-medium shadow-lg shadow-primary/10 ring-1 ring-white/20`}>
                                    {getPriorityLabel(currentTask.prioridade || '')}
                                </Badge>
                                <Select
                                    value={currentTask.status}
                                    onValueChange={(value: Tarefa['status']) => handleStatusChange(value)}
                                >
                                    <SelectTrigger className="w-[140px] sm:w-[180px] bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <SelectValue placeholder={t.tasks.statusLabel} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10 shadow-xl">
                                        <SelectItem value="pendente">{t.tasks.status.pending}</SelectItem>
                                        <SelectItem value="em_progresso">{t.tasks.status.inProgress}</SelectItem>
                                        <SelectItem value="concluida">{t.tasks.status.completed}</SelectItem>
                                        <SelectItem value="duvida">{t.tasks.status.canceled}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Progresso:</span>
                                <Progress value={currentTask.concluida ? 100 : 0} className="w-20 sm:w-24 h-2 bg-primary/10" />
                                <span className="text-sm font-medium text-muted-foreground">{currentTask.concluida ? '100' : '0'}%</span>
                            </div>
                        </div>

                        {/* Responsável */}
                        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20 shadow-lg ring-2 ring-primary/10">
                                    <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(currentTask.responsavelAvatar)}`} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 text-primary">
                                        {currentTask.responsavelNome?.split(' ')[0]?.[0] || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t.tasks.assignedTo}</p>
                                    <p className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-purple-500 bg-clip-text text-transparent">
                                        {currentTask.responsavelNome || t.tasks.unassigned}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 sm:mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                {t.tasks.viewDescription}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-900 dark:text-white leading-relaxed">{currentTask.descricao}</p>
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 shadow-sm ring-1 ring-primary/20">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{t.tasks.dueDate}</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(currentTask.dataInicio)} às {formatTime(currentTask.dataInicio)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 shadow-sm ring-1 ring-primary/20">
                                        <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{t.tasks.dueDate}</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(currentTask.dataFim)} às {formatTime(currentTask.dataFim)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comentários */}
                        <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-background/50 via-background/30 to-muted/30 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-4 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                {t.tasks.comments}
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                {currentTask.comentarios?.map((comentario) => (
                                    <div key={comentario.id} className="space-y-2">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-primary/20 shadow-sm ring-1 ring-primary/10">
                                                <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub((comentario as any).userAvatar || '')}`} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 text-primary">
                                                    {comentario.userName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="bg-gradient-to-br from-background/50 via-background/30 to-muted/30 rounded-lg p-2 sm:p-3 border border-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{comentario.userName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comentario.texto}</p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {formatDate(comentario.dataCriacao)} às {formatTime(comentario.dataCriacao)}
                                                    </p>
                                                </div>
                                                {respostaComentario?.id === comentario.id ? (
                                                    <div className="mt-2 space-y-2">
                                                        <Textarea
                                                            value={respostaComentario.texto}
                                                            onChange={(e) => setRespostaComentario({ ...respostaComentario, texto: e.target.value })}
                                                            placeholder={t.tasks.replyPlaceholder}
                                                            className="bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setRespostaComentario(null)}
                                                                className="hover:bg-muted/50 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                            >
                                                                {t.tasks.cancel}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleReplyComment(comentario.id)}
                                                                className="bg-gradient-to-r from-primary via-primary/90 to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/20"
                                                            >
                                                                {t.tasks.send}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-1 text-primary hover:text-primary/80 hover:bg-primary/10 shadow-sm hover:shadow-md transition-shadow duration-200"
                                                        onClick={() => setRespostaComentario({ id: comentario.id, texto: '' })}
                                                    >
                                                        {t.tasks.reply}
                                                    </Button>
                                                )}
                                                {/* Exibir respostas */}
                                                {comentario.respostas && comentario.respostas.length > 0 && (
                                                    <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/20">
                                                        {comentario.respostas.map((resposta) => (
                                                            <div key={resposta.id} className="flex items-start gap-2">
                                                                <Avatar className="h-6 w-6 border border-primary/20 shadow-sm ring-1 ring-primary/10">
                                                                    <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub((resposta as any).userAvatar || '')}`} />
                                                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 text-primary">
                                                                        {resposta.userName[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="bg-gradient-to-br from-background/50 via-background/30 to-muted/30 rounded-lg p-2 border border-primary/10 shadow-sm">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{resposta.userName}</p>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resposta.texto}</p>
                                                                        <p className="text-xs text-muted-foreground mt-2">
                                                                            {formatDate(resposta.dataCriacao)} às {formatTime(resposta.dataCriacao)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área de novo comentário - fixa na parte inferior */}
                <div className="mt-3 sm:mt-4 space-y-3 flex-shrink-0 border-t border-primary/10 pt-3 sm:pt-4 px-2 sm:px-4">
                    <div className="relative">
                        <Textarea
                            value={novoComentario}
                            onChange={(e) => setNovoComentario(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t.tasks.addComment}
                            className="min-h-[80px] pr-24 bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-sm hover:shadow-md transition-shadow duration-200"
                        />
                        <div className="absolute bottom-2 right-2">
                            <Button
                                onClick={handleAddComment}
                                className="bg-gradient-to-r from-primary via-primary/90 to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/20 text-sm sm:text-base"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {t.tasks.send}
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="hover:bg-muted/50 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm sm:text-base"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t.tasks.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 text-sm sm:text-base"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.tasks.delete}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsModal; 