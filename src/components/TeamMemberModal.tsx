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
import { User, Mail, Calendar, Briefcase, Star, Clock, Code2, Palette, ClipboardList, Bug } from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    tasks: number;
    isNew: boolean;
    joinDate: Date;
    avatar: string;
    email: string;
    bio: string;
    skills: string[];
}

interface TeamMemberModalProps {
    member: TeamMember | null;
    isOpen: boolean;
    onClose: () => void;
    tasks: Task[];
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, isOpen, onClose, tasks }) => {
    if (!member) return null;

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

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'desenvolvedor frontend':
                return <Code2 className="h-4 w-4" />;
            case 'desenvolvedor backend':
                return <Code2 className="h-4 w-4" />;
            case 'designer':
                return <Palette className="h-4 w-4" />;
            case 'product manager':
                return <ClipboardList className="h-4 w-4" />;
            case 'qa engineer':
                return <Bug className="h-4 w-4" />;
            default:
                return <Briefcase className="h-4 w-4" />;
        }
    };

    const memberTasks = tasks.filter(task => task.assignee === member.name);
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = memberTasks.filter(task => task.status === 'in_progress').length;
    const pendingTasks = memberTasks.filter(task => task.status === 'pending').length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ')[0][0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                {member.name}
                            </DialogTitle>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {getRoleIcon(member.role)}
                                <span>{member.role}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6">
                    {/* Informações Pessoais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>Entrou em {formatDate(member.joinDate)}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Briefcase className="h-4 w-4" />
                                <span>{member.tasks} tarefas atribuídas</span>
                            </div>
                            {member.isNew && (
                                <Badge className="bg-green-500 text-white">
                                    Novo membro
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sobre</h3>
                        <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                    </div>

                    {/* Habilidades */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Habilidades</h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-sm">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Tarefas Concluídas</span>
                                <Badge className="bg-green-500 text-white">{completedTasks}</Badge>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Em Progresso</span>
                                <Badge className="bg-yellow-500 text-white">{inProgressTasks}</Badge>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes</span>
                                <Badge className="bg-gray-500 text-white">{pendingTasks}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Tarefas Atuais */}
                    {memberTasks.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tarefas Atuais</h3>
                            <div className="space-y-2">
                                {memberTasks.map((task) => (
                                    <div key={task.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                                            </div>
                                            <Badge className={getPriorityColor(task.priority)}>
                                                {getPriorityLabel(task.priority)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TeamMemberModal; 