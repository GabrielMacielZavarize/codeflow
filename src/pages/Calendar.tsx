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
import AddTaskModal from '../components/AddTaskModal';
import TaskDetails from '../components/TaskDetails';

const Calendar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          console.log('Fetching tasks for user:', currentUser.uid);
          const tasksData = await getTasks(currentUser.uid);
          console.log('Tasks fetched:', tasksData);
          setTasks(tasksData);
        } else {
          console.log('No current user found');
          // Para desenvolvimento, carregar tarefas mesmo sem usuário
          const tasksData = await getTasks('mock-user-id');
          console.log('Mock tasks loaded:', tasksData);
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        toast.error(t.calendar.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser, t]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const dayOfWeek = getDay(startDate);

  const getTasksForDay = (date: Date) => {
    if (!tasks || tasks.length === 0) {
      console.log('No tasks available for filtering');
      return [];
    }

    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) {
        console.log('Task without due date:', task);
        return false;
      }

      const dueDate = new Date(task.dueDate);
      const isSameDate = isSameDay(dueDate, date);

      if (!isSameDate) return false;

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      return true;
    });

    console.log(`Tasks for ${format(date, 'yyyy-MM-dd')}:`, filteredTasks);
    return filteredTasks;
  };

  const getDayClass = (date: Date) => {
    let classes = 'h-32 border border-gray-200 dark:border-gray-700 p-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ';

    if (!isSameMonth(date, currentDate)) {
      classes += 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 ';
    } else {
      classes += 'bg-white dark:bg-gray-800 ';
    }

    if (isToday(date)) {
      classes += 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ';
    }

    return classes;
  };

  const handleDayClick = (day: Date) => {
    console.log('Day clicked:', format(day, 'yyyy-MM-dd'));
    setSelectedDate(day);
    setIsAddTaskModalOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
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
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const handleNewTask = (task: Task) => {
    console.log('New task added:', task);
    setTasks([...tasks, task]);
    setIsAddTaskModalOpen(false);
    setSelectedDate(null);
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

  if (selectedTask) {
    return <TaskDetails task={selectedTask} onBack={handleBack} />;
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
                  <SelectItem value="high">{t.calendar.highPriority}</SelectItem>
                  <SelectItem value="medium">{t.calendar.mediumPriority}</SelectItem>
                  <SelectItem value="low">{t.calendar.lowPriority}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] text-sm sm:text-base">
                  <SelectValue placeholder={t.calendar.filterByStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.calendar.allStatus}</SelectItem>
                  <SelectItem value="pending">{t.calendar.pending}</SelectItem>
                  <SelectItem value="in_progress">{t.calendar.inProgress}</SelectItem>
                  <SelectItem value="completed">{t.calendar.completed}</SelectItem>
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
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="ml-3 dark:text-gray-300 text-sm sm:text-base">{t.calendar.loading}</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 text-xs sm:text-sm">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                  <div
                    key={index}
                    className="p-1 sm:p-2 text-center font-semibold border-b border-gray-200 dark:border-gray-700 dark:text-gray-300"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: dayOfWeek }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="h-24 sm:h-32 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  ></div>
                ))}

                {daysInMonth.map((date, idx) => (
                  <div
                    key={idx}
                    className={getDayClass(date)}
                    onClick={() => handleDayClick(date)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium dark:text-gray-300 text-xs sm:text-sm">
                        {format(date, 'd')}
                      </span>
                      {isToday(date) && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-[10px] sm:text-xs">
                          {t.calendar.today}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-20 sm:max-h-24">
                      {getTasksForDay(date).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task.id);
                          }}
                          className="px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className={`font-medium truncate ${getPriorityClass(task.priority)}`}>
                            {task.title}
                          </div>
                          <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                            <Badge variant="secondary" className={`text-[10px] sm:text-xs ${getStatusClass(task.status)}`}>
                              {task.status === 'completed' ? t.calendar.completed :
                                task.status === 'in_progress' ? t.calendar.inProgress :
                                  t.calendar.pending}
                            </Badge>
                            {task.assignee && (
                              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                {task.assignee}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        initialDate={selectedDate}
        teamMembers={[
          { id: 1, name: 'user-1', role: 'Desenvolvedor' },
          { id: 2, name: 'user-2', role: 'Designer' },
          { id: 3, name: 'user-3', role: 'Gerente' },
          { id: 4, name: 'user-4', role: 'Analista' }
        ]}
      />
    </div>
  );
};

export default Calendar;
