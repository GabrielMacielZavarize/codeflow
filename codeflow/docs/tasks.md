
# Estrutura de Tarefas

Este documento detalha a estrutura, organização e gerenciamento das tarefas no sistema de priorização da CodeFlow Solutions.

## Estrutura de uma Tarefa

Cada tarefa no sistema é representada por um objeto com a seguinte estrutura:

```typescript
interface Task {
  id: string;            // Identificador único da tarefa
  title: string;         // Título da tarefa (obrigatório)
  description: string;   // Descrição detalhada (obrigatório)
  priority: 'high' | 'medium' | 'low';  // Nível de prioridade (obrigatório)
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';  // Estado atual
  createdAt: Timestamp;  // Data e hora de criação
  updatedAt?: Timestamp; // Data e hora da última atualização
  completedAt?: Timestamp; // Data e hora de conclusão (se concluída)
  dueDate?: Timestamp;   // Data de entrega/prazo (opcional)
  assignedTo?: string;   // ID do usuário responsável (opcional)
  createdBy: string;     // ID do usuário que criou a tarefa
  tags?: string[];       // Tags para categorização (opcional)
  comments?: Comment[];  // Comentários relacionados à tarefa (opcional)
}

interface Comment {
  id: string;
  text: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
}
```

## Campos Obrigatórios

Os seguintes campos são considerados obrigatórios ao criar uma nova tarefa:

1. **Título**: Uma descrição curta e clara do que precisa ser feito.
2. **Descrição**: Detalhes sobre o que a tarefa envolve, requisitos, etc.
3. **Prioridade**: Indicação da importância relativa da tarefa.

## Níveis de Prioridade

O sistema utiliza três níveis de prioridade para classificar as tarefas:

