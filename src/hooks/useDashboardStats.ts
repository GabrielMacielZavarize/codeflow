import { useMemo } from 'react';
import { Tarefa } from '@/lib/firebase/tarefas';
import { MembroEquipe } from '@/lib/firebase/membros';

interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    completionRate: number;
    averageTasksPerMember: number;
    membersWithMostTasks: Array<{
        member: MembroEquipe;
        taskCount: number;
    }>;
    tasksByPriority: {
        alta: number;
        media: number;
        baixa: number;
    };
    tasksByStatus: {
        pendente: number;
        em_progresso: number;
        concluida: number;
        duvida: number;
    };
}

export const useDashboardStats = (tasks: Tarefa[], members: MembroEquipe[]): DashboardStats => {
    return useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'concluida').length;
        const pendingTasks = tasks.filter(task => task.status === 'pendente').length;
        const inProgressTasks = tasks.filter(task => task.status === 'em_progresso').length;

        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const averageTasksPerMember = members.length > 0 ? totalTasks / members.length : 0;

        // Membros com mais tarefas
        const memberTaskCounts = members.map(member => ({
            member,
            taskCount: tasks.filter(task => task.responsavelId === member.id).length
        }));

        const membersWithMostTasks = memberTaskCounts
            .sort((a, b) => b.taskCount - a.taskCount)
            .slice(0, 3);

        // Tarefas por prioridade
        const tasksByPriority = {
            alta: tasks.filter(task => task.prioridade === 'alta').length,
            media: tasks.filter(task => task.prioridade === 'media').length,
            baixa: tasks.filter(task => task.prioridade === 'baixa').length
        };

        // Tarefas por status
        const tasksByStatus = {
            pendente: tasks.filter(task => task.status === 'pendente').length,
            em_progresso: tasks.filter(task => task.status === 'em_progresso').length,
            concluida: tasks.filter(task => task.status === 'concluida').length,
            duvida: tasks.filter(task => task.status === 'duvida').length
        };

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            completionRate,
            averageTasksPerMember,
            membersWithMostTasks,
            tasksByPriority,
            tasksByStatus
        };
    }, [tasks, members]);
}; 