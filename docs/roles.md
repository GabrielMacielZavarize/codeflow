
# Controle de Acesso Baseado em Papéis (RBAC)

Este documento detalha o sistema de controle de acesso baseado em papéis (Role-Based Access Control - RBAC) implementado no sistema de priorização de tarefas da CodeFlow Solutions.

## Visão Geral

O RBAC permite atribuir diferentes níveis de acesso e permissões aos usuários do sistema, baseados em seus papéis organizacionais. Isso garante que cada usuário tenha acesso apenas às funcionalidades necessárias para desempenhar suas funções, aumentando a segurança e organizando melhor a hierarquia do sistema.

## Papéis Implementados

O sistema implementa três papéis principais:

### 1. Admin (Administrador)

**Descrição**: Papel com acesso completo ao sistema. Administradores podem realizar qualquer operação, incluindo ações críticas como exclusão de dados e gerenciamento de usuários.

**Permissões**:
- Acesso total a todas as funcionalidades do sistema
- Gerenciamento de usuários e equipes
- Visualização de todos os relatórios e análises
- Visualização do log de auditoria
- Exclusão de dados (tarefas, usuários, etc.)
- Configuração de parâmetros do sistema
- Atribuição de papéis a outros usuários

### 2. Manager (Gerente)

**Descrição**: Papel intermediário com permissões para gerenciar equipes e tarefas, mas sem acesso a operações críticas ou dados sensíveis do sistema.

**Permissões**:
- Criação e edição de tarefas
- Gerenciamento de equipes
- Atribuição de tarefas a membros da equipe
- Visualização da maioria dos relatórios
- Edição de status de tarefas
- Visualização da dashboard e calendário
- Sem permissão para excluir dados permanentemente
- Sem acesso ao log de auditoria

### 3. User (Usuário)

**Descrição**: Papel básico para membros regulares da equipe, com acesso limitado às suas próprias tarefas e informações básicas do sistema.

**Permissões**:
- Visualização de tarefas atribuídas a si
- Atualização do status de suas próprias tarefas
- Criação de novas tarefas
- Visualização da dashboard básica
- Visualização do calendário
- Configurações pessoais
- Sem acesso a relatórios avançados ou gerenciamento de equipe
- Sem permissão para exclusão de dados

## Implementação Técnica

### Estrutura de Dados

O papel de um usuário é armazenado no Firestore, na coleção "users":

```typescript
interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: Timestamp;
  lastLogin?: Timestamp;
  // outros campos...
}
```

### Serviço de Verificação de Papéis

O sistema utiliza um serviço dedicado (`roleService.ts`) para gerenciar as verificações de papéis:

```typescript
// Versão simplificada do roleService.ts
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Cache para armazenar temporariamente os papéis dos usuários
const roleCache: Record<string, string> = {};

// Obter o papel do usuário
export const getUserRole = (userId: string): 'admin' | 'manager' | 'user' => {
  // Para fins de demonstração, esta implementação é simplificada
  // Em produção, isso consultaria o Firestore
  
  // Verificar se o papel está em cache
  if (roleCache[userId]) {
    return roleCache[userId] as 'admin' | 'manager' | 'user';
  }
  
  // Papel padrão se não for encontrado
  return 'user';
};

// Verificar se o usuário tem uma permissão específica
export const checkPermission = (
  role: 'admin' | 'manager' | 'user',
  permission: 'canDeleteTask' | 'canManageTeam' | 'canViewReports' | 'canViewAuditLogs'
): boolean => {
  switch (permission) {
    case 'canDeleteTask':
      return role === 'admin';
    case 'canManageTeam':
      return role === 'admin' || role === 'manager';
    case 'canViewReports':
      return role === 'admin' || role === 'manager';
    case 'canViewAuditLogs':
      return role === 'admin';
    default:
      return false;
  }
};
```

### Integração com a Interface

#### Componente de Controle de Acesso

```typescript
// Componente para renderização condicional baseada em papéis
const ProtectedComponent = ({ 
  requiredPermission, 
  children 
}: { 
  requiredPermission: 'canDeleteTask' | 'canManageTeam' | 'canViewReports' | 'canViewAuditLogs';
  children: React.ReactNode
}) => {
  const { currentUser } = useAuth();
  const userRole = currentUser ? getUserRole(currentUser.uid) : 'user';
  
  if (!currentUser || !checkPermission(userRole, requiredPermission)) {
    return null;
  }
  
  return <>{children}</>;
};
```

#### Exemplo de Uso na UI

```tsx
// Exemplo de uso em um componente de tarefa
<div className="task-actions">
  <button onClick={handleEdit}>Editar</button>
  
  <ProtectedComponent requiredPermission="canDeleteTask">
    <button onClick={handleDelete}>Excluir</button>
  </ProtectedComponent>
</div>
```

### Proteção de Rotas Baseada em Papéis

