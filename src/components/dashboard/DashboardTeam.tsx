import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MembroEquipe } from '@/lib/firebase/membros';
import { Tarefa } from '@/lib/firebase/tarefas';
import { useLanguage } from '@/contexts/LanguageContext';
import { extrairUsernameGithub } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DashboardTeamProps {
    members: MembroEquipe[];
    tasks: Tarefa[];
    onMemberClick: (member: MembroEquipe) => void;
}

export const DashboardTeam: React.FC<DashboardTeamProps> = ({
    members,
    tasks,
    onMemberClick
}) => {
    const { t } = useLanguage();

    const getMemberTasks = (memberId: string) => {
        return tasks.filter(task => task.responsavelId === memberId);
    };

    const getMemberProgress = (memberId: string) => {
        const memberTasks = getMemberTasks(memberId);
        if (memberTasks.length === 0) return 0;
        const completedTasks = memberTasks.filter(task => task.status === 'concluida').length;
        return (completedTasks / memberTasks.length) * 100;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'offline':
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'ausente':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
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
        hidden: { opacity: 0, x: 20 },
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
                        {t.dashboard.team.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 grid-cols-1 sm:grid-cols-2"
                    >
                        {members.map((member) => {
                            const progress = getMemberProgress(member.id);
                            const memberTasks = getMemberTasks(member.id);

                            return (
                                <motion.div
                                    key={member.id}
                                    variants={item}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
                                    onClick={() => onMemberClick(member)}
                                >
                                    <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary/10">
                                        <AvatarImage src={member.avatar} alt={member.nome} />
                                        <AvatarFallback>
                                            {extrairUsernameGithub(member.nome)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium leading-none truncate">
                                                {member.nome}
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className={`${getStatusColor(member.status)} text-xs shrink-0`}
                                            >
                                                {member.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate mt-1">
                                            {member.cargo}
                                        </p>
                                        <div className="space-y-1.5 mt-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">{t.dashboard.team.tasks}</span>
                                                <span className="font-medium">{memberTasks.length}</span>
                                            </div>
                                            <Progress value={progress} className="h-1.5" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}; 