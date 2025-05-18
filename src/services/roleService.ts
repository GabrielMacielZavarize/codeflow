// Mock de papéis de usuários para desenvolvimento
const USER_ROLES: Record<string, string> = {
  'mock-admin-uid': 'admin',
  'mock-manager-uid': 'manager',
  'mock-user-uid': 'user'
};

// Obtém o papel de um usuário pelo UID
export const getUserRole = (uid: string): string => {
  // Para desenvolvimento, vamos retornar 'admin' para qualquer usuário autenticado
  return 'admin';

  // Código original comentado para referência
  // const storedUser = localStorage.getItem('mockCurrentUser');
  // if (storedUser) {
  //   const userData = JSON.parse(storedUser);
  //   if (userData.role) {
  //     return userData.role;
  //   }
  // }
  // return USER_ROLES[uid] || 'user';
};

// Verifica se um usuário com determinado papel tem uma permissão específica
export const checkPermission = (role: string, permission: string): boolean => {
  // Para desenvolvimento, vamos permitir todas as permissões
  return true;

  // Código original comentado para referência
  // const permissions: Record<string, string[]> = {
  //   admin: [
  //     'canManageTeam',
  //     'canDeleteTasks',
  //     'canViewReports',
  //     'canViewAuditLogs',
  //     'canManageUsers',
  //     'canConfigureSystem'
  //   ],
  //   manager: [
  //     'canManageTeam',
  //     'canViewReports',
  //     'canAssignTasks',
  //     'canViewAuditLogs'
  //   ],
  //   user: [
  //     'canCreateTasks',
  //     'canEditOwnTasks',
  //     'canViewAssignedTasks',
  //     'canViewAuditLogs'
  //   ]
  // };
  // return !!permissions[role] && permissions[role].includes(permission);
};