Além da renderização condicional de elementos UI, o sistema também protege rotas inteiras com base no papel do usuário:

```typescript
// Componente de rota protegida por papel
const RoleProtectedRoute = ({ 
  requiredPermission,
  children 
}: { 
  requiredPermission: 'canDeleteTask' | 'canManageTeam' | 'canViewReports' | 'canViewAuditLogs';
  children: React.ReactNode 
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const userRole = currentUser ? getUserRole(currentUser.uid) : 'user';
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!checkPermission(userRole, requiredPermission)) {
      navigate('/unauthorized');
    }
  }, [currentUser, userRole, requiredPermission, navigate]);
  
  if (!currentUser || !checkPermission(userRole, requiredPermission)) {
    return null;
  }
  
  return <>{children}</>;
};
```

## Como as Permissões São Aplicadas no Frontend

### No Sidebar

```tsx
// Exemplo do Sidebar.tsx
<SidebarItem 
  to="/team" 
  label="Team" 
  icon={<Users size={20} />} 
  active={location.pathname === '/team'} 
  permission="canManageTeam"
  userRole={userRole}
/>

<SidebarItem 
  to="/audit-logs" 
  label="Audit Logs" 
  icon={<Activity size={20} />} 
  active={location.pathname === '/audit-logs'} 
  permission="canViewAuditLogs"
  userRole={userRole}
/>
```

### Nos Componentes

```tsx
// Exemplo em TaskDetails.tsx
{checkPermission(userRole, 'canDeleteTask') && (
  <Button variant="destructive" onClick={handleDeleteTask}>
    <Trash2 className="h-4 w-4 mr-2" />
    Excluir
  </Button>
)}
```

### Em Ações de Formulários

```tsx
// Verificação em tempo real antes de executar ações
const handleDeleteTask = async () => {
  if (!checkPermission(userRole, 'canDeleteTask')) {
    toast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para excluir tarefas.',
      variant: 'destructive'
    });
    return;
  }
  
  // Prosseguir com a exclusão...
};
```

## Sincronização com o Backend

Para garantir a segurança, as verificações de permissão não são apenas implementadas no frontend, mas também são aplicadas no backend através das regras de segurança do Firebase:

```
// Exemplo de regras de segurança do Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar se o usuário é admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Função para verificar se o usuário é gerente
    function isManager() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager';
    }
    
    // Regras para tarefas
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.createdBy == request.auth.uid ||
        resource.data.assignedTo == request.auth.uid ||
        isManager() || isAdmin()
      );
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Regras para logs de auditoria
    match /auditLogs/{logId} {
      allow read: if request.auth != null && isAdmin();
      allow write: if false; // Somente escrita via Cloud Functions
    }
  }
}
```

## Fluxograma de Verificação de Permissões

```
┌───────────┐     ┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│ Usuário   │     │             │     │                  │     │               │
│ Requisita │────▶│ Verificação │────▶│ Verificação de   │────▶│ Acesso        │
│ Acesso    │     │ Autenticação│     │ Papel (RBAC)     │     │ Permitido     │
└───────────┘     └─────────────┘     └──────────────────┘     └───────────────┘
                         │                    │
                         ▼                    ▼
                  ┌─────────────┐     ┌──────────────────┐
                  │             │     │                  │
                  │ Redireção  │     │ Mensagem de      │
                  │ para Login │     │ Acesso Negado    │
                  └─────────────┘     └──────────────────┘
```

## Atribuição e Modificação de Papéis

A atribuição de papéis é controlada pelos administradores do sistema. Em uma implementação completa, o sistema teria uma interface administrativa para gerenciar papéis de usuários:

```tsx
// Exemplo de componente para gerenciamento de papéis (apenas para administradores)
const UserRoleManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'manager' | 'user'>('user');
  
  // Lógica para carregar usuários e atualizar papéis...
  
  return (
    <div className="role-management">
      <h2>Gerenciamento de Papéis</h2>
      
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Papel Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select 
                  value={selectedUser === user.uid ? newRole : user.role}
                  onChange={(e) => {
                    setSelectedUser(user.uid);
                    setNewRole(e.target.value as 'admin' | 'manager' | 'user');
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
                
                {selectedUser === user.uid && (
                  <button onClick={handleUpdateRole}>Salvar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Considerações de Segurança

1. **Validação dupla**: Todas as verificações de permissão são realizadas tanto no frontend quanto no backend.

2. **Princípio do menor privilégio**: Usuários recebem apenas as permissões mínimas necessárias para suas funções.

3. **Separação de responsabilidades**: Diferentes papéis têm responsabilidades claramente definidas e separadas.

4. **Auditoria**: Todas as ações sensíveis são registradas no log de auditoria, especialmente mudanças de papel.

5. **Falha segura**: Em caso de dúvida sobre uma permissão, o sistema assume que o usuário não tem acesso.

6. **Verificação contínua**: As permissões são verificadas em cada operação, não apenas no carregamento inicial.
