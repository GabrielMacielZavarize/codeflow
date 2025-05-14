import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task, Priority, getTasks } from '../services/taskService';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CheckCircle2, AlertCircle, Users, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Filter, Star, User, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TeamMemberModal from '../components/TeamMemberModal';

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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers = [
    {
      id: 1,
      name: 'Gabriel M.',
      role: 'Desenvolvedor Frontend',
      tasks: 5,
      isNew: true,
      joinDate: new Date('2024-03-15'),
      avatar: 'https://github.com/gabrielmzavarize.png',
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
      avatar: 'https://github.com/pedrohenrique.png',
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
      avatar: 'https://github.com/wilianviana.png',
      email: 'wilian.viana@codeflow.com',
      bio: 'Designer criativo com foco em experiência do usuário e interfaces modernas. Especialista em Figma e design systems.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototipagem']
    },
    {
      id: 4,
      name: 'Maria S.',
      role: 'Product Manager',
      tasks: 2,
      isNew: false,
      joinDate: new Date('2024-01-15'),
      avatar: 'https://github.com/mariasilva.png',
      email: 'maria.silva@codeflow.com',
      bio: 'Product Manager com experiência em gestão de produtos digitais e metodologias ágeis. Foco em entregar valor ao usuário final.',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management']
    },
    {
      id: 5,
      name: 'João P.',
      role: 'QA Engineer',
      tasks: 6,
      isNew: false,
      joinDate: new Date('2024-02-20'),
      avatar: 'https://github.com/joaopedro.png',
      email: 'joao.pedro@codeflow.com',
      bio: 'QA Engineer especializado em testes automatizados e garantia de qualidade. Experiência em Cypress, Jest e metodologias de teste.',
      skills: ['Testes Automatizados', 'Cypress', 'Jest', 'CI/CD', 'Qualidade de Software']
    }
  ];

  useEffect(() => {
    const loadTasks = async () => {
      if (currentUser) {
        setIsLoading(true);
        const fetchedTasks = await getTasks(currentUser.uid);
        setTasks(fetchedTasks);
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [currentUser]);

  const handleNewTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const filteredTasks = tasks.filter(task => {
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    return true;
  });

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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    {
      title: 'Tarefas Concluídas',
      value: tasks.filter(t => t.status === 'completed').length.toString(),
      change: '+12%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'text-green-500',
      onClick: () => setStatusFilter('completed')
    },
    {
      title: 'Tarefas Pendentes',
      value: tasks.filter(t => t.status === 'pending').length.toString(),
      change: '-3%',
      trend: 'down',
      icon: AlertCircle,
      color: 'text-yellow-500',
      onClick: () => setStatusFilter('pending')
    },
    {
      title: 'Membros da Equipe',
      value: teamMembers.length.toString(),
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      onClick: () => setActiveTab('team')
    },
    {
      title: 'Horas Trabalhadas',
      value: '164',
      change: '+18%',
      trend: 'up',
      icon: Clock,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white animate-slide-up">
            {t.navigation.dashboard}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 animate-slide-up delay-100">
            {t.dashboard.description}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 animate-slide-up delay-200 w-full sm:w-auto" onClick={() => setIsAddTaskModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.tasks.addTask || "Nova Tarefa"}
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
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
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="space-y-2 animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 sm:p-4 rounded-lg transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${task.assignee}`} />
                            <AvatarFallback>{task.assignee?.split(' ')[0][0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Responsável: {task.assignee}
                              </p>
                              {task.dueDate && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  • Entrega: {formatDate(task.dueDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          <Badge variant="secondary" className={task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {task.status === 'completed' ? 'Concluída' : 'Em Progresso'}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={task.progress || 0} className="h-2" />
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
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="p-2 rounded-full bg-primary/10">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Atualização de progresso
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Há {index + 1} hora{index > 0 ? 's' : ''}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      <Badge variant="secondary" className={task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {task.status === 'completed' ? 'Concluída' : 'Em Progresso'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={task.progress || 0} className="h-2 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card
                key={member.id}
                className={`animate-slide-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${member.isNew ? 'border-green-500' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ')[0][0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                        {member.isNew && (
                          <Badge className="bg-green-500 text-white">
                            Novo
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.tasks} tarefas atribuídas
                        </p>
                        <p className="text-xs text-gray-400">
                          Entrou em {formatDate(member.joinDate)}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Habilidades</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.skills?.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills && member.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Distribuição de Prioridades */}
            <Card className="animate-slide-up">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>{t.dashboard.priorityDistribution}</span>
                </CardTitle>
                <CardDescription>
                  {t.dashboard.analyticsDescription.priority}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {[
                    { label: t.dashboard.highPriority, value: tasks.filter(t => t.priority === 'high').length, color: 'bg-red-500', total: tasks.length },
                    { label: t.dashboard.mediumPriority, value: tasks.filter(t => t.priority === 'medium').length, color: 'bg-yellow-500', total: tasks.length },
                    { label: t.dashboard.lowPriority, value: tasks.filter(t => t.priority === 'low').length, color: 'bg-green-500', total: tasks.length }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                          <span className="text-xs text-gray-500">
                            ({((item.value / item.total) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(item.value / item.total) * 100}
                        className={`h-2 ${item.color.replace('bg-', 'bg-opacity-20 ')}`}
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
                  <span>{t.dashboard.taskStatus}</span>
                </CardTitle>
                <CardDescription>
                  {t.dashboard.analyticsDescription.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {[
                    { label: t.dashboard.completed, value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500', total: tasks.length },
                    { label: t.dashboard.inProgress, value: tasks.filter(t => t.status === 'in_progress').length, color: 'bg-yellow-500', total: tasks.length },
                    { label: t.dashboard.pending, value: tasks.filter(t => t.status === 'pending').length, color: 'bg-gray-500', total: tasks.length }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                          <span className="text-xs text-gray-500">
                            ({((item.value / item.total) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={(item.value / item.total) * 100}
                        className={`h-2 ${item.color.replace('bg-', 'bg-opacity-20 ')}`}
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
                  <span>{t.dashboard.teamPerformance}</span>
                </CardTitle>
                <CardDescription>
                  {t.dashboard.analyticsDescription.performance}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  {teamMembers.map((member) => {
                    const memberTasks = tasks.filter(t => t.assignee === member.name);
                    const completedTasks = memberTasks.filter(t => t.status === 'completed').length;
                    const completionRate = memberTasks.length > 0 ? (completedTasks / memberTasks.length) * 100 : 0;

                    return (
                      <div key={member.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.split(' ')[0][0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{member.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {completedTasks}/{memberTasks.length}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({completionRate.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={completionRate}
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
      />

      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        tasks={tasks}
      />
    </div>
  );
};

export default Dashboard;
