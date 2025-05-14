export const enUS = {
  // Auth
  login: {
    title: "Log in",
    description: "Enter your credentials to access the system",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    submitButton: "Log in",
    processing: "Processing...",
    googleButton: "Continue with Google",
    or: "OR",
    noAccount: "Don't have an account?",
    register: "Register",
    success: "Successfully logged in",
    error: "Failed to log in",
    credentials: "Email or password is incorrect. Use admin@admin.com / 1234",
    fixedCredentials: "Use: admin@admin.com / password: 1234"
  },
  resetPassword: {
    title: "Recover Password",
    description: "Enter your email to receive password recovery instructions",
    submitButton: "Send recovery email",
    backToLogin: "Back to login",
    success: "Recovery email sent successfully",
    error: "Failed to send recovery email"
  },
  register: {
    title: 'Create Account',
    description: 'Fill in the details below to create your account',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submitButton: 'Create Account',
    processing: 'Processing...',
    success: 'Account created successfully!',
    error: 'Error creating account',
    haveAccount: 'Already have an account?',
    login: 'Login',
    minChars: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match'
  },
  logout: {
    processing: "Logging out...",
    button: "Log out",
    error: "Failed to log out",
    success: "Successfully logged out"
  },

  // Navigation
  navigation: {
    dashboard: "Dashboard",
    analytics: "Analytics",
    tasks: "Tasks",
    team: "Team",
    calendar: "Calendar",
    reports: "Reports",
    settings: "Settings",
    auditLogs: "Audit Logs",
    notifications: "Notifications"
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account preferences and settings',
    saveButton: 'Save changes',
    saving: 'Saving...',
    saveSuccess: 'Settings saved successfully!',
    saveError: 'Error saving settings',
    account: {
      title: 'Account',
      description: 'Manage your account information and preferences',
      email: 'Email',
      verified: 'Verified',
      memberSince: 'Member since',
      accessLevel: 'Access level',
      admin: 'Administrator'
    },
    appearance: {
      title: 'Appearance',
      description: 'Customize the application appearance',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },
    language: {
      title: "Language",
      description: "Choose your preferred language",
      enUS: "English (USA)",
      ptBR: "Portuguese (Brazil)",
      es: "Spanish"
    },
    notifications: {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      email: {
        title: 'Email notifications',
        description: 'Receive important updates via email'
      },
      push: {
        title: 'Push notifications',
        description: 'Receive real-time notifications'
      },
      digest: {
        title: 'Weekly digest',
        description: 'Receive a summary of weekly activities'
      },
      reminders: {
        title: 'Task reminders',
        description: 'Receive reminders about pending tasks'
      }
    },
    security: {
      title: 'Security',
      description: 'Manage your security settings and password',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      changePassword: 'Change password',
      passwordMismatch: 'Passwords do not match',
      passwordChanged: 'Password changed successfully',
      securityTip: {
        title: 'Security tip',
        description: 'Use a strong and unique password for your account. We recommend using a combination of letters, numbers, and special characters.'
      }
    }
  },

  // Team
  team: {
    title: "Team",
    description: "Manage your team members and assign tasks",
    totalMembers: "Total Members",
    assignedTasks: "Assigned Tasks",
    addMember: "Add Member",
    addMemberTitle: "Add Team Member",
    addMemberDescription: "Fill in the new member's details. All fields are required.",
    fullName: "Full Name",
    email: "Email",
    role: "Role",
    cancel: "Cancel",
    add: "Add",
    memberAdded: "Member added",
    errorAdding: "Error adding member",
    incompleteData: "Incomplete data",
    teamMembers: "Team Members",
    teamMembersList: "List of all active project members",
    member: "Member",
    tasks: "Tasks",
    since: "Since"
  },

  // Reports
  reports: {
    title: 'Reports',
    description: 'View and manage your reports',
    export: 'Export',
    exportData: 'Export Data',
    exporting: 'Exporting...',
    exported: 'Report exported in FORMAT',
    exportError: 'Error exporting report',
    loading: 'Loading reports...',
    errorLoading: 'Error loading reports',
    downloadSuccess: 'Report downloaded successfully',
    downloadError: 'Error downloading report',
    generate: 'Generate',
    generateReport: 'Generate Report',
    generateSuccess: 'Report generated successfully',
    totalReports: 'Total Reports',
    completedReports: 'Completed Reports',
    pendingReports: 'Pending Reports',
    teamMembers: 'Team Members',
    overallProgress: 'Overall Progress',
    completionRate: 'Completion Rate',
    recentReports: 'Recent Reports',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    completed: 'Completed',
    pending: 'Pending',
    createdBy: 'Created by',
    createdAt: 'Created at',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority'
  },

  // Tasks
  tasks: {
    title: 'Tasks',
    description: 'Manage your tasks and track progress',
    addTask: 'New Task',
    addTaskDescription: 'Add a new task and set its priority',
    titleLabel: 'Title',
    titlePlaceholder: 'Task title',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Describe the task details',
    priorityLabel: 'Priority',
    selectPriority: 'Select priority',
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    status: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed'
    },
    assignLabel: 'Assignee',
    selectAssignee: 'Select assignee',
    dueDate: 'Due Date',
    selectDate: 'Select a date',
    noDueDate: 'No due date',
    assignee: 'Assignee',
    cancel: 'Cancel',
    adding: 'Adding...',
    error: 'You need to be logged in to add tasks',
    titleRequired: 'Title is required',
    added: 'Task added successfully',
    addError: 'Error adding task',
    viewDescription: 'Description',
    assignedTo: 'Assigned to:',
    statusLabel: 'Status:',
    editTitle: 'Edit Task',
    editDescription: 'Update task information',
    edit: 'Edit',
    delete: 'Delete'
  },

  // General
  general: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    tryAgain: "Try again",
    administrator: "Administrator"
  },

  // Dashboard
  dashboard: {
    overviewShort: "Overview",
    tasksShort: "Tasks",
    teamShort: "Team"
  },

  // Calendar
  calendar: {
    title: 'Calendar',
    description: 'View and manage your tasks by date',
    loading: 'Loading calendar...',
    errorLoading: 'Error loading calendar',
    today: 'Today',
    addTask: 'New Task',
    filterByPriority: 'Filter by priority',
    filterByStatus: 'Filter by status',
    allPriorities: 'All priorities',
    allStatus: 'All status',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    taskAdded: 'Task added successfully',
    errorAdding: 'Error adding task'
  },

  // Audit Logs
  auditLogs: {
    title: 'Audit Logs',
    description: 'System activity timeline',
    activityHistory: 'Activity History',
    activityDescription: 'Record of system actions',
    loading: 'Loading logs...',
    noActivities: 'No activities recorded',
    errorLoading: 'Could not load activity history',
    accessDenied: 'You do not have permission to view audit logs',
    filters: 'Filters',
    filtersDescription: 'Filter activities by type, entity or text',
    searchPlaceholder: 'Search by user, action or entity...',
    filterByAction: 'Filter by action',
    filterByEntity: 'Filter by entity',
    allActions: 'All actions',
    allEntities: 'All entities',
    actions: {
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      complete: 'Complete',
      assign: 'Assign',
      login: 'Login',
      logout: 'Logout'
    },
    entities: {
      task: 'Task',
      user: 'User',
      team: 'Team',
      system: 'System'
    }
  },

  // Unauthorized
  unauthorized: {
    title: "Access Denied",
    description: "You don't have permission to access this page. Contact the system administrator if you need access.",
    backToDashboard: "Back to Dashboard",
    goBack: "Go Back"
  }
};
