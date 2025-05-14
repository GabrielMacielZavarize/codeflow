
export type NotificationType = 'task_assigned' | 'task_due' | 'task_completed' | 'comment' | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedTaskId?: string;
  relatedUserId?: string;
}

// Mock de notificações
const mockNotifications: Omit<Notification, 'id'>[] = [
  {
    userId: 'mock-user-id',
    type: 'task_assigned',
    message: 'Nova tarefa "Otimizar consultas do banco de dados" atribuída a você',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    relatedTaskId: 'mock-task-2'
  },
  {
    userId: 'mock-user-id',
    type: 'task_due',
    message: 'Tarefa "Implementar autenticação por OAuth" vence em 2 dias',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    relatedTaskId: 'mock-task-1'
  },
  {
    userId: 'mock-user-id',
    type: 'comment',
    message: 'Carlos Mendes comentou na tarefa "Atualizar documentação do projeto"',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    relatedTaskId: 'mock-task-0',
    relatedUserId: 'user-2'
  },
  {
    userId: 'mock-user-id',
    type: 'mention',
    message: 'Juliana Costa mencionou você em um comentário',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    relatedUserId: 'user-3'
  },
  {
    userId: 'mock-user-id',
    type: 'task_completed',
    message: 'Ana Silva completou a tarefa "Planejar reunião de sprint"',
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    relatedTaskId: 'mock-task-3',
    relatedUserId: 'user-1'
  }
];

// Funções para gerenciar notificações
export const getNotifications = async (userId: string): Promise<Notification[]> => {
  // Versão mock para desenvolvimento
  return mockNotifications.map((notification, index) => ({
    ...notification,
    id: `notification-${index}`
  }));
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  console.log(`Notificação ${id} marcada como lida (mock)`);
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  console.log(`Todas as notificações do usuário ${userId} marcadas como lidas (mock)`);
  return true;
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  console.log(`Notificação ${id} removida (mock)`);
  return true;
};
