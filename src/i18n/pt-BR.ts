
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
    title: "Cadastrar",
    description: "Crie sua conta para acessar o sistema",
    submitButton: "Cadastrar",
    processing: "Processando...",
    success: "Cadastro realizado com sucesso",
    error: "Falha ao realizar cadastro",
    haveAccount: "Já tem uma conta?",
    login: "Entrar",
    minChars: "Mínimo de 6 caracteres",
    confirmPassword: "Confirmar Senha"
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

  // Settings
  settings: {
    title: "Configurações",
    subtitle: "Personalize sua experiência no sistema",
    account: {
      title: "Informações da Conta",
      description: "Gerencie suas informações de usuário e preferências",
      email: "E-mail"
    },
    appearance: {
      title: "Aparência",
      description: "Personalize o visual do sistema",
      theme: "Tema",
      light: "Claro",
      dark: "Escuro",
      system: "Sistema (Automático)"
    },
    language: {
      title: "Idioma",
      description: "Escolha seu idioma preferido",
      enUS: "Inglês (EUA)",
      ptBR: "Português (Brasil)",
      es: "Espanhol"
    },
    notifications: {
      title: "Notificações",
      description: "Configure como deseja receber notificações",
      email: {
        title: "Notificações por E-mail",
        description: "Receba atualizações de tarefas por e-mail"
      },
      push: {
        title: "Notificações Push",
        description: "Receba notificações no navegador"
      },
      digest: {
        title: "Resumo Semanal",
        description: "Receba um resumo das atividades da semana"
      },
      reminders: {
        title: "Lembretes de Tarefas",
        description: "Receba lembretes quando uma tarefa estiver próxima do prazo"
      }
    },
    saveButton: "Salvar Todas as Configurações",
    saving: "Salvando...",
    saveSuccess: "Configurações salvas",
    saveError: "Falha ao salvar configurações"
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
    title: "Relatórios",
    description: "Visualize estatísticas e acompanhe o progresso",
    export: "Exportar",
    exporting: "Exportando...",
    exported: "Relatório exportado",
    exportError: "Erro ao exportar relatório",
    loading: "Carregando dados dos relatórios...",
    monthlyTasks: "Tarefas por Mês",
    monthlyDescription: "Evolução da quantidade de tarefas nos últimos meses",
    memberTasks: "Tarefas por Membro",
    memberDescription: "Distribuição de tarefas entre os membros da equipe"
  },

  // Tasks
  tasks: {
    title: "Detalhes da Tarefa",
    description: "Visualize e edite informações desta tarefa",
    viewDescription: "Descrição",
    assignedTo: "Atribuída a:",
    statusLabel: "Status:",
    dueDate: "Data de entrega:",
    addTask: "Nova Tarefa",
    totalTasks: "Total de Tarefas",
    highPriority: "Alta Prioridade",
    mediumPriority: "Média Prioridade",
    lowPriority: "Baixa Prioridade",
    all: "Todas",
    priority: {
      high: "Alta",
      medium: "Média",
      low: "Baixa"
    },
    status: {
      pending: "Pendente",
      inProgress: "Em Progresso",
      completed: "Concluída",
      canceled: "Cancelada",
      undefined: "Não definido"
    },
    editTitle: "Editar Tarefa",
    editDescription: "Atualize as informações desta tarefa",
    titleLabel: "Título",
    descriptionLabel: "Descrição",
    priorityLabel: "Prioridade",
    assignLabel: "Atribuir a",
    unassigned: "Não atribuída",
    saveChanges: "Salvar Alterações",
    cancel: "Cancelar",
    createdAt: "Criada em",
    deleted: "Tarefa excluída",
    deleteError: "Erro ao excluir tarefa",
    updated: "Tarefa atualizada",
    updateError: "Erro ao atualizar tarefa",
    edit: "Editar",
    delete: "Excluir",
    confirmDelete: "Tem certeza que deseja excluir esta tarefa?",
    back: "Voltar para o Painel",
    notFound: "Tarefa não encontrada",
    notFoundDescription: "A tarefa que você está procurando não existe ou foi removida."
  },
  
  // General
  general: {
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    tryAgain: "Tentar novamente",
    administrator: "Administrador"
  }
};