### Alta Prioridade (High)
- **Características**: Tarefas críticas que exigem atenção imediata
- **Representação Visual**: Geralmente indicada com a cor vermelha (#ef4444)
- **Uso Recomendado**: Para tarefas que têm impacto significativo no projeto ou negócio e precisam ser tratadas com urgência

### Média Prioridade (Medium)
- **Características**: Tarefas importantes, mas que não são críticas
- **Representação Visual**: Geralmente indicada com a cor amarela ou laranja (#f59e0b)
- **Uso Recomendado**: Para tarefas que são importantes para o progresso do projeto, mas têm uma janela de tempo mais flexível

### Baixa Prioridade (Low)
- **Características**: Tarefas que podem ser realizadas quando houver tempo disponível
- **Representação Visual**: Geralmente indicada com a cor azul (#3b82f6)
- **Uso Recomendado**: Para tarefas que são úteis, mas não impactam diretamente prazos ou funcionalidades críticas

## Status de Tarefas

As tarefas podem ter os seguintes status:

### Pendente (pending)
- **Descrição**: A tarefa foi criada mas ainda não foi iniciada
- **Representação Visual**: Geralmente indicada com um badge cinza ou azul-claro

### Em Progresso (in_progress)
- **Descrição**: Trabalho na tarefa foi iniciado e está em andamento
- **Representação Visual**: Geralmente indicada com um badge azul

### Concluída (completed)
- **Descrição**: A tarefa foi finalizada com sucesso
- **Representação Visual**: Geralmente indicada com um badge verde

### Cancelada (canceled)
- **Descrição**: A tarefa foi cancelada e não será realizada
- **Representação Visual**: Geralmente indicada com um badge vermelho

## Implementação no Firestore

A coleção "tasks" no Firestore deve ter a seguinte estrutura:

```typescript
// Exemplo de documento na coleção "tasks"
{
  id: "abc123",
  title: "Implementar autenticação",
  description: "Adicionar login/register com Firebase Auth",
  priority: "high",
  status: "in_progress",
  createdAt: Timestamp, // Objeto Timestamp do Firestore
  updatedAt: Timestamp,
  dueDate: Timestamp,
  assignedTo: "userId123",
  createdBy: "userId456",
  tags: ["frontend", "auth"]
}
```

## Operações CRUD

Para integração com o Firestore, as seguintes operações são implementadas:

### Criação de Tarefas

```typescript
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const taskRef = doc(collection(db, "tasks"));
    
    const newTask = {
      ...taskData,
      id: taskRef.id,
      createdAt: serverTimestamp(),
      status: taskData.status || 'pending',
    };
    
    await setDoc(taskRef, newTask);
    
    // Registrar ação no log de auditoria
    await logActivity({
      type: 'task_created',
      userId: taskData.createdBy,
      details: {
        taskId: taskRef.id,
        taskTitle: taskData.title,
      },
    });
    
    return { task: { ...newTask, createdAt: new Date() }, error: null };
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return { task: null, error: 'Falha ao criar a tarefa' };
  }
};
```

### Recuperação de Tarefas

```typescript
// Buscar todas as tarefas
export const getTasks = async (filters = {}) => {
  try {
    const tasksRef = collection(db, "tasks");
    let q = query(tasksRef, orderBy("createdAt", "desc"));
    
    // Aplicar filtros se existirem
    if (filters.priority) {
      q = query(q, where("priority", "==", filters.priority));
    }
    
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }
    
    if (filters.assignedTo) {
      q = query(q, where("assignedTo", "==", filters.assignedTo));
    }
    
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        dueDate: data.dueDate?.toDate(),
        completedAt: data.completedAt?.toDate()
      });
    });
    
    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw new Error('Falha ao buscar tarefas');
  }
};

// Buscar tarefa específica por ID
export const getTaskById = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    
    if (taskDoc.exists()) {
      const data = taskDoc.data();
      return {
        ...data,
        id: taskDoc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        dueDate: data.dueDate?.toDate(),
        completedAt: data.completedAt?.toDate()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    throw new Error('Falha ao buscar tarefa');
  }
};
```

### Atualização de Tarefas

```typescript
export const updateTask = async (
  taskId,
  updates,
  userId
) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    
    // Buscar tarefa atual para comparação
    const taskSnapshot = await getDoc(taskRef);
    if (!taskSnapshot.exists()) {
      throw new Error('Tarefa não encontrada');
    }
    
    const taskData = taskSnapshot.data();
    
    // Para status completado, adicionar timestamp de conclusão
    if (updates.status === 'completed' && updates.completedAt === undefined) {
      updates.completedAt = serverTimestamp();
    }
    
    updates.updatedAt = serverTimestamp();
    
    await updateDoc(taskRef, updates);
    
    // Registrar ação no log de auditoria
    await logActivity({
      type: 'task_updated',
      userId,
      details: {
        taskId,
        taskTitle: taskData.title,
        updates: Object.keys(updates),
        previousStatus: taskData.status,
        newStatus: updates.status || taskData.status
      },
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return false;
  }
};
```

### Exclusão de Tarefas

```typescript
export const deleteTask = async (taskId, userId) => {
  try {
    // Obter dados da tarefa antes de excluir (para o log)
    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);
    
    if (!taskSnapshot.exists()) {
      throw new Error('Tarefa não encontrada');
    }
    
    const taskData = taskSnapshot.data();
    
    // Excluir tarefa
    await deleteDoc(taskRef);
    
    // Registrar ação no log de auditoria
    await logActivity({
      type: 'task_deleted',
      userId,
      details: {
        taskId,
        taskTitle: taskData.title,
        taskPriority: taskData.priority,
        taskStatus: taskData.status
      },
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return false;
  }
};
```

## Componentes de Interface

### Listagem de Tarefas

O componente `TaskList` exibe uma lista de tarefas, com suporte a filtros e ordenação:

```tsx
const TaskList = ({ tasks, onTaskClick }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card 
          key={task.id}
          className={`border-l-4 border-l-priority-${task.priority} hover:shadow-md transition-shadow`}
          onClick={() => onTaskClick(task.id)}
        >
          <CardContent className="p-4">
            {/* Conteúdo do card da tarefa */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{task.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Badges de prioridade e status */}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              {/* Metadados da tarefa (data, responsável, etc) */}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

### Formulário de Criação/Edição

O componente `TaskForm` é usado tanto para criar quanto para editar tarefas:

```tsx
const TaskForm = ({ task, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    assignedTo: task?.assignedTo || ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário */}
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input 
          id="title"
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição *</Label>
        <Textarea 
          id="description"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          required
          rows={3}
        />
      </div>
      
      <div>
        <Label>Prioridade *</Label>
        <Select 
          value={form.priority} 
          onValueChange={(value) => setForm({...form, priority: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Outros campos... */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {task ? 'Salvar Alterações' : 'Criar Tarefa'}
      </Button>
    </form>
  );
};
```

## Filtros e Busca

O sistema implementa filtros para facilitar a localização de tarefas específicas:

```tsx
const TaskFilter = ({ filters, setFilters }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar tarefas..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filtros de prioridade, status, etc */}
        </div>
      </div>
    </div>
  );
};
```

## Considerações para Implementação Real

Ao implementar este sistema com o Firebase:

1. **Índices**: Criar índices compostos para queries frequentes
2. **Regras de Segurança**: Implementar regras adequadas no Firestore
3. **Paginação**: Para grandes conjuntos de dados, implementar paginação
4. **Cache**: Utilizar cache local para melhorar performance
5. **Offline Support**: Configurar para funcionamento offline
6. **Limites de Leitura/Escrita**: Estar ciente dos limites do plano Firebase

## Melhores Práticas

1. **Nomes claros para tarefas**: Incentive títulos descriptivos
2. **Atualizações em tempo real**: Configure listeners para atualizações
3. **Validação de dados**: Valide tanto no cliente quanto nas regras do Firestore
4. **Normalização de dados**: Evite duplicação excessiva
5. **Transações**: Use transações para operações que precisam ser atômicas

## Expansões Futuras

O sistema foi projetado para permitir expansões futuras:

1. **Subtarefas**: Hierarquia de tarefas para itens complexos
2. **Anexos**: Upload e gerenciamento de arquivos relacionados
3. **Estimativas de tempo**: Campos para estimativa e tempo real gasto
4. **Recorrência**: Tarefas que se repetem em intervalos definidos
5. **Integração de calendário**: Sincronização com Google Calendar ou similar
6. **Histórico detalhado**: Tracking de todas as mudanças em uma tarefa
