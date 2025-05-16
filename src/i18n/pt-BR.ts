export const ptBR = {
  // Auth
  login: {
    title: "Entrar",
    description: "Entre com suas credenciais para acessar o sistema",
    email: "E-mail",
    password: "Senha",
    forgotPassword: "Esqueceu a senha?",
    submitButton: "Entrar",
    processing: "Processando...",
    googleButton: "Continuar com Google",
    or: "OU",
    noAccount: "Não tem uma conta?",
    register: "Cadastre-se",
    success: "Login realizado com sucesso",
    error: "Falha ao fazer login",
    credentials: "Email ou senha incorretos. Use admin@admin.com / 1234",
    fixedCredentials: "Use: admin@admin.com / senha: 1234"
  },
  resetPassword: {
    title: "Recuperar Senha",
    description: "Informe seu e-mail para receber instruções de recuperação de senha",
    submitButton: "Enviar e-mail de recuperação",
    backToLogin: "Voltar ao login",
    success: "E-mail de recuperação enviado com sucesso",
    error: "Falha ao enviar e-mail de recuperação"
  },
  register: {
    title: 'Criar Conta',
    description: 'Preencha os dados abaixo para criar sua conta',
    name: 'Nome',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    submitButton: 'Criar Conta',
    processing: 'Processando...',
    success: 'Conta criada com sucesso!',
    error: 'Erro ao criar conta',
    haveAccount: 'Já tem uma conta?',
    login: 'Faça login',
    minChars: 'A senha deve ter pelo menos 6 caracteres',
    passwordMismatch: 'As senhas não coincidem'
  },
  logout: {
    processing: "Saindo...",
    button: "Sair",
    error: "Falha ao fazer logout",
    success: "Logout realizado com sucesso"
  },

  // Navigation
  navigation: {
    dashboard: "Painel",
    analytics: "Análises",
    tasks: "Tarefas",
    team: "Equipe",
    calendar: "Calendário",
    reports: "Relatórios",
    settings: "Configurações",
    auditLogs: "Logs de Auditoria",
    notifications: "Notificações"
  },

  // Dashboard
  dashboard: {
    title: "Painel",
    description: "Gerencie suas tarefas e acompanhe o progresso",
    addTask: "Nova Tarefa",
    overview: "Visão Geral",
    tasks: "Tarefas",
    team: "Equipe",
    analytics: "Análises",
    projectProgress: "Progresso do Projeto",
    recentActivity: "Atividade Recente",
    completedTasks: "Tarefas Concluídas",
    pendingTasks: "Tarefas Pendentes",
    teamMembers: "Membros da Equipe",
    hoursWorked: "Horas Trabalhadas",
    priorityDistribution: "Distribuição de Prioridades",
    taskStatus: "Status das Tarefas",
    teamPerformance: "Desempenho da Equipe",
    highPriority: "Alta",
    mediumPriority: "Média",
    lowPriority: "Baixa",
    completed: "Concluído",
    inProgress: "Em Progresso",
    pending: "Pendente",
    assignee: "Responsável",
    dueDate: "Data de Entrega",
    progress: "Progresso",
    noTasks: "Nenhuma tarefa atribuída",
    filterByPriority: "Filtrar por prioridade",
    filterByStatus: "Filtrar por status",
    allPriorities: "Todas as prioridades",
    allStatus: "Todos os status",
    taskDetails: "Detalhes da Tarefa",
    memberDetails: "Detalhes do Membro",
    about: "Sobre",
    skills: "Habilidades",
    currentTasks: "Tarefas Atuais",
    joinDate: "Entrou em",
    newMember: "Novo",
    tasksAssigned: "tarefas atribuídas",
    analyticsDescription: {
      priority: "Análise das tarefas por nível de prioridade",
      status: "Distribuição por status atual",
      performance: "Tarefas por membro da equipe"
    },
    overviewShort: "Visão",
    tasksShort: "Tarefas",
    teamShort: "Equipe"
  },

  // Settings
  settings: {
    title: 'Configurações',
    subtitle: 'Gerencie suas preferências e configurações da conta',
    saveButton: 'Salvar alterações',
    saving: 'Salvando...',
    saveSuccess: 'Configurações salvas com sucesso!',
    saveError: 'Erro ao salvar configurações',
    account: {
      title: 'Conta',
      description: 'Gerencie suas informações de conta e preferências',
      email: 'E-mail',
      verified: 'Verificado',
      memberSince: 'Membro desde',
      accessLevel: 'Nível de acesso',
      admin: 'Administrador'
    },
    appearance: {
      title: 'Aparência',
      description: 'Personalize a aparência do aplicativo',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema'
    },
    language: {
      title: "Idioma",
      description: "Escolha seu idioma preferido",
      enUS: "Inglês (EUA)",
      ptBR: "Português (Brasil)",
      es: "Espanhol"
    },
    notifications: {
      title: 'Notificações',
      description: 'Gerencie suas preferências de notificação',
      email: {
        title: 'Notificações por e-mail',
        description: 'Receba atualizações importantes por e-mail'
      },
      push: {
        title: 'Notificações push',
        description: 'Receba notificações em tempo real'
      },
      digest: {
        title: 'Resumo semanal',
        description: 'Receba um resumo das atividades da semana'
      },
      reminders: {
        title: 'Lembretes de tarefas',
        description: 'Receba lembretes sobre tarefas pendentes'
      }
    },
    security: {
      title: 'Segurança',
      description: 'Gerencie suas configurações de segurança e senha',
      currentPassword: 'Senha atual',
      newPassword: 'Nova senha',
      confirmPassword: 'Confirmar nova senha',
      changePassword: 'Alterar senha',
      passwordMismatch: 'As senhas não coincidem',
      passwordChanged: 'Senha alterada com sucesso',
      securityTip: {
        title: 'Dica de segurança',
        description: 'Use uma senha forte e única para sua conta. Recomendamos usar uma combinação de letras, números e caracteres especiais.'
      }
    }
  },

  // Team
  team: {
    title: "Equipe",
    description: "Gerencie os membros da sua equipe e atribua tarefas",
    totalMembers: "Total de Membros",
    assignedTasks: "Tarefas Atribuídas",
    addMember: "Adicionar Membro",
    addMemberTitle: "Adicionar Membro à Equipe",
    addMemberDescription: "Preencha os dados do novo membro. Todos os campos são obrigatórios.",
    fullName: "Nome Completo",
    email: "E-mail",
    role: "Cargo",
    cancel: "Cancelar",
    add: "Adicionar",
    memberAdded: "Membro adicionado",
    errorAdding: "Erro ao adicionar membro",
    incompleteData: "Dados incompletos",
    teamMembers: "Membros da Equipe",
    teamMembersList: "Lista de todos os membros ativos do projeto",
    member: "Membro",
    tasks: "Tarefas",
    since: "Desde"
  },

  // Reports
  reports: {
    title: 'Relatórios',
    description: 'Visualize e gerencie seus relatórios',
    export: 'Exportar',
    exportData: 'Exportar Dados',
    exporting: 'Exportando...',
    exported: 'Relatório exportado em FORMAT',
    exportError: 'Erro ao exportar relatório',
    loading: 'Carregando relatórios...',
    errorLoading: 'Erro ao carregar relatórios',
    downloadSuccess: 'Relatório baixado com sucesso',
    downloadError: 'Erro ao baixar relatório',
    generate: 'Gerar',
    generateReport: 'Gerar Relatório',
    generateSuccess: 'Relatório gerado com sucesso',
    totalReports: 'Total de Relatórios',
    completedReports: 'Relatórios Concluídos',
    pendingReports: 'Relatórios Pendentes',
    teamMembers: 'Membros da Equipe',
    overallProgress: 'Progresso Geral',
    completionRate: 'Taxa de Conclusão',
    recentReports: 'Relatórios Recentes',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    completed: 'Concluído',
    pending: 'Pendente',
    createdBy: 'Criado por',
    createdAt: 'Criado em',
    highPriority: 'Alta Prioridade',
    mediumPriority: 'Média Prioridade',
    lowPriority: 'Baixa Prioridade'
  },

  // Tasks
  tasks: {
    title: 'Tarefas',
    description: 'Gerencie suas tarefas e acompanhe o progresso',
    addTask: 'Nova Tarefa',
    addTaskDescription: 'Adicione uma nova tarefa e defina sua prioridade',
    titleLabel: 'Título',
    titlePlaceholder: 'Título da tarefa',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Descreva os detalhes da tarefa',
    priorityLabel: 'Prioridade',
    selectPriority: 'Selecione a prioridade',
    priority: {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    },
    status: {
      pending: 'Pendente',
      inProgress: 'Em Progresso',
      completed: 'Concluída',
      canceled: 'Cancelada'
    },
    assignLabel: 'Responsável',
    selectAssignee: 'Selecione o responsável',
    dueDate: 'Data de Entrega',
    selectDate: 'Selecione uma data',
    noDueDate: 'Sem data de entrega',
    assignee: 'Responsável',
    cancel: 'Cancelar',
    adding: 'Adicionando...',
    error: 'Você precisa estar logado para adicionar tarefas',
    titleRequired: 'O título é obrigatório',
    added: 'Tarefa adicionada com sucesso',
    addError: 'Erro ao adicionar tarefa',
    viewDescription: 'Descrição',
    assignedTo: 'Atribuído a:',
    statusLabel: 'Status:',
    editTitle: 'Editar Tarefa',
    editDescription: 'Atualizar informações da tarefa',
    edit: 'Editar',
    delete: 'Excluir',
    unassigned: 'Não atribuído',
    comments: 'Comentários',
    reply: 'Responder',
    replyPlaceholder: 'Digite sua resposta...',
    send: 'Enviar',
    addComment: 'Adicionar um comentário...',
    progress: 'Progresso',
    confirmDelete: 'Tem certeza que deseja excluir esta tarefa?'
  },

  // General
  general: {
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    tryAgain: "Tentar novamente",
    administrator: "Administrador"
  },

  // Calendar
  calendar: {
    title: 'Calendário',
    description: 'Visualize e gerencie suas tarefas por data',
    loading: 'Carregando calendário...',
    errorLoading: 'Erro ao carregar o calendário',
    today: 'Hoje',
    addTask: 'Nova Tarefa',
    filterByPriority: 'Filtrar por prioridade',
    filterByStatus: 'Filtrar por status',
    allPriorities: 'Todas as prioridades',
    allStatus: 'Todos os status',
    highPriority: 'Alta Prioridade',
    mediumPriority: 'Média Prioridade',
    lowPriority: 'Baixa Prioridade',
    pending: 'Pendente',
    inProgress: 'Em Progresso',
    completed: 'Concluída',
    taskAdded: 'Tarefa adicionada com sucesso',
    errorAdding: 'Erro ao adicionar tarefa'
  },

  // Audit Logs
  auditLogs: {
    title: 'Logs de Auditoria',
    description: 'Timeline de atividades do sistema',
    activityHistory: 'Histórico de Atividades',
    activityDescription: 'Registro de ações realizadas no sistema',
    loading: 'Carregando logs...',
    noActivities: 'Nenhuma atividade registrada',
    errorLoading: 'Não foi possível obter o histórico de atividades',
    accessDenied: 'Você não tem permissão para visualizar os logs de auditoria',
    filters: 'Filtros',
    filtersDescription: 'Filtre as atividades por tipo, entidade ou texto',
    searchPlaceholder: 'Buscar por usuário, ação ou entidade...',
    filterByAction: 'Filtrar por ação',
    filterByEntity: 'Filtrar por entidade',
    allActions: 'Todas as ações',
    allEntities: 'Todas as entidades',
    actions: {
      create: 'Criar',
      update: 'Atualizar',
      delete: 'Excluir',
      complete: 'Concluir',
      assign: 'Atribuir',
      login: 'Login',
      logout: 'Logout'
    },
    entities: {
      task: 'Tarefa',
      user: 'Usuário',
      team: 'Equipe',
      system: 'Sistema'
    }
  },

  // Unauthorized
  unauthorized: {
    title: "Acesso Negado",
    description: "Você não tem permissão para acessar esta página. Entre em contato com o administrador do sistema se precisar de acesso.",
    backToDashboard: "Voltar para o Painel",
    goBack: "Voltar"
  }
};
