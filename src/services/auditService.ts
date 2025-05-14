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
  },
  {
    id: 'act-6',
    userId: 'user-5',
    userEmail: 'designer@example.com',
    timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
    action: 'create',
    entity: 'team',
    entityId: 'mock-team-1',
    details: 'Criou a equipe "Design e UX"'
  },
  {
    id: 'act-7',
    userId: 'user-6',
    userEmail: 'qa@example.com',
    timestamp: new Date(Date.now() - 5400000), // 1.5 horas atrás
    action: 'update',
    entity: 'user',
    entityId: 'mock-user-1',
    details: 'Atualizou o perfil do usuário Maria Santos'
  },
  {
    id: 'act-8',
    userId: 'user-7',
    userEmail: 'devops@example.com',
    timestamp: new Date(Date.now() - 4200000), // 1.2 horas atrás
    action: 'delete',
    entity: 'task',
    entityId: 'mock-task-5',
    details: 'Excluiu a tarefa "Configurar ambiente de desenvolvimento"'
  },
  {
    id: 'act-9',
    userId: 'user-8',
    userEmail: 'product@example.com',
    timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
    action: 'create',
    entity: 'task',
    entityId: 'mock-task-6',
    details: 'Criou a tarefa "Definir roadmap do produto"'
  },
  {
    id: 'act-10',
    userId: 'user-9',
    userEmail: 'support@example.com',
    timestamp: new Date(Date.now() - 2400000), // 40 minutos atrás
    action: 'logout',
    entity: 'system',
    details: 'Realizou logout do sistema'
  },
  {
    id: 'act-11',
    userId: 'user-10',
    userEmail: 'analyst@example.com',
    timestamp: new Date(Date.now() - 1200000), // 20 minutos atrás
    action: 'update',
    entity: 'team',
    entityId: 'mock-team-2',
    details: 'Atualizou os membros da equipe "Análise de Dados"'
  },
  {
    id: 'act-12',
    userId: 'user-11',
    userEmail: 'security@example.com',
    timestamp: new Date(Date.now() - 600000), // 10 minutos atrás
    action: 'create',
    entity: 'user',
    entityId: 'mock-user-2',
    details: 'Criou novo usuário com perfil de segurança'
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
