export const es = {
  // Auth
  login: {
    title: "Iniciar Sesión",
    description: "Ingrese sus credenciales para acceder al sistema",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidó su contraseña?",
    submitButton: "Iniciar Sesión",
    processing: "Procesando...",
    googleButton: "Continuar con Google",
    or: "O",
    noAccount: "¿No tiene una cuenta?",
    register: "Registrarse",
    success: "Inicio de sesión exitoso",
    error: "Error al iniciar sesión",
    credentials: "Correo o contraseña incorrectos. Use admin@admin.com / 1234",
    fixedCredentials: "Use: admin@admin.com / contraseña: 1234"
  },
  resetPassword: {
    title: "Recuperar Contraseña",
    description: "Ingrese su correo para recibir instrucciones de recuperación",
    submitButton: "Enviar correo de recuperación",
    backToLogin: "Volver al inicio de sesión",
    success: "Correo de recuperación enviado con éxito",
    error: "Error al enviar correo de recuperación"
  },
  register: {
    title: 'Crear Cuenta',
    description: 'Complete los detalles a continuación para crear su cuenta',
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    submitButton: 'Crear Cuenta',
    processing: 'Procesando...',
    success: '¡Cuenta creada con éxito!',
    error: 'Error al crear la cuenta',
    haveAccount: '¿Ya tiene una cuenta?',
    login: 'Iniciar sesión',
    minChars: 'La contraseña debe tener al menos 6 caracteres',
    passwordMismatch: 'Las contraseñas no coinciden'
  },
  logout: {
    processing: "Cerrando sesión...",
    button: "Cerrar sesión",
    error: "Error al cerrar sesión",
    success: "Sesión cerrada con éxito"
  },

  // Navigation
  navigation: {
    dashboard: "Panel",
    analytics: "Análisis",
    tasks: "Tareas",
    team: "Equipo",
    calendar: "Calendario",
    reports: "Informes",
    settings: "Configuración",
    auditLogs: "Registros de Auditoría",
    notifications: "Notificaciones"
  },

  // Settings
  settings: {
    title: "Configuración",
    subtitle: "Personalice su experiencia en el sistema",
    saveButton: "Guardar cambios",
    saving: "Guardando...",
    saveSuccess: "¡Configuración guardada con éxito!",
    saveError: "Error al guardar la configuración",
    account: {
      title: "Cuenta",
      description: "Administre su información de cuenta y preferencias",
      email: "Correo electrónico",
      verified: "Verificado",
      memberSince: "Miembro desde",
      accessLevel: "Nivel de acceso",
      admin: "Administrador"
    },
    appearance: {
      title: "Apariencia",
      description: "Personalice el aspecto visual del sistema",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema"
    },
    language: {
      title: "Idioma",
      description: "Elija su idioma preferido",
      enUS: "Inglés (EE.UU.)",
      ptBR: "Portugués (Brasil)",
      es: "Español"
    },
    notifications: {
      title: "Notificaciones",
      description: "Configure cómo desea recibir notificaciones",
      email: {
        title: "Notificaciones por Correo",
        description: "Reciba actualizaciones de tareas por correo electrónico"
      },
      push: {
        title: "Notificaciones Push",
        description: "Reciba notificaciones en el navegador"
      },
      digest: {
        title: "Resumen Semanal",
        description: "Reciba un resumen de las actividades semanales"
      },
      reminders: {
        title: "Recordatorios de Tareas",
        description: "Reciba recordatorios cuando una tarea se acerque a su fecha límite"
      }
    },
    security: {
      title: "Seguridad",
      description: "Administre su configuración de seguridad y contraseña",
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar nueva contraseña",
      changePassword: "Cambiar contraseña",
      passwordMismatch: "Las contraseñas no coinciden",
      passwordChanged: "Contraseña cambiada con éxito",
      securityTip: {
        title: "Consejo de seguridad",
        description: "Use una contraseña fuerte y única para su cuenta. Recomendamos usar una combinación de letras, números y caracteres especiales."
      }
    }
  },

  // Team
  team: {
    title: "Equipo",
    description: "Administre los miembros de su equipo y asigne tareas",
    totalMembers: "Total de Miembros",
    assignedTasks: "Tareas Asignadas",
    addMember: "Agregar Miembro",
    addMemberTitle: "Agregar Miembro al Equipo",
    addMemberDescription: "Complete los datos del nuevo miembro. Todos los campos son obligatorios.",
    fullName: "Nombre Completo",
    email: "Correo electrónico",
    role: "Cargo",
    cancel: "Cancelar",
    add: "Agregar",
    memberAdded: "Miembro agregado",
    errorAdding: "Error al agregar miembro",
    incompleteData: "Datos incompletos",
    teamMembers: "Miembros del Equipo",
    teamMembersList: "Lista de todos los miembros activos del proyecto",
    member: "Miembro",
    tasks: "Tareas",
    since: "Desde"
  },

  // Reports
  reports: {
    title: 'Informes',
    description: 'Ver y gestionar tus informes',
    export: 'Exportar',
    exportData: 'Exportar Datos',
    exporting: 'Exportando...',
    exported: 'Informe exportado en FORMAT',
    exportError: 'Error al exportar informe',
    loading: 'Cargando informes...',
    errorLoading: 'Error al cargar informes',
    downloadSuccess: 'Informe descargado con éxito',
    downloadError: 'Error al descargar informe',
    generate: 'Generar',
    generateReport: 'Generar Informe',
    generateSuccess: 'Informe generado con éxito',
    totalReports: 'Total de Informes',
    completedReports: 'Informes Completados',
    pendingReports: 'Informes Pendientes',
    teamMembers: 'Miembros del Equipo',
    overallProgress: 'Progreso General',
    completionRate: 'Tasa de Finalización',
    recentReports: 'Informes Recientes',
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    completed: 'Completado',
    pending: 'Pendiente',
    createdBy: 'Creado por',
    createdAt: 'Creado en',
    highPriority: 'Alta Prioridad',
    mediumPriority: 'Prioridad Media',
    lowPriority: 'Baja Prioridad'
  },

  // Tasks
  tasks: {
    title: "Tareas",
    description: "Gestione sus tareas y siga el progreso",
    addTask: "Nueva Tarea",
    addTaskDescription: "Agregue una nueva tarea y establezca su prioridad",
    titleLabel: "Título",
    titlePlaceholder: "Título de la tarea",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Describa los detalles de la tarea",
    priorityLabel: "Prioridad",
    selectPriority: "Seleccione la prioridad",
    priority: {
      high: "Alta",
      medium: "Media",
      low: "Baja"
    },
    status: {
      pending: "Pendiente",
      inProgress: "En Progreso",
      completed: "Completada",
      canceled: "Cancelada"
    },
    assignLabel: "Asignar a",
    selectAssignee: "Seleccione el responsable",
    dueDate: "Fecha de entrega",
    selectDate: "Seleccione una fecha",
    noDueDate: "Sin fecha de entrega",
    assignee: "Responsable",
    cancel: "Cancelar",
    adding: "Agregando...",
    error: "Necesita iniciar sesión para agregar tareas",
    titleRequired: "El título es obligatorio",
    added: "Tarea agregada con éxito",
    addError: "Error al agregar tarea",
    viewDescription: "Descripción",
    assignedTo: "Asignada a:",
    statusLabel: "Estado:",
    editTitle: "Editar Tarea",
    editDescription: "Actualizar información de la tarea",
    edit: "Editar",
    delete: "Eliminar",
    unassigned: "No asignada",
    comments: "Comentarios",
    reply: "Responder",
    replyPlaceholder: "Escriba su respuesta...",
    send: "Enviar",
    addComment: "Agregar un comentario...",
    progress: "Progreso",
    confirmDelete: "¿Está seguro que desea eliminar esta tarea?",
    atualizadaComSucesso: "Tarea actualizada con éxito",
    erroAoAtualizar: "Error al actualizar tarea",
    deletadaComSucesso: "Tarea eliminada con éxito",
    erroAoDeletar: "Error al eliminar tarea",
    carregando: "Cargando tareas...",
    todasTarefas: "Todas las Tareas",
    nenhumaTarefa: "No se encontraron tareas",
    tituloPlaceholder: "Título de la tarea",
    adicionando: "Agregando..."
  },

  // General
  general: {
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    tryAgain: "Intentar de nuevo",
    administrator: "Administrador"
  },

  // Dashboard
  dashboard: {
    title: "Panel",
    description: "Gestione sus tareas y siga el progreso",
    addTask: "Nueva Tarea",
    addMember: "Nuevo Miembro",
    stats: {
      totalTasks: "Total de Tareas",
      pendingTasks: "Tareas Pendientes",
      inProgress: "En Progreso",
      completedTasks: "Tareas Completadas",
      completed: "completadas",
      ofTotal: "del total"
    },
    overview: "Vista General",
    tasks: {
      title: "Tareas"
    },
    team: {
      title: "Equipo",
      tasks: "Tareas"
    },
    analytics: "Análisis",
    projectProgress: "Progreso del Proyecto",
    recentActivity: "Actividad Reciente",
    completedTasks: "Tareas Completadas",
    pendingTasks: "Tareas Pendientes",
    teamMembers: "Miembros del Equipo",
    hoursWorked: "Horas Trabajadas",
    priorityDistribution: "Distribución de Prioridades",
    taskStatus: "Estado de las Tareas",
    teamPerformance: "Rendimiento del Equipo",
    highPriority: "Alta",
    mediumPriority: "Media",
    lowPriority: "Baja",
    completed: "Completada",
    inProgress: "En Progreso",
    pending: "Pendiente",
    assignee: "Asignado a",
    dueDate: "Fecha de Entrega",
    progress: "Progreso",
    noTasks: "No hay tareas asignadas",
    filterByPriority: "Filtrar por prioridad",
    filterByStatus: "Filtrar por estado",
    allPriorities: "Todas las prioridades",
    allStatus: "Todos los estados",
    taskDetails: "Detalles de la Tarea",
    memberDetails: "Detalles del Miembro",
    about: "Acerca de",
    skills: "Habilidades",
    currentTasks: "Tareas Actuales",
    joinDate: "Se unió en",
    newMember: "Nuevo",
    tasksAssigned: "tareas asignadas",
    analyticsDescription: {
      priority: "Análisis de tareas por nivel de prioridad",
      status: "Distribución por estado actual",
      performance: "Tareas por miembro del equipo"
    },
    overviewShort: "Vista",
    tasksShort: "Tareas",
    teamShort: "Equipo"
  },

  // Calendar
  calendar: {
    title: 'Calendario',
    description: 'Ver y gestionar tus tareas por fecha',
    loading: 'Cargando calendario...',
    errorLoading: 'Error al cargar el calendario',
    today: 'Hoy',
    addTask: 'Nueva Tarea',
    filterByPriority: 'Filtrar por prioridad',
    filterByStatus: 'Filtrar por estado',
    allPriorities: 'Todas las prioridades',
    allStatus: 'Todos los estados',
    highPriority: 'Alta Prioridad',
    mediumPriority: 'Prioridad Media',
    lowPriority: 'Baja Prioridad',
    pending: 'Pendiente',
    inProgress: 'En Progreso',
    completed: 'Completada',
    taskAdded: 'Tarea agregada con éxito',
    errorAdding: 'Error al agregar tarea'
  },

  // Audit Logs
  auditLogs: {
    title: 'Registros de Auditoría',
    description: 'Línea de tiempo de actividad del sistema',
    activityHistory: 'Historial de Actividades',
    activityDescription: 'Registro de acciones del sistema',
    loading: 'Cargando registros...',
    noActivities: 'No hay actividades registradas',
    errorLoading: 'No se pudo cargar el historial de actividades',
    accessDenied: 'No tiene permiso para ver los registros de auditoría',
    filters: 'Filtros',
    filtersDescription: 'Filtrar actividades por tipo, entidad o texto',
    searchPlaceholder: 'Buscar por usuario, acción o entidad...',
    filterByAction: 'Filtrar por acción',
    filterByEntity: 'Filtrar por entidad',
    allActions: 'Todas las acciones',
    allEntities: 'Todas las entidades',
    actions: {
      create: 'Crear',
      update: 'Actualizar',
      delete: 'Eliminar',
      complete: 'Completar',
      assign: 'Asignar',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión'
    },
    entities: {
      task: 'Tarea',
      user: 'Usuario',
      team: 'Equipo',
      system: 'Sistema'
    }
  },

  // Unauthorized
  unauthorized: {
    title: "Acceso Denegado",
    description: "No tiene permiso para acceder a esta página. Contacte al administrador del sistema si necesita acceso.",
    backToDashboard: "Volver al Panel",
    goBack: "Volver"
  }
};
