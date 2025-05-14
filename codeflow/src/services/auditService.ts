
export type ActivityAction = 'create' | 'update' | 'delete' | 'complete' | 'assign' | 'login' | 'logout';
export type ActivityEntity = 'task' | 'user' | 'team' | 'system';

export interface AuditActivity {
  id: string;
  userId: string;
  userEmail: string;
  timestamp: Date;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId?: string;
  details: string;
}

// Mock de atividades para simulação
const mockActivities: AuditActivity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    userEmail: 'admin@example.com',
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 horas atrás
    action: 'create',
    entity: 'task',
    entityId: 'mock-task-1',
    details: 'Criou a tarefa "Atualizar documentação do projeto"'
  },
  {
    id: 'act-2',
    userId: 'user-2',
    userEmail: 'developer@example.com',
    timestamp: new Date(Date.now() - 3600000 * 1), // 1 hora atrás
    action: 'update',
    entity: 'task',
    entityId: 'mock-task-2',
    details: 'Alterou o status da tarefa "Implementar autenticação por OAuth" para "Em andamento"'
  },
  {
    id: 'act-3',
    userId: 'user-3',
    userEmail: 'manager@example.com',
    timestamp: new Date(Date.now() - 1800000), // 30 minutos atrás
    action: 'assign',
    entity: 'task',
    entityId: 'mock-task-3',
    details: 'Atribuiu a tarefa "Otimizar consultas do banco de dados" para João Silva'
  },
  {
    id: 'act-4',
    userId: 'user-1',
    userEmail: 'admin@example.com',
    timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
    action: 'complete',
    entity: 'task',
    entityId: 'mock-task-4',
    details: 'Marcou a tarefa "Planejar reunião de sprint" como concluída'
  },
  {
    id: 'act-5',
    userId: 'user-4',
    userEmail: 'teste@example.com',
    timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
    action: 'login',
    entity: 'system',
    details: 'Realizou login no sistema'
  }
];

// Função para obter histórico de atividades
export const getActivities = async (limit: number = 50): Promise<AuditActivity[]> => {
  // Em uma implementação real, isso buscaria do backend
  // Por enquanto, retornamos os dados mockados
  return [...mockActivities]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

// Função para registrar uma nova atividade
export const logActivity = async (
  userId: string,
  userEmail: string,
  action: ActivityAction,
  entity: ActivityEntity,
  entityId: string | undefined,
  details: string
): Promise<void> => {
  const newActivity: AuditActivity = {
    id: `act-${Date.now()}`,
    userId,
    userEmail,
    timestamp: new Date(),
    action,
    entity,
    entityId,
    details
  };
  
  // Em uma implementação real, isso enviaria para o backend
  console.log('Atividade registrada:', newActivity);
  
  // Adicionamos ao array de mock para simular a persistência
  mockActivities.push(newActivity);
};
