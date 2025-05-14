
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task, Priority, getTasks } from '../services/taskService';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const { t } = useLanguage();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.navigation.dashboard}</h1>
          <p className="text-gray-600">
            {t.tasks.description}
          </p>
        </div>
        <Button onClick={() => setIsAddTaskModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t.tasks.addTask || "Nova Tarefa"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.tasks.totalTasks || "Total de Tarefas"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tasks.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.tasks.highPriority || "Alta Prioridade"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-priority-high">
              {tasks.filter(task => task.priority === 'high').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.tasks.mediumPriority || "Média Prioridade"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-priority-medium">
              {tasks.filter(task => task.priority === 'medium').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.tasks.lowPriority || "Baixa Prioridade"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-priority-low">
              {tasks.filter(task => task.priority === 'low').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">{t.tasks.all || "Todas"}</TabsTrigger>
            <TabsTrigger value="high" className="text-priority-high">{t.tasks.priority.high}</TabsTrigger>
            <TabsTrigger value="medium" className="text-priority-medium">{t.tasks.priority.medium}</TabsTrigger>
            <TabsTrigger value="low" className="text-priority-low">{t.tasks.priority.low}</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <TaskList tasks={tasks} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="high" className="mt-0">
          <TaskList tasks={tasks.filter(task => task.priority === 'high')} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="medium" className="mt-0">
          <TaskList tasks={tasks.filter(task => task.priority === 'medium')} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="low" className="mt-0">
          <TaskList tasks={tasks.filter(task => task.priority === 'low')} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleNewTask}
      />
    </div>
  );
};

export default Dashboard;
