import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, Task } from '../services/taskService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../contexts/LanguageContext';
import { AddTaskModal } from '@/components/AddTaskModal';
import TaskDetails from '../components/TaskDetails';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { membrosService, MembroEquipe } from '@/lib/firebase/membros';
import { cn } from '@/lib/utils';
import { tarefasService } from '@/lib/firebase/tarefas';

const Calendar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<MembroEquipe[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const membros = await membrosService.buscarMembros();
        setTeamMembers(membros);
      } catch (error) {
        console.error('Erro ao carregar membros da equipe:', error);
        toast.error('Erro ao carregar membros da equipe');
      }
    };

    loadTeamMembers();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const tarefasRef = collection(db, 'tarefas');
    const q = query(tarefasRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tarefasAtualizadas = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dataCriacao: data.dataCriacao?.toDate?.() || new Date(),
          dataAtualizacao: data.dataAtualizacao?.toDate?.() || new Date(),
          dataInicio: data.dataInicio?.toDate?.() || null,
          dataFim: data.dataFim?.toDate?.() || null
        } as Task;
      });
      setTasks(tarefasAtualizadas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const dayOfWeek = getDay(startDate);

  const getTasksForDay = (date: Date) => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.filter(task => {
      const taskDate = task.dataFim || task.dataInicio;
      if (!taskDate) return false;

      const isSameDate = isSameDay(taskDate, date);
      if (!isSameDate) return false;

      if (priorityFilter !== 'all' && task.prioridade !== priorityFilter) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      if (statusFilter === 'atrasada') {
        const hoje = new Date();
        return task.dataFim && task.dataFim < hoje && task.status !== 'concluida';
      }

      return true;
    });
  };

  const getDayClass = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const dayTasks = tasks.filter(task => {
      const taskDate = task.dataFim ? new Date(task.dataFim.seconds * 1000) : null;
      return taskDate && isSameDay(day, taskDate);
    });

    const hasHighPriority = dayTasks.some(task => task.prioridade === 'alta');
    const hasMediumPriority = dayTasks.some(task => task.prioridade === 'media');
    const hasLowPriority = dayTasks.some(task => task.prioridade === 'baixa');

    return cn(
      "relative p-2 h-24 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors",
      isToday && "ring-2 ring-primary",
      hasHighPriority && "bg-red-50 dark:bg-red-900/20",
      hasMediumPriority && !hasHighPriority && "bg-yellow-50 dark:bg-yellow-900/20",
      hasLowPriority && !hasHighPriority && !hasMediumPriority && "bg-green-50 dark:bg-green-900/20",
      dayTasks.length > 0 && "hover:bg-gray-50 dark:hover:bg-gray-800"
    );
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsAddTaskModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'pendente':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'atrasada':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const handleNewTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const novaTarefa = await tarefasService.criarTarefa(taskData);
      if (!novaTarefa.id) {
        throw new Error('Tarefa criada sem ID');
      }
      toast.success('Tarefa criada com sucesso!');
      setIsAddTaskModalOpen(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBack = () => {
    setSelectedTask(null);
  };

  const getResponsavelNome = (responsavelId: string) => {
    const membro = teamMembers.find(m => m.id === responsavelId);
    return membro ? membro.nome : responsavelId;
  };

  if (selectedTask) {
    return <TaskDetails task={selectedTask} onBack={handleBack} getResponsavelNome={getResponsavelNome} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-2 sm:p-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="dark:text-white text-lg sm:text-xl">{t.calendar.title}</CardTitle>
                <CardDescription className="dark:text-gray-400 text-sm sm:text-base">{t.calendar.description}</CardDescription>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToday}
                  className="h-8 px-2 sm:h-10 sm:px-4 text-sm sm:text-base"
                >
                  {t.calendar.today}
                </Button>
                <h2 className="text-base sm:text-lg font-semibold dark:text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-4">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                  <SelectValue placeholder={t.calendar.filterByPriority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.calendar.allPriorities}</SelectItem>
                  <SelectItem value="alta">{t.calendar.highPriority}</SelectItem>
                  <SelectItem value="media">{t.calendar.mediumPriority}</SelectItem>
                  <SelectItem value="baixa">{t.calendar.lowPriority}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                  <SelectValue placeholder={t.calendar.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.calendar.allStatus}</SelectItem>
                  <SelectItem value="pendente">{t.calendar.pending}</SelectItem>
                  <SelectItem value="concluida">{t.calendar.completed}</SelectItem>
                  <SelectItem value="atrasada">{t.calendar.overdue}</SelectItem>
                  <SelectItem value="em_progresso">{t.calendar.inProgress}</SelectItem>
                  <SelectItem value="duvida">{t.calendar.doubt}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate(null);
                  setIsAddTaskModalOpen(true);
                }}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.calendar.addTask}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="bg-white dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: dayOfWeek }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-32 bg-gray-50 dark:bg-gray-800/50"
                />
              ))}
              {daysInMonth.map((day, index) => {
                const tasksForDay = getTasksForDay(day);
                return (
                  <div
                    key={index}
                    className={getDayClass(day)}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {format(day, 'd')}
                      </span>
                      {tasksForDay.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {tasksForDay.length}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 max-h-[calc(100%-2rem)] overflow-y-auto">
                      {tasksForDay.map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task.id);
                          }}
                          className={`text-xs p-1.5 rounded truncate cursor-pointer transition-colors duration-200 ${task.prioridade === 'alta'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/40'
                            : task.prioridade === 'media'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/40'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/40'
                            }`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => {
          setIsAddTaskModalOpen(false);
          setSelectedDate(null);
        }}
        onTaskAdded={handleNewTask}
        selectedDate={selectedDate}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default Calendar;
