
export const es = {
  // Auth
  login: {
    title: "Iniciar sesión",
    description: "Ingrese sus credenciales para acceder al sistema",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidó su contraseña?",
    submitButton: "Iniciar sesión",
    processing: "Procesando...",
    googleButton: "Continuar con Google",
    or: "O",
    noAccount: "¿No tiene una cuenta?",
    register: "Regístrese",
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
    title: "Registrarse",
    description: "Cree su cuenta para acceder al sistema",
    submitButton: "Registrarse",
    processing: "Procesando...",
    success: "Registro exitoso",
    error: "Error al registrarse",
    haveAccount: "¿Ya tiene una cuenta?",
    login: "Iniciar sesión",
    minChars: "Mínimo 6 caracteres",
    confirmPassword: "Confirmar Contraseña"
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
    account: {
      title: "Información de la Cuenta",
      description: "Administre su información de usuario y preferencias",
      email: "Correo electrónico"
    },
    appearance: {
      title: "Apariencia",
      description: "Personalice el aspecto visual del sistema",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema (Automático)"
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
    saveButton: "Guardar Toda la Configuración",
    saving: "Guardando...",
    saveSuccess: "Configuración guardada",
    saveError: "Error al guardar la configuración"
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
    title: "Informes",
    description: "Visualice estadísticas y siga el progreso",
    export: "Exportar",
    exporting: "Exportando...",
    exported: "Informe exportado",
    exportError: "Error al exportar informe",
    loading: "Cargando datos de informes...",
    monthlyTasks: "Tareas por Mes",
    monthlyDescription: "Evolución de la cantidad de tareas en los últimos meses",
    memberTasks: "Tareas por Miembro",
    memberDescription: "Distribución de tareas entre los miembros del equipo"
  },

  // Tasks
  tasks: {
    title: "Detalles de la Tarea",
    description: "Visualice y edite información de esta tarea",
    viewDescription: "Descripción",
    assignedTo: "Asignada a:",
    statusLabel: "Estado:",
    dueDate: "Fecha de entrega:",
    addTask: "Nueva Tarea",
    totalTasks: "Total de Tareas",
    highPriority: "Alta Prioridad",
    mediumPriority: "Media Prioridad",
    lowPriority: "Baja Prioridad",
    all: "Todas",
    priority: {
      high: "Alta",
      medium: "Media",
      low: "Baja"
    },
    status: {
      pending: "Pendiente",
      inProgress: "En Progreso",
      completed: "Completada",
      canceled: "Cancelada",
      undefined: "No definido"
    },
    editTitle: "Editar Tarea",
    editDescription: "Actualice la información de esta tarea",
    titleLabel: "Título",
    descriptionLabel: "Descripción",
    priorityLabel: "Prioridad",
    assignLabel: "Asignar a",
    unassigned: "No asignada",
    saveChanges: "Guardar Cambios",
    cancel: "Cancelar",
    createdAt: "Creada el",
    deleted: "Tarea eliminada",
    deleteError: "Error al eliminar tarea",
    updated: "Tarea actualizada",
    updateError: "Error al actualizar tarea",
    edit: "Editar",
    delete: "Eliminar",
    confirmDelete: "¿Está seguro que desea eliminar esta tarea?",
    back: "Volver al Panel",
    notFound: "Tarea no encontrada",
    notFoundDescription: "La tarea que está buscando no existe o fue eliminada."
  },
  
  // General
  general: {
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    tryAgain: "Intentar de nuevo",
    administrator: "Administrador"
  }
};
