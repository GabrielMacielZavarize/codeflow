
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, Task } from '../services/taskService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Calendar = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const tasksData = await getTasks(currentUser.uid);
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível obter as tarefas para o calendário.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [currentUser, toast]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const dayOfWeek = getDay(startDate);
  
  const getTasksForDay = (date: Date) => {
    if (!tasks) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, date);
    });
  };

  const getDayClass = (date: Date) => {
    let classes = 'h-28 border border-gray-200 dark:border-gray-700 p-1 transition-all duration-200 ';
    
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
    // Implementação futura para adicionar tarefa em um dia específico
    console.log('Dia clicado:', day);
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">Calendário de Tarefas</CardTitle>
                <CardDescription className="dark:text-gray-400">Visualize suas tarefas organizadas por data</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold dark:text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="ml-3 dark:text-gray-300">Carregando calendário...</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 text-sm">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                  <div 
                    key={index} 
                    className="p-2 text-center font-semibold border-b border-gray-200 dark:border-gray-700 dark:text-gray-300"
                  >
                    {day}
                  </div>
                ))}
                
                {/* Preenchimento para o primeiro dia do mês começar no dia correto da semana */}
                {Array.from({ length: dayOfWeek }).map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className="h-28 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  ></div>
                ))}
                
                {daysInMonth.map((date, idx) => (
                  <div
                    key={idx}
                    className={getDayClass(date)}
                    onClick={() => handleDayClick(date)}
                  >
                    <div className="font-medium text-right mb-1 dark:text-gray-300">
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-24">
                      {getTasksForDay(date).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task.id);
                          }}
                          className={`px-1 py-0.5 rounded text-xs truncate cursor-pointer ${getPriorityClass(task.priority)}`}
                        >
                          {task.title}
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
    </div>
  );
};

export default Calendar;
