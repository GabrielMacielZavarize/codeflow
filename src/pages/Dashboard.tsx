import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Tarefa } from '../lib/firebase/tarefas';
import { TaskList } from '../components/TaskList';
import { AddTaskModal } from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckCircle2, AlertCircle, Users, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Filter, Star, User, Calendar, HelpCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TeamMemberModal from '@/components/TeamMemberModal';
import { tarefasService } from '@/lib/firebase/tarefas';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { membrosService, MembroEquipe } from '@/lib/firebase/membros';
import { AddMemberModal } from '@/components/AddMemberModal';
import { extrairUsernameGithub, getDifficultyColor } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

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
  const [filterPriority, setFilterPriority] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [filterMember, setFilterMember] = useState<string>('todos');
  const [overviewPriorityFilter, setOverviewPriorityFilter] = useState<string>('todas');
  const [overviewStatusFilter, setOverviewStatusFilter] = useState<string>('todas');
  const [teamMembers, setTeamMembers] = useState<MembroEquipe[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const teamMembersMock = [
    {
      id: 1,
      name: 'Gabriel M.',
      role: 'Desenvolvedor Frontend',
      tasks: 5,
      isNew: true,
      joinDate: new Date('2024-03-15'),
      avatar: 'https://unavatar.io/github/GabrielMacielZavarize',
      email: 'gabrielmzavarize@gmail.com',
      bio: 'Desenvolvedor Frontend apaixonado por criar interfaces modernas e intuitivas. Especialista em React, TypeScript e UI/UX.',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX']
    },
    {
      id: 2,
      name: 'Pedro H.',
      role: 'Desenvolvedor Backend',
      tasks: 3,
      isNew: false,
      joinDate: new Date('2024-02-01'),
      avatar: 'https://unavatar.io/github/PedroHarter',
      email: 'pedro.henrique@codeflow.com',
      bio: 'Desenvolvedor Backend com foco em arquitetura de sistemas escaláveis. Experiência em Node.js, Python e arquitetura de microsserviços.',
      skills: ['Node.js', 'Python', 'Docker', 'AWS', 'MongoDB']
    },
    {
      id: 3,
      name: 'Wilian V.',
      role: 'Designer',
      tasks: 4,
      isNew: true,
      joinDate: new Date('2024-03-10'),
      avatar: 'https://unavatar.io/github/WilianVieiraF',
      email: 'wilian.viana@codeflow.com',
      bio: 'Designer criativo com foco em experiência do usuário e interfaces modernas. Especialista em Figma e design systems.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototipagem']
    },
    {
      id: 4,
      name: 'Alexandre',
      role: 'Product Manager',
      tasks: 2,
      isNew: false,
      joinDate: new Date('2024-01-15'),
      avatar: 'https://unavatar.io/github/xandetds',
      email: 'maria.silva@codeflow.com',
      bio: 'Product Manager com experiência em gestão de produtos digitais e metodologias ágeis. Foco em entregar valor ao usuário final.',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management']
    },
    {
      id: 5,
      name: 'Pedro C.',
      role: 'QA Engineer',
      tasks: 6,
      isNew: false,
      joinDate: new Date('2024-02-20'),
      avatar: 'https://unavatar.io/github/PedroCanto',
      email: 'joao.pedro@codeflow.com',
      bio: 'QA Engineer especializado em testes automatizados e garantia de qualidade. Experiência em Cypress, Jest e metodologias de teste.',
      skills: ['Testes Automatizados', 'Cypress', 'Jest', 'CI/CD', 'Qualidade de Software']
    }
  ];

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
        setIsLoadingMembers(true);
        await membrosService.inicializarMembrosPadrao();

        // Adicionar listener em tempo real para os membros
        const membrosRef = collection(db, 'membros');
        const unsubscribe = onSnapshot(membrosRef, (snapshot) => {
          const membrosAtualizados = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            nome: doc.data().nome || 'Sem nome',
            cargo: doc.data().cargo || 'Sem cargo',
            tarefas: doc.data().tarefas || 0,
            isNew: doc.data().isNew || false,
            dataEntrada: doc.data().dataEntrada?.toDate() || new Date(),
            avatar: doc.data().avatar || `https://unavatar.io/github/${doc.data().nome}`,
            email: doc.data().email || '',
            bio: doc.data().bio || '',
            habilidades: doc.data().habilidades || [],
            status: doc.data().status || 'Junior'
          })) as MembroEquipe[];

          setTeamMembers(membrosAtualizados);
          setIsLoadingMembers(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
        setIsLoadingMembers(false);
      }
    };

    carregarMembros();
  }, []);

  const handleNewTask = async (taskData: Omit<Tarefa, 'id'>) => {
    try {
      const novaTarefa = await tarefasService.criarTarefa(taskData);
      if (!novaTarefa.id) {
        throw new Error('Tarefa criada sem ID');
      }
      // Não precisamos adicionar manualmente ao estado local
      // O listener do Firestore irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  };

  const handleTaskClick = (task: Tarefa) => {
    if (!task.id) {
      toast.error('Tarefa inválida (sem ID).');
      return;
    }
    setSelectedTask(task);
  };

  const handleTaskUpdated = async (taskId: string, updates: Partial<Tarefa>) => {
    const updatesConvertidos = {
      ...updates,
      dataAtualizacao: updates.dataAtualizacao instanceof Date ? updates.dataAtualizacao : new Date(updates.dataAtualizacao),
      ...(updates.dataInicio && {
        dataInicio: updates.dataInicio instanceof Date ? updates.dataInicio : new Date(updates.dataInicio)
      }),
      ...(updates.dataFim && {
        dataFim: updates.dataFim instanceof Date ? updates.dataFim : new Date(updates.dataFim)
      }),
      ...(updates.comentarios && {
        comentarios: updates.comentarios.map((comentario: any) => ({
          ...comentario,
          dataCriacao: comentario.dataCriacao instanceof Date ? comentario.dataCriacao : new Date(comentario.dataCriacao),
          respostas: comentario.respostas?.map((resposta: any) => ({
            ...resposta,
            dataCriacao: resposta.dataCriacao instanceof Date ? resposta.dataCriacao : new Date(resposta.dataCriacao)
          }))
        }))
      })
    };

    // Se o responsável da tarefa foi alterado
    if (updates.responsavelId) {
      const tarefaAtual = tasks.find(task => task.id === taskId);
      if (tarefaAtual) {
        // Decrementar o contador do responsável anterior
        const responsavelAnterior = teamMembers.find(member => member.id === tarefaAtual.responsavelId);
        if (responsavelAnterior) {
          try {
            const novoContador = Math.max(0, (responsavelAnterior.tarefas || 0) - 1);
            await membrosService.atualizarMembro(responsavelAnterior.id, {
              tarefas: novoContador
            });

            setTeamMembers(teamMembers.map(member =>
              member.id === responsavelAnterior.id
                ? { ...member, tarefas: novoContador }
                : member
            ));
          } catch (error) {
            console.error('Erro ao atualizar contador de tarefas do responsável anterior:', error);
          }
        }

        // Incrementar o contador do novo responsável
        const novoResponsavel = teamMembers.find(member => member.id === updates.responsavelId);
        if (novoResponsavel) {
          try {
            const novoContador = (novoResponsavel.tarefas || 0) + 1;
            await membrosService.atualizarMembro(novoResponsavel.id, {
              tarefas: novoContador
            });

            setTeamMembers(teamMembers.map(member =>
              member.id === novoResponsavel.id
                ? { ...member, tarefas: novoContador }
                : member
            ));
          } catch (error) {
            console.error('Erro ao atualizar contador de tarefas do novo responsável:', error);
          }
        }
      }
    }

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updatesConvertidos } : task
    ));
  };

  const handleTaskDeleted = async (taskId: string) => {
    try {
      // Encontrar a tarefa que será deletada
      const tarefaDeletada = tasks.find(t => t.id === taskId);
      if (!tarefaDeletada) return;

      // Deletar a tarefa do Firestore
      await tarefasService.deletarTarefa(taskId);

      // Atualizar o contador de tarefas do membro responsável
      if (tarefaDeletada.responsavelId) {
        const membroResponsavel = teamMembers.find(m => m.id === tarefaDeletada.responsavelId);
        if (membroResponsavel) {
          const membroAtualizado = {
            ...membroResponsavel,
            tarefas: Math.max(0, (membroResponsavel.tarefas || 0) - 1)
          };
          await membrosService.atualizarMembro(membroResponsavel.id, membroAtualizado);

          // Atualizar o estado local dos membros
          setTeamMembers(prevMembers =>
            prevMembers.map(m =>
              m.id === membroResponsavel.id ? membroAtualizado : m
            )
          );
        }
      }

      // Atualizar o estado local
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'todas' || task.prioridade === filterPriority;
    const matchesStatus = filterStatus === 'todas' ||
      (filterStatus === 'concluidas' && task.status === 'concluida') ||
      (filterStatus === 'pendentes' && task.status === 'pendente') ||
      (filterStatus === 'em_progresso' && task.status === 'em_progresso') ||
      (filterStatus === 'duvida' && task.status === 'duvida');
    const matchesMember = filterMember === 'todos' || task.responsavelId === filterMember;
    return matchesPriority && matchesStatus && matchesMember;
  });

  const overviewTasks = tasks.filter(task => {
    const matchesPriority = overviewPriorityFilter === 'todas' || task.prioridade === overviewPriorityFilter;
    const matchesStatus = overviewStatusFilter === 'todas' ||
      (overviewStatusFilter === 'concluidas' && task.status === 'concluida') ||
      (overviewStatusFilter === 'pendentes' && task.status === 'pendente') ||
      (overviewStatusFilter === 'em_progresso' && task.status === 'em_progresso') ||
      (overviewStatusFilter === 'duvida' && task.status === 'duvida');
    return matchesPriority && matchesStatus;
  });

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
      if (isNaN(dateObj.getTime())) return 'Data inválida';
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const formatTime = (date: Date | string | undefined) => {
    if (!date) return '';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return '';
    }
  };

  const stats = [
    {
      title: 'Tarefas Concluídas',
      value: tasks.filter(t => t.status === 'concluida').length.toString(),
      change: `${((tasks.filter(t => t.status === 'concluida').length / tasks.length) * 100).toFixed(0)}%`,
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-green-500',
      onClick: () => setOverviewStatusFilter('concluidas')
    },
    {
      title: 'Tarefas Pendentes',
      value: tasks.filter(t => t.status === 'pendente').length.toString(),
      change: `${((tasks.filter(t => t.status === 'pendente').length / tasks.length) * 100).toFixed(0)}%`,
      trend: 'down',
      icon: AlertCircle,
      color: 'text-yellow-500',
      onClick: () => setOverviewStatusFilter('pendentes')
    },
    {
      title: 'Em Progresso',
      value: tasks.filter(t => t.status === 'em_progresso').length.toString(),
      change: `${((tasks.filter(t => t.status === 'em_progresso').length / tasks.length) * 100).toFixed(0)}%`,
      trend: 'up',
      icon: Clock,
      color: 'text-blue-500',
      onClick: () => setOverviewStatusFilter('em_progresso')
    },
    {
      title: 'Com Dúvida',
      value: tasks.filter(t => t.status === 'duvida').length.toString(),
      change: `${((tasks.filter(t => t.status === 'duvida').length / tasks.length) * 100).toFixed(0)}%`,
      trend: 'down',
      icon: AlertCircle,
      color: 'text-orange-500',
      onClick: () => setOverviewStatusFilter('duvida')
    }
  ];

  const handleAddMember = async (novoMembro: Omit<MembroEquipe, 'id'>) => {
    try {
      const membro = await membrosService.adicionarMembro(novoMembro);
      setTeamMembers([...teamMembers, membro]);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
    }
  };

  const handleUpdateMember = async (id: string, dados: Partial<MembroEquipe>) => {
    try {
      await membrosService.atualizarMembro(id, dados);
      setTeamMembers(teamMembers.map(membro =>
        membro.id === id ? { ...membro, ...dados } : membro
      ));
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await membrosService.removerMembro(id);
      setTeamMembers(teamMembers.filter(membro => membro.id !== id));
    } catch (error) {
      console.error('Erro ao remover membro:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white animate-slide-up">
            {t.dashboard.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 animate-slide-up delay-100">
            {t.dashboard.description}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 animate-slide-up delay-200 w-full sm:w-auto" onClick={() => setIsAddTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.dashboard.addTask}
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={`stat-${stat.title}`}
            className={`animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${stat.onClick ? 'hover:shadow-lg' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={stat.onClick}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </h2>
                </div>
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4 animate-fade-in delay-300" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800 w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="overview" className="whitespace-nowrap">{t.dashboard.overviewShort}</TabsTrigger>
          <TabsTrigger value="tasks" className="whitespace-nowrap">{t.dashboard.tasksShort}</TabsTrigger>
          <TabsTrigger value="team" className="whitespace-nowrap">{t.dashboard.teamShort}</TabsTrigger>
          <TabsTrigger value="analytics" className="whitespace-nowrap">{t.navigation.analytics}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4 animate-slide-up delay-400">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t.dashboard.projectProgress}</CardTitle>
                <CardDescription>
                  {t.dashboard.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {overviewTasks.map((task, index) => (
                    <div
                      key={`overview-task-${task.id || task.titulo || index}`}
                      className="space-y-2 animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 sm:p-4 rounded-lg transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.responsavelAvatar?.startsWith('https://') ? task.responsavelAvatar : `https://unavatar.io/github/${task.responsavelAvatar}`} />
                            <AvatarFallback>{task.responsavelNome?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{task.titulo}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Responsável: {task.responsavelNome || 'Não atribuído'}
                              </p>
                              {task.dataCriacao && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  • Criada em: {formatDate(task.dataCriacao)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getPriorityColor(task.prioridade || '')}>
                            {getPriorityLabel(task.prioridade || '')}
                          </Badge>
                          <Badge variant="secondary" className={
                            task.status === 'concluida' ? 'bg-green-100 text-green-800' :
                              task.status === 'em_progresso' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'duvida' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                          }>
                            {task.status === 'concluida' ? 'Concluída' :
                              task.status === 'em_progresso' ? 'Em Progresso' :
                                task.status === 'duvida' ? 'Com Dúvida' :
                                  'Pendente'}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={task.concluida ? 100 : 0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-3 animate-slide-up delay-500">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{t.dashboard.recentActivity}</CardTitle>
                <CardDescription>
                  {t.dashboard.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {tasks
                    .sort((a, b) => {
                      const dataA = a.dataAtualizacao instanceof Date ? a.dataAtualizacao : new Date(a.dataAtualizacao);
                      const dataB = b.dataAtualizacao instanceof Date ? b.dataAtualizacao : new Date(b.dataAtualizacao);
                      return dataB.getTime() - dataA.getTime();
                    })
                    .slice(0, 3)
                    .map((task, index) => (
                      <div key={`recent-task-${task.id || task.titulo || index}`} className="flex items-start space-x-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="p-2 rounded-full bg-primary/10">
                          {task.status === 'concluida' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : task.status === 'em_progresso' ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : task.status === 'duvida' ? (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <BarChart3 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.titulo}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {task.status === 'concluida' ? 'Concluída' :
                              task.status === 'em_progresso' ? 'Em Progresso' :
                                task.status === 'duvida' ? 'Com Dúvida' :
                                  'Pendente'} • {formatDate(task.dataAtualizacao)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos os status</SelectItem>
                  <SelectItem value="pendentes">Pendente</SelectItem>
                  <SelectItem value="em_progresso">Em Progresso</SelectItem>
                  <SelectItem value="concluidas">Concluída</SelectItem>
                  <SelectItem value="duvida">Com Dúvida</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMember} onValueChange={setFilterMember}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os membros</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setFilterPriority('todas');
                setFilterStatus('todas');
                setFilterMember('todos');
              }}
              className="shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredTasks.map((task, index) => (
              <Card
                key={`filtered-task-${task.id || task.titulo || index}`}
                className="animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.responsavelAvatar?.startsWith('https://') ? task.responsavelAvatar : `https://unavatar.io/github/${task.responsavelAvatar}`} />
                          <AvatarFallback>{task.responsavelNome?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{task.titulo}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.descricao}</p>
                          {(!task.id) && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">Sem ID</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          Criada em {formatDate(task.dataCriacao)}
                        </Badge>
                        {task.dataFim && (
                          <Badge variant="outline" className="text-xs">
                            Prazo: {formatDate(task.dataFim)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getPriorityColor(task.prioridade)}>
                          {getPriorityLabel(task.prioridade)}
                        </Badge>
                        <Badge variant="secondary" className={
                          task.status === 'concluida' ? 'bg-green-100 text-green-800' :
                            task.status === 'em_progresso' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'duvida' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                        }>
                          {task.status === 'concluida' ? 'Concluída' :
                            task.status === 'em_progresso' ? 'Em Progresso' :
                              task.status === 'duvida' ? 'Com Dúvida' :
                                'Pendente'}
                        </Badge>
                      </div>
                      <Progress
                        value={task.status === 'concluida' ? 100 :
                          task.status === 'em_progresso' ? 50 : 0}
                        className="w-[100px] h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma tarefa encontrada com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Membros da Equipe</h2>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingMembers ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Carregando membros da equipe...</p>
              </div>
            ) : (
              teamMembers.map((member, index) => {
                const tarefasDoMembro = tasks.filter(task => task.responsavelId === member.id);
                return (
                  <Card
                    key={`member-${member.id}`}
                    className={`animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${member.isNew ? 'border-green-500' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarImage src={member.avatar?.startsWith('https://') ? member.avatar : `https://unavatar.io/github/${member.avatar}`} />
                          <AvatarFallback>{member.nome?.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{member.nome}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{member.cargo}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {tarefasDoMembro.length} tarefas atribuídas
                            </p>
                            <p className="text-xs text-gray-400">
                              Entrou em {formatDate(member.dataEntrada)}
                            </p>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Habilidades</h4>
                            <div className="flex flex-wrap gap-1">
                              {member.habilidades?.slice(0, 3).map((skill, index) => (
                                <Badge key={`skill-${member.id}-${index}`} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.habilidades && member.habilidades.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.habilidades.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Distribuição de Prioridades */}
            <Card className="animate-slide-up">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Distribuição de Prioridades</span>
                </CardTitle>
                <CardDescription>
                  Análise das tarefas por nível de prioridade
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {[
                    {
                      label: 'Alta Prioridade',
                      value: tasks.filter(t => t.prioridade === 'alta').length,
                      color: 'text-red-500',
                      bgColor: 'bg-red-500',
                      total: tasks.length,
                      icon: AlertCircle
                    },
                    {
                      label: 'Média Prioridade',
                      value: tasks.filter(t => t.prioridade === 'media').length,
                      color: 'text-yellow-500',
                      bgColor: 'bg-yellow-500',
                      total: tasks.length,
                      icon: Clock
                    },
                    {
                      label: 'Baixa Prioridade',
                      value: tasks.filter(t => t.prioridade === 'baixa').length,
                      color: 'text-green-500',
                      bgColor: 'bg-green-500',
                      total: tasks.length,
                      icon: CheckCircle2
                    }
                  ].map((item) => (
                    <div key={`priority-${item.label}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${item.color} bg-opacity-10`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                          <span className="text-xs text-gray-500">
                            ({((item.value / item.total) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(item.value / item.total) * 100}
                        className={`h-2 ${item.bgColor.replace('bg-', 'bg-opacity-20 ')}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status das Tarefas */}
            <Card className="animate-slide-up">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Status das Tarefas</span>
                </CardTitle>
                <CardDescription>
                  Distribuição atual do status das tarefas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {[
                    {
                      label: 'Concluídas',
                      value: tasks.filter(t => t.status === 'concluida').length,
                      color: 'text-green-500',
                      bgColor: 'bg-green-500',
                      total: tasks.length,
                      icon: CheckCircle2
                    },
                    {
                      label: 'Em Progresso',
                      value: tasks.filter(t => t.status === 'em_progresso').length,
                      color: 'text-blue-500',
                      bgColor: 'bg-blue-500',
                      total: tasks.length,
                      icon: Clock
                    },
                    {
                      label: 'Pendentes',
                      value: tasks.filter(t => t.status === 'pendente').length,
                      color: 'text-yellow-500',
                      bgColor: 'bg-yellow-500',
                      total: tasks.length,
                      icon: AlertCircle
                    },
                    {
                      label: 'Com Dúvida',
                      value: tasks.filter(t => t.status === 'duvida').length,
                      color: 'text-orange-500',
                      bgColor: 'bg-orange-500',
                      total: tasks.length,
                      icon: HelpCircle
                    }
                  ].map((item) => (
                    <div key={`status-${item.label}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${item.color} bg-opacity-10`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                          <span className="text-xs text-gray-500">
                            ({((item.value / item.total) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(item.value / item.total) * 100}
                        className={`h-2 ${item.bgColor.replace('bg-', 'bg-opacity-20 ')}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desempenho da Equipe */}
            <Card className="animate-slide-up">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Desempenho da Equipe</span>
                </CardTitle>
                <CardDescription>
                  Taxa de conclusão de tarefas por membro
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {teamMembers.map((member) => {
                    const tarefasDoMembro = tasks.filter(t => t.responsavelId === member.id);
                    const tarefasConcluidas = tarefasDoMembro.filter(t => t.status === 'concluida').length;
                    const taxaConclusao = tarefasDoMembro.length > 0
                      ? (tarefasConcluidas / tarefasDoMembro.length) * 100
                      : 0;

                    return (
                      <div key={`member-${member.id}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar?.startsWith('https://') ? member.avatar : `https://unavatar.io/github/${member.avatar}`} />
                              <AvatarFallback>{member.nome?.split(' ')[0]?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{member.nome}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {tarefasConcluidas}/{tarefasDoMembro.length}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({taxaConclusao.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={taxaConclusao}
                          className="h-2 bg-primary bg-opacity-20"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
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
