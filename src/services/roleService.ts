
// Mock de papéis de usuários para desenvolvimento
const USER_ROLES: Record<string, string> = {
  'mock-admin-uid': 'admin',
  'mock-manager-uid': 'manager',
  'mock-user-uid': 'user'
};

// Obtém o papel de um usuário pelo UID
export const getUserRole = (uid: string): string => {
  // Primeiro tenta obter do mock armazenado no localStorage
  const storedUser = localStorage.getItem('mockCurrentUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    if (userData.role) {
      return userData.role;
    }
  }
  
  // Se não encontrar no localStorage, busca no objeto USER_ROLES
  return USER_ROLES[uid] || 'user';
};

// Verifica se um usuário com determinado papel tem uma permissão específica
export const checkPermission = (role: string, permission: string): boolean => {
  // Mapeamento de permissões por papel
  const permissions: Record<string, string[]> = {
    admin: [
      'canManageTeam',
      'canDeleteTasks',
      'canViewReports',
      'canViewAuditLogs',
      'canManageUsers',
      'canConfigureSystem'
    ],
    manager: [
      'canManageTeam',
      'canViewReports',
      'canAssignTasks'
    ],
    user: [
      'canCreateTasks',
      'canEditOwnTasks',
      'canViewAssignedTasks'
    ]
  };

  // Verifica se o papel existe e se ele contém a permissão
  return !!permissions[role] && permissions[role].includes(permission);
};
