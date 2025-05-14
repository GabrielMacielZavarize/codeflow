
# Gerenciamento de Equipe

Este documento explica a estrutura e o funcionamento do sistema de gerenciamento de equipe implementado na aplicação de priorização de tarefas da CodeFlow Solutions.

## Visão Geral

O módulo de gerenciamento de equipe permite organizar e visualizar os membros da equipe, suas funções, e as tarefas atribuídas a cada um. Este sistema é fundamental para a distribuição eficiente do trabalho e para manter a visibilidade sobre a alocação de recursos humanos.

## Estrutura de Dados

### Modelo de Membro da Equipe

Cada membro da equipe é representado pela seguinte estrutura:

```typescript
export interface TeamMember {
  id: string;           // Identificador único do membro
  name: string;         // Nome completo
  email: string;        // Email do membro
  role: string;         // Cargo/função na empresa (ex: Desenvolvedor Frontend)
  joinedAt: Date;       // Data de entrada na equipe
  avatar?: string;      // URL da imagem de perfil (opcional)
  tasks?: number;       // Número de tarefas atribuídas ao membro
  department?: string;  // Departamento (opcional)
  skills?: string[];    // Habilidades/competências (opcional)
  status?: 'active' | 'inactive' | 'vacation'; // Status do membro (opcional)
}
```

### Armazenamento no Firestore

Os dados dos membros da equipe são armazenados na coleção "teamMembers" no Firestore:

```typescript
// Exemplo de documento na coleção "teamMembers"
{
  id: "abc123",
  name: "João Silva",
  email: "joao.silva@exemplo.com",
  role: "Desenvolvedor Frontend",
  joinedAt: Timestamp, // Objeto Timestamp do Firestore
  avatar: "https://exemplo.com/avatar.jpg",
  tasks: 5,
  department: "Engenharia",
  skills: ["React", "TypeScript", "Firebase"],
  status: "active"
}
```

## Operações CRUD

### Buscar Membros da Equipe

```typescript
export const getTeamMembers = async () => {
  try {
    const membersRef = collection(db, "teamMembers");
    const q = query(membersRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    const members = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      members.push({
        ...data,
        id: doc.id,
        joinedAt: data.joinedAt?.toDate() || new Date()
      });
    });
    
    return members;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error);
    throw new Error('Falha ao carregar membros da equipe');
  }
};
```

### Adicionar Membro à Equipe

```typescript
export const addTeamMember = async (memberData) => {
  try {
    const membersRef = collection(db, "teamMembers");
    
    const newMember = {
      ...memberData,
      joinedAt: memberData.joinedAt || serverTimestamp(),
      tasks: memberData.tasks || 0,
    };
    
    const docRef = await addDoc(membersRef, newMember);
    
    // Registrar ação no log de auditoria
    await logActivity({
      type: 'team_member_added',
      userId: auth.currentUser?.uid || '',
      details: {
        memberId: docRef.id,
        memberName: memberData.name,
        memberEmail: memberData.email
      },
    });
    
    return {
      ...newMember,
      id: docRef.id,
      joinedAt: newMember.joinedAt instanceof Timestamp 
        ? newMember.joinedAt.toDate() 
        : newMember.joinedAt
    };
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    throw new Error('Falha ao adicionar novo membro');
  }
};
```

### Atualizar Membro da Equipe

```typescript
export const updateTeamMember = async (id, updates) => {
  try {
    const memberRef = doc(db, "teamMembers", id);
    
    // Se estivermos atualizando dados sensíveis, registrar no log de auditoria
    if (updates.role || updates.status || updates.department) {
      await logActivity({
        type: 'team_member_updated',
        userId: auth.currentUser?.uid || '',
        details: {
          memberId: id,
          updates: Object.keys(updates)
        },
      });
    }
    
    await updateDoc(memberRef, updates);
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return false;
  }
};
```

### Remover Membro da Equipe

```typescript
export const removeTeamMember = async (id) => {
  try {
    const memberRef = doc(db, "teamMembers", id);
    
    // Obter dados do membro antes de excluir (para o log)
    const memberSnapshot = await getDoc(memberRef);
    if (!memberSnapshot.exists()) {
      throw new Error('Membro não encontrado');
    }
    
    const memberData = memberSnapshot.data();
    
    // Excluir membro
    await deleteDoc(memberRef);
    
    // Registrar ação no log de auditoria
    await logActivity({
      type: 'team_member_removed',
      userId: auth.currentUser?.uid || '',
      details: {
        memberId: id,
        memberName: memberData.name,
        memberEmail: memberData.email
      },
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao remover membro:', error);
    return false;
  }
};
```

## Atualização de Contagem de Tarefas

Quando uma tarefa é atribuída ou removida de um membro, a contagem de tarefas é atualizada:

```typescript
export const updateMemberTaskCount = async (memberId, increment = 1) => {
  try {
    const memberRef = doc(db, "teamMembers", memberId);
    
    // Obter a contagem atual
    const memberDoc = await getDoc(memberRef);
    
    if (memberDoc.exists()) {
      const currentTasks = memberDoc.data().tasks || 0;
      
      // Atualizar a contagem (aumentar ou diminuir)
      await updateDoc(memberRef, {
        tasks: Math.max(0, currentTasks + increment) // Não permitir contagem negativa
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar contagem de tarefas:', error);
    return false;
  }
};
```

## Integração com o Sistema de Tarefas

O sistema de equipe se integra ao sistema de tarefas, permitindo a atribuição de tarefas a membros específicos:

