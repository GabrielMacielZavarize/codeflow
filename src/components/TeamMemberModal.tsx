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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">Detalhes do Membro</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Cabeçalho com Informações Básicas */}
                    <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://unavatar.io/github/${extrairUsernameGithub(member.avatar)}`} />
                            <AvatarFallback>{member.nome?.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{member.nome}</h2>
                                    <p className="text-gray-500">{member.cargo}</p>
                                </div>
                                <div className="flex gap-2">
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
                                <p className="text-gray-600 dark:text-gray-300 mt-4">{member.bio}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {member.habilidades?.map((habilidade, index) => (
                                    <Badge key={index} variant="secondary">
                                        {habilidade}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Entrou em {format(new Date(member.dataEntrada), 'dd/MM/yyyy', { locale: ptBR })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{tempoNaEmpresa} meses na empresa</span>
                                </div>
                            </div>
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
                            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progresso}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium">Tarefas Concluídas</p>
                                        <p className="text-2xl font-bold text-green-500">{tarefasConcluidas}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <p className="text-sm font-medium">Tarefas Pendentes</p>
                                        <p className="text-2xl font-bold text-orange-500">{tasks.length - tarefasConcluidas}</p>
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
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium">{task.titulo}</h4>
                                        <p className="text-sm text-gray-500">{task.descricao}</p>
                                    </div>
                                    <Badge
                                        variant={task.status === 'concluida' ? 'default' : 'secondary'}
                                        className="ml-2"
                                    >
                                        {task.status === 'concluida' ? 'Concluída' : 'Em andamento'}
                                    </Badge>
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