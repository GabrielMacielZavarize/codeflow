import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Task, Priority } from '../services/taskService';
import { User, Mail, Calendar, Briefcase, Star, Clock, Code2, Palette, ClipboardList, Bug, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MembroEquipe } from '@/lib/firebase/membros';
import { Tarefa } from '@/lib/firebase/tarefas';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { extrairUsernameGithub } from '@/lib/utils';

interface TeamMemberModalProps {
    member: MembroEquipe | null;
    onClose: () => void;
    tasks: Tarefa[];
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
    member,
    onClose,
    tasks
}) => {
    if (!member) return null;

    const tarefasConcluidas = tasks.filter(task => task.status === 'concluida').length;
    const progresso = tasks.length > 0 ? (tarefasConcluidas / tasks.length) * 100 : 0;
    const tempoNaEmpresa = Math.floor((new Date().getTime() - new Date(member.dataEntrada).getTime()) / (1000 * 60 * 60 * 24 * 30));

    return (
        <Dialog open={!!member} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 sm:p-6">
                <DialogHeader className="p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl sm:text-2xl font-bold">Detalhes do Membro</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-4 sm:p-6 space-y-4">
                    {/* Cabeçalho com Informações Básicas */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/20">
                            <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(member.avatar)}`} />
                            <AvatarFallback className="text-xl">{member.nome?.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold">{member.nome}</h2>
                                    <p className="text-gray-500">{member.cargo}</p>
                                </div>
                                <div className="flex justify-center sm:justify-end gap-2">
                                    {member.isNew && (
                                        <Badge className="bg-green-500 text-white">
                                            Novo
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="text-sm">
                                        {member.status}
                                    </Badge>
                                </div>
                            </div>
                            {member.bio && (
                                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">{member.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Progresso das Tarefas */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Progresso das Tarefas</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Status Geral</span>
                                </div>
                                <span className="text-lg font-bold text-primary">{Math.round(progresso)}%</span>
                            </div>
                            <Progress value={progresso} className="h-2" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium">Tarefas Concluídas</p>
                                        <p className="text-xl font-bold text-green-500">{tarefasConcluidas}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <p className="text-sm font-medium">Tarefas Pendentes</p>
                                        <p className="text-xl font-bold text-orange-500">{tasks.length - tarefasConcluidas}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Habilidades */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
                        <div className="flex flex-wrap gap-2">
                            {member.habilidades?.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Tarefas Atribuídas */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Tarefas Atribuídas</h3>
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{task.titulo}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-2">{task.descricao}</p>
                                        </div>
                                        <Badge
                                            variant={task.status === 'concluida' ? 'default' : 'secondary'}
                                            className="w-fit"
                                        >
                                            {task.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && (
                                <p className="text-gray-500 text-center py-4">Nenhuma tarefa atribuída</p>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeamMemberModal; 