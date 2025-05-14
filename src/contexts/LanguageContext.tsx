import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, LanguageOption } from '../i18n';
import { getUserSettings, saveUserSettings } from '../services/settingsService';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  language: LanguageOption;
  setLanguage: (language: LanguageOption) => Promise<void>;
  t: typeof dictionaries['pt-BR'];
}

const defaultLanguage: LanguageOption = 'pt-BR';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: async () => { },
  t: dictionaries[defaultLanguage]
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageOption>(defaultLanguage);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadUserLanguage = async () => {
      if (currentUser) {
        try {
          const settings = await getUserSettings(currentUser.uid);
          if (settings.language) {
            setLanguageState(settings.language);
          }
        } catch (error) {
          console.error('Erro ao carregar configurações de idioma:', error);
        }
      }
    };

    loadUserLanguage();
  }, [currentUser]);

  const setLanguage = async (newLanguage: LanguageOption) => {
    try {
      setLanguageState(newLanguage);
      localStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Erro ao salvar configurações de idioma:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};

const translations = {
  pt: {
    dashboard: {
      title: 'Dashboard',
      description: 'Gerencie suas tarefas e acompanhe o progresso',
      addTask: 'Nova Tarefa',
      overview: 'Visão Geral',
      tasks: 'Tarefas',
      team: 'Equipe',
      analytics: 'Análises',
      projectProgress: 'Progresso do Projeto',
      recentActivity: 'Atividade Recente',
      completedTasks: 'Tarefas Concluídas',
      pendingTasks: 'Tarefas Pendentes',
      teamMembers: 'Membros da Equipe',
      hoursWorked: 'Horas Trabalhadas',
      priorityDistribution: 'Distribuição de Prioridades',
      taskStatus: 'Status das Tarefas',
      teamPerformance: 'Desempenho da Equipe',
      highPriority: 'Alta',
      mediumPriority: 'Média',
      lowPriority: 'Baixa',
      completed: 'Concluído',
      inProgress: 'Em Progresso',
      pending: 'Pendente',
      assignee: 'Responsável',
      dueDate: 'Data de Entrega',
      progress: 'Progresso',
      noTasks: 'Nenhuma tarefa atribuída',
      filterByPriority: 'Filtrar por prioridade',
      filterByStatus: 'Filtrar por status',
      allPriorities: 'Todas as prioridades',
      allStatus: 'Todos os status',
      taskDetails: 'Detalhes da Tarefa',
      memberDetails: 'Detalhes do Membro',
      about: 'Sobre',
      skills: 'Habilidades',
      currentTasks: 'Tarefas Atuais',
      joinDate: 'Entrou em',
      newMember: 'Novo',
      tasksAssigned: 'tarefas atribuídas',
      analyticsDescription: {
        priority: 'Análise das tarefas por nível de prioridade',
        status: 'Distribuição por status atual',
        performance: 'Tarefas por membro da equipe'
      }
    }
  },
  en: {
    dashboard: {
      title: 'Dashboard',
      description: 'Manage your tasks and track progress',
      addTask: 'New Task',
      overview: 'Overview',
      tasks: 'Tasks',
      team: 'Team',
      analytics: 'Analytics',
      projectProgress: 'Project Progress',
      recentActivity: 'Recent Activity',
      completedTasks: 'Completed Tasks',
      pendingTasks: 'Pending Tasks',
      teamMembers: 'Team Members',
      hoursWorked: 'Hours Worked',
      priorityDistribution: 'Priority Distribution',
      taskStatus: 'Task Status',
      teamPerformance: 'Team Performance',
      highPriority: 'High',
      mediumPriority: 'Medium',
      lowPriority: 'Low',
      completed: 'Completed',
      inProgress: 'In Progress',
      pending: 'Pending',
      assignee: 'Assignee',
      dueDate: 'Due Date',
      progress: 'Progress',
      noTasks: 'No tasks assigned',
      filterByPriority: 'Filter by priority',
      filterByStatus: 'Filter by status',
      allPriorities: 'All priorities',
      allStatus: 'All status',
      taskDetails: 'Task Details',
      memberDetails: 'Member Details',
      about: 'About',
      skills: 'Skills',
      currentTasks: 'Current Tasks',
      joinDate: 'Joined on',
      newMember: 'New',
      tasksAssigned: 'tasks assigned',
      analyticsDescription: {
        priority: 'Analysis of tasks by priority level',
        status: 'Distribution by current status',
        performance: 'Tasks per team member'
      }
    }
  }
};