```typescript
// Trecho de código para atualização de tarefa com mudança de atribuição
const updateTaskAssignment = async (taskId, oldAssigneeId, newAssigneeId) => {
  // Se não houve mudança, não fazer nada
  if (oldAssigneeId === newAssigneeId) return;
  
  // Transação para garantir consistência
  await runTransaction(db, async (transaction) => {
    // Se tinha um responsável anterior, decrementar sua contagem
    if (oldAssigneeId) {
      const oldMemberRef = doc(db, "teamMembers", oldAssigneeId);
      const oldMemberDoc = await transaction.get(oldMemberRef);
      
      if (oldMemberDoc.exists()) {
        const currentTasks = oldMemberDoc.data().tasks || 0;
        transaction.update(oldMemberRef, {
          tasks: Math.max(0, currentTasks - 1)
        });
      }
    }
    
    // Se tem um novo responsável, incrementar sua contagem
    if (newAssigneeId) {
      const newMemberRef = doc(db, "teamMembers", newAssigneeId);
      const newMemberDoc = await transaction.get(newMemberRef);
      
      if (newMemberDoc.exists()) {
        const currentTasks = newMemberDoc.data().tasks || 0;
        transaction.update(newMemberRef, {
          tasks: currentTasks + 1
        });
      }
    }
    
    // Atualizar a atribuição na tarefa
    const taskRef = doc(db, "tasks", taskId);
    transaction.update(taskRef, {
      assignedTo: newAssigneeId || null,
      updatedAt: serverTimestamp()
    });
  });
  
  // Registrar a mudança no log de auditoria
  await logActivity({
    type: 'task_reassigned',
    userId: auth.currentUser?.uid || '',
    details: {
      taskId,
      previousAssignee: oldAssigneeId || 'Não atribuída',
      newAssignee: newAssigneeId || 'Não atribuída'
    },
  });
  
  return true;
};
```

## Interface do Usuário

### Página de Equipe

A página de equipe exibe uma lista dos membros, com opções para adicionar, editar e remover membros:

```tsx
const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true);
        const members = await getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error("Erro ao carregar membros:", error);
        toast.error("Não foi possível carregar os membros da equipe");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, []);
  
  // ... restante do componente
};
```

### Tabela de Membros

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Membro</TableHead>
      <TableHead>Cargo</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Tarefas</TableHead>
      <TableHead>Desde</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {teamMembers.map(member => (
      <TableRow key={member.id}>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>{member.role}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>
          <Badge variant="outline">{member.tasks || 0}</Badge>
        </TableCell>
        <TableCell>
          {format(new Date(member.joinedAt), 'PP', { locale: dateLocale })}
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditMember(member.id)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Formulário para Adicionar/Editar Membro

```tsx
const MemberForm = ({ member, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || '',
    department: member?.department || '',
    avatar: member?.avatar || '',
    skills: member?.skills || []
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário */}
      <div>
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          placeholder="Ex: João Silva"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex: joao.silva@exemplo.com"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Cargo</Label>
        <Input
          id="role"
          placeholder="Ex: Desenvolvedor Frontend"
          value={form.role}
          onChange={(e) => setForm({...form, role: e.target.value})}
          required
        />
      </div>
      
      {/* Outros campos */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {member ? 'Salvar Alterações' : 'Adicionar Membro'}
      </Button>
    </form>
  );
};
```

## Controle de Acesso (RBAC)

O acesso ao gerenciamento de equipe é controlado com base no papel do usuário:

```typescript
// Verificação de permissão para acessar/editar equipe
const canManageTeam = (userRole) => {
  return userRole === 'admin' || userRole === 'manager';
};

// No componente
const Team = () => {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState('user');
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setUserRole(role);
      }
    };
    
    fetchUserRole();
  }, [currentUser]);
  
  // Renderização condicional com base no papel
  return (
    <>
      {canManageTeam(userRole) ? (
        // Conteúdo completo da página
      ) : (
        // Mensagem de acesso negado
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Você não tem permissão para acessar o gerenciamento de equipe.
          </p>
        </div>
      )}
    </>
  );
};
```

## Integração com o Firebase

Para implementação real com Firebase:

1. **Estrutura das Coleções**:
   - `teamMembers`: Armazena os dados dos membros da equipe
   - `users`: Armazena informações de autenticação e papéis
   - `tasks`: Referencia membros através do campo `assignedTo`

2. **Regras de Segurança**:
   ```
   match /databases/{database}/documents {
     match /teamMembers/{memberId} {
       allow read: if request.auth != null;
       allow write: if request.auth != null && (
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager'
       );
     }
   }
   ```

3. **Índices Compostos**:
   - Crie índices para consultas frequentes, como filtrar membros por departamento e ordernar por nome

## Boas Práticas

1. **Mantenha os dados atualizados**: Use triggers do Firestore para atualizar contagens e metadados
2. **Otimize leituras/escritas**: Minimize o número de operações do banco de dados
3. **Cache de dados**: Implemente cache client-side para dados frequentemente acessados
4. **Validação**: Valide dados tanto no client quanto nas regras do Firestore
5. **Transações**: Use transações para operações que modificam múltiplos documentos

## Expansões Futuras

O sistema foi projetado para permitir estas expansões futuras:

1. **Visualização de disponibilidade**: Calendário mostrando disponibilidade de cada membro
2. **Gerenciamento de habilidades**: Catalogar e pesquisar membros por habilidades específicas
3. **Histórico de desempenho**: Acompanhamento de métricas como tarefas concluídas por período
4. **Hierarquia de equipe**: Estrutura organizacional com líderes e subordinados
5. **Gestão de carga de trabalho**: Análise e balanceamento de tarefas entre membros
