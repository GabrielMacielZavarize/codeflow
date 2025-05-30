import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tarefa } from '../lib/firebase/tarefas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { tarefasService } from '@/lib/firebase/tarefas';
import { membrosService, MembroEquipe } from '@/lib/firebase/membros';
import { AddTaskModal } from '../components/AddTaskModal';
import { AddMemberModal } from '../components/AddMemberModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import TeamMemberModal from '../components/TeamMemberModal';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardTeam } from '@/components/dashboard/DashboardTeam';
import { DashboardTasks } from '@/components/dashboard/DashboardTasks';
import { toast } from '@/components/ui/sonner';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tarefa | null>(null);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [selectedMember, setSelectedMember] = useState<MembroEquipe | null>(null);
  const [teamMembers, setTeamMembers] = useState<MembroEquipe[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = tarefasService.obterTarefasEmTempoReal((tarefasAtualizadas) => {
      setTasks(tarefasAtualizadas);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const carregarMembros = async () => {
      try {
        const membros = await membrosService.buscarMembros();
        setTeamMembers(membros);
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
        toast.error(t.team.errorAdding);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    carregarMembros();
  }, []);

  const handleNewTask = async (task: Tarefa) => {
    try {
      await tarefasService.criarTarefa(task);
      setTasks(prev => [...prev, task]);
      toast.success(t.tasks.added);
      return true;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error(t.tasks.errorAdding);
      return false;
    }
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success(t.tasks.deletadaComSucesso);
  };

  const handleTaskUpdated = async (taskId: string, updates: Partial<Tarefa>) => {
    try {
      await tarefasService.atualizarTarefa(taskId, updates);
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...updates } : task));
      toast.success(t.tasks.atualizadaComSucesso);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error(t.tasks.errorUpdating);
    }
  };

  const handleAddMember = (member: MembroEquipe) => {
    setTeamMembers(prev => [...prev, member]);
    toast.success(t.team.memberAdded);
  };

  const getDashboardStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'concluida').length;
    const pendingTasks = tasks.filter(task => task.status === 'pendente').length;
    const inProgressTasks = tasks.filter(task => task.status === 'em_progresso').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate,
      averageTasksPerMember: teamMembers.length > 0 ? totalTasks / teamMembers.length : 0,
      tasksByPriority: {
        alta: tasks.filter(task => task.prioridade === 'alta').length,
        media: tasks.filter(task => task.prioridade === 'media').length,
        baixa: tasks.filter(task => task.prioridade === 'baixa').length
      },
      tasksByStatus: {
        pendente: pendingTasks,
        em_progresso: inProgressTasks,
        concluida: completedTasks,
        duvida: tasks.filter(task => task.status === 'duvida').length
      }
    };
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <DashboardWelcome
        userName={currentUser?.displayName || 'Usuário'}
        stats={getDashboardStats()}
      />
      <DashboardHeader
        onAddTask={() => setIsAddTaskModalOpen(true)}
      />

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800 w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="overview" className="whitespace-nowrap">{t.dashboard.overviewShort}</TabsTrigger>
          <TabsTrigger value="tasks" className="whitespace-nowrap">{t.dashboard.tasksShort}</TabsTrigger>
          <TabsTrigger value="team" className="whitespace-nowrap">{t.dashboard.teamShort}</TabsTrigger>
          <TabsTrigger value="analytics" className="whitespace-nowrap">{t.navigation.analytics}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardStats stats={getDashboardStats()} />
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardTasks
              tasks={tasks.slice(0, 5)}
              onTaskClick={setSelectedTask}
            />
            <DashboardTeam
              members={teamMembers}
              tasks={tasks}
              onMemberClick={setSelectedMember}
            />
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <DashboardTasks
            tasks={tasks}
            onTaskClick={setSelectedTask}
          />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <DashboardTeam
            members={teamMembers}
            tasks={tasks}
            onMemberClick={setSelectedMember}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DashboardStats stats={getDashboardStats()} />
        </TabsContent>
      </Tabs>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleNewTask}
        teamMembers={teamMembers}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskDeleted={handleTaskDeleted}
        onTaskUpdated={handleTaskUpdated}
        teamMembers={teamMembers}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onMemberAdded={handleAddMember}
      />

      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        tasks={tasks.filter(task => task.responsavelId === selectedMember?.id)}
      />
    </div>
  );
};

export default Dashboard;
