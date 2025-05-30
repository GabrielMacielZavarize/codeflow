import { useState, useEffect } from 'react';
import { Tarefa } from '@/lib/firebase/tarefas';
import { tarefasService } from '@/lib/firebase/tarefas';
import { toast } from '@/components/ui/sonner';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Tarefa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = tarefasService.obterTarefasEmTempoReal((tarefas) => {
            setTasks(tarefas);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addTask = async (task: Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
        try {
            const newTask = await tarefasService.criarTarefa(task);
            toast.success('Tarefa criada com sucesso!');
            return newTask;
        } catch (err) {
            setError('Erro ao criar tarefa');
            toast.error('Erro ao criar tarefa');
            throw err;
        }
    };

    const updateTask = async (taskId: string, updates: Partial<Tarefa>) => {
        try {
            const updatedTask = await tarefasService.atualizarTarefa(taskId, updates);
            toast.success('Tarefa atualizada com sucesso!');
            return updatedTask;
        } catch (err) {
            setError('Erro ao atualizar tarefa');
            toast.error('Erro ao atualizar tarefa');
            throw err;
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await tarefasService.deletarTarefa(taskId);
            toast.success('Tarefa excluída com sucesso!');
        } catch (err) {
            setError('Erro ao excluir tarefa');
            toast.error('Erro ao excluir tarefa');
            throw err;
        }
    };

    const getTasksByStatus = (status: Tarefa['status']) => {
        return tasks.filter(task => task.status === status);
    };

    const getTasksByMember = (memberId: string) => {
        return tasks.filter(task => task.responsavelId === memberId);
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
        getTasksByMember
    };
}; 