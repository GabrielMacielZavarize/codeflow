import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Task, getTaskById, updateTask, deleteTask } from '../services/taskService';
import { getTeamMembers, TeamMember } from '../services/teamService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { Calendar, Clock, Edit, Trash2, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface TaskDetailsProps {
  task: Task;
  teamMembers: TeamMember[];
  isEditing: boolean;
  editForm: {
    title: string;
    description: string;
    priority: string;
    status: string;
    assignedTo: string;
  };
  setIsEditing: (editing: boolean) => void;
  handleEditSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteTask: () => Promise<void>;
  setEditForm: (form: any) => void;
}

const TaskView = ({ task, teamMembers }: { task: Task, teamMembers: TeamMember[] }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Get the correct locale for date formatting based on selected language
  const getLocale = () => {
    switch (language) {
      case 'es':
        return es;
      case 'en-US':
        return enUS;
      case 'pt-BR':
      default:
        return ptBR;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-priority-high text-priority-high">{t.tasks.priority.high}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-priority-medium text-priority-medium">{t.tasks.priority.medium}</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-priority-low text-priority-low">{t.tasks.priority.low}</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'pending':
        return <Badge variant="secondary">{t.tasks.status.pending}</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500">{t.tasks.status.inProgress}</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">{t.tasks.status.completed}</Badge>;
      case 'canceled':
        return <Badge variant="destructive">{t.tasks.status.canceled}</Badge>;
      default:
        return null;
    }
  };

  const findTeamMember = (id?: string) => {
    if (!id) return null;
    return teamMembers.find(member => member.id === id);
  };

  return (
    <Card className={`border-l-4 border-l-priority-${task.priority}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              {t.tasks.createdAt} {format(new Date(task.createdAt), 'PP', { locale: getLocale() })}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">{t.tasks.viewDescription}</h3>
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <span className="text-sm text-gray-500">{t.tasks.assignedTo}</span>
              <p className="font-medium">
                {task.assignedTo ? findTeamMember(task.assignedTo)?.name || t.tasks.status.undefined : t.tasks.unassigned}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <span className="text-sm text-gray-500">{t.tasks.statusLabel}</span>
              <p className="font-medium">
                {task.status === 'pending' && t.tasks.status.pending}
                {task.status === 'in_progress' && t.tasks.status.inProgress}
                {task.status === 'completed' && t.tasks.status.completed}
                {task.status === 'canceled' && t.tasks.status.canceled}
                {!task.status && t.tasks.status.undefined}
              </p>
            </div>
          </div>
        </div>

        {task.dueDate && (
          <div className="flex items-center mt-4">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <span className="text-sm text-gray-500">{t.tasks.dueDate}</span>
              <p className="font-medium">
                {format(new Date(task.dueDate), 'PP', { locale: getLocale() })}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TaskEditForm = ({ task, teamMembers, editForm, setEditForm, handleEditSubmit, setIsEditing }: TaskDetailsProps) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.tasks.editTitle}</CardTitle>
        <CardDescription>
          {t.tasks.editDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEditSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">{t.tasks.titleLabel}</label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">{t.tasks.descriptionLabel}</label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">{t.tasks.priorityLabel}</label>
                <Select
                  value={editForm.priority}
                  onValueChange={(value) => setEditForm({ ...editForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t.tasks.priority.low}</SelectItem>
                    <SelectItem value="medium">{t.tasks.priority.medium}</SelectItem>
                    <SelectItem value="high">{t.tasks.priority.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">{t.tasks.statusLabel}</label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t.tasks.status.pending}</SelectItem>
                    <SelectItem value="in_progress">{t.tasks.status.inProgress}</SelectItem>
                    <SelectItem value="completed">{t.tasks.status.completed}</SelectItem>
                    <SelectItem value="canceled">{t.tasks.status.canceled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium mb-1">{t.tasks.assignLabel}</label>
              <Select
                value={editForm.assignedTo}
                onValueChange={(value) => setEditForm({ ...editForm, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">{t.tasks.unassigned}</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CardFooter className="px-0 pt-6">
            <Button type="submit" className="mr-2">{t.tasks.saveChanges}</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>{t.tasks.cancel}</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

const TaskDetailsLoading = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">{t.general.loading}</span>
      </div>
    </div>
  );
};

const TaskDetailsNotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">{t.tasks.notFound}</h2>
        <p className="mt-2 text-gray-500">{t.tasks.notFoundDescription}</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>
          {t.tasks.back}
        </Button>
      </div>
    </div>
  );
};

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [task, setTask] = useState<Task | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assignedTo: ''
  });

  useEffect(() => {
    const loadTaskAndTeam = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error('Task ID not provided');
        }

        const [taskData, teamData] = await Promise.all([
          getTaskById(id),
          getTeamMembers()
        ]);

        setTask(taskData);
        setTeamMembers(teamData);
        setEditForm({
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority,
          status: taskData.status || '',
          assignedTo: taskData.assignedTo || ''
        });
      } catch (error) {
        console.error('Error loading task:', error);
        toast.error(t.tasks.errorLoading);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadTaskAndTeam();
  }, [id, navigate, t]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const updatedTask = await updateTask(task.id, {
        ...task,
        ...editForm
      });

      setTask(updatedTask);
      setIsEditing(false);
      toast.success(t.tasks.updateSuccess);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(t.tasks.updateError);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      toast.success(t.tasks.deleteSuccess);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(t.tasks.deleteError);
    }
  };

  if (loading) {
    return <TaskDetailsLoading />;
  }

  if (!task) {
    return <TaskDetailsNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t.tasks.title}</h1>
          <p className="text-gray-600">
            {t.tasks.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? t.tasks.cancel : t.tasks.edit}
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t.tasks.delete}
          </Button>
        </div>
      </div>

      {!isEditing ? (
        <TaskView task={task} teamMembers={teamMembers} />
      ) : (
        <TaskEditForm
          task={task}
          teamMembers={teamMembers}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleEditSubmit={handleEditSubmit}
          handleDeleteTask={handleDeleteTask}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default TaskDetails;
