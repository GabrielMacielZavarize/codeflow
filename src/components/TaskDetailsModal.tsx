import React, { useState, useEffect } from 'react';
import { Tarefa, Comentario } from '../lib/firebase/tarefas';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, User, FileText, Tag, CalendarClock, Trash2, MessageSquare } from 'lucide-react';
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
import { teamMembers } from '@/lib/firebase/teamMembers';
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentTask.titulo}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {t.tasks.description}
                    </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {/* Status e Prioridade */}
                        <div className="flex items-center space-x-4">
                            <Badge className={getPriorityColor(currentTask.prioridade || '')}>
                                {getPriorityLabel(currentTask.prioridade || '')}
                            </Badge>
                            <Select
                                value={currentTask.status}
                                onValueChange={(value: Tarefa['status']) => handleStatusChange(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t.tasks.statusLabel} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendente">{t.tasks.status.pending}</SelectItem>
                                    <SelectItem value="em_progresso">{t.tasks.status.inProgress}</SelectItem>
                                    <SelectItem value="concluida">{t.tasks.status.completed}</SelectItem>
                                    <SelectItem value="duvida">{t.tasks.status.canceled}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Responsável */}
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(currentTask.responsavelAvatar)}`} />
                                <AvatarFallback>{currentTask.responsavelNome?.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.tasks.assignedTo}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {currentTask.responsavelNome || t.tasks.unassigned}
                                </p>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t.tasks.viewDescription}</h3>
                            <p className="text-gray-900 dark:text-white">{currentTask.descricao}</p>
                        </div>

                        {/* Progresso */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.tasks.progress}</h3>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{currentTask.concluida ? '100' : '0'}%</span>
                            </div>
                            <Progress value={currentTask.concluida ? 100 : 0} className="h-2" />
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.tasks.dueDate}</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(currentTask.dataInicio)} às {formatTime(currentTask.dataInicio)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CalendarClock className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.tasks.dueDate}</p>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(currentTask.dataFim)} às {formatTime(currentTask.dataFim)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comentários */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">{t.tasks.comments}</h3>
                            <div className="space-y-4">
                                {currentTask.comentarios?.map((comentario) => (
                                    <div key={comentario.id} className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(comentario.userAvatar)}`} />
                                                <AvatarFallback>{comentario.userName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{comentario.userName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{comentario.texto}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(comentario.dataCriacao)} às {formatTime(comentario.dataCriacao)}
                                                    </p>
                                                </div>
                                                {!respostaComentario || respostaComentario.id !== comentario.id ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-1"
                                                        onClick={() => setRespostaComentario({ id: comentario.id, texto: '' })}
                                                    >
                                                        {t.tasks.reply}
                                                    </Button>
                                                ) : (
                                                    <div className="mt-2 space-y-2">
                                                        <Textarea
                                                            value={respostaComentario.texto}
                                                            onChange={(e) => setRespostaComentario({ ...respostaComentario, texto: e.target.value })}
                                                            placeholder={t.tasks.replyPlaceholder}
                                                        />
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setRespostaComentario(null)}
                                                            >
                                                                {t.tasks.cancel}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleReplyComment(comentario.id)}
                                                            >
                                                                {t.tasks.send}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                {comentario.respostas?.map((resposta) => (
                                                    <div key={resposta.id} className="ml-8 mt-2">
                                                        <div className="flex items-start space-x-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(resposta.userAvatar)}`} />
                                                                <AvatarFallback>{resposta.userName[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{resposta.userName}</p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{resposta.texto}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {formatDate(resposta.dataCriacao)} às {formatTime(resposta.dataCriacao)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Área de novo comentário - fixa na parte inferior */}
                <div className="mt-4 space-y-2 flex-shrink-0 border-t pt-4">
                    <Textarea
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        placeholder={t.tasks.addComment}
                        className="min-h-[80px]"
                    />
                    <div className="flex justify-between items-center">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.tasks.delete}
                        </Button>
                        <Button onClick={handleAddComment}>{t.tasks.send}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsModal; 