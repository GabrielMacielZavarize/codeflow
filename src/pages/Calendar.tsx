import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, Task } from '../services/taskService';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { AddTaskModal } from '@/components/AddTaskModal';
import TaskDetails from '../components/TaskDetails';
import { onSnapshot, collection, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { membrosService, MembroEquipe } from '@/lib/firebase/membros';
import { tarefasService } from '@/lib/firebase/tarefas';
import { CalendarHeader, CalendarGrid } from '@/components/calendar';

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

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      if (statusFilter === 'atrasada') {
        const hoje = new Date();
        return task.dataFim && task.dataFim < hoje && task.status !== 'concluida';
      }

      return true;
    });
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

  const handleNewTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const tarefaData = {
        ...taskData,
        concluida: taskData.status === 'concluida',
        titulo: taskData.titulo,
        userEmail: currentUser?.email || '',
        responsavelNome: getResponsavelNome(taskData.responsavelId || ''),
        responsavelId: taskData.responsavelId || '',
        status: taskData.status === 'atrasada' ? 'pendente' : taskData.status,
        dataInicio: taskData.dataInicio || new Date(),
        dataFim: taskData.dataFim || null
      };
      const novaTarefa = await tarefasService.criarTarefa(tarefaData);
      if (!novaTarefa.id) {
        throw new Error('Tarefa criada sem ID');
      }
      toast.success('Tarefa criada com sucesso!');
      setIsAddTaskModalOpen(false);
      setSelectedDate(null);
      return true;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
      return false;
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
          <CalendarHeader
            currentDate={currentDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            onAddTask={() => {
              setSelectedDate(null);
              setIsAddTaskModalOpen(true);
            }}
            priorityFilter={priorityFilter}
            statusFilter={statusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onStatusFilterChange={setStatusFilter}
            translations={t.calendar}
          />
          <CalendarGrid
            daysInMonth={daysInMonth}
            dayOfWeek={dayOfWeek}
            getTasksForDay={getTasksForDay}
            onDayClick={handleDayClick}
            onTaskClick={handleTaskClick}
          />
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
