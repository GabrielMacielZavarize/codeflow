
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
    title: "Register",
    description: "Create your account to access the system",
    submitButton: "Register",
    processing: "Processing...",
    success: "Successfully registered",
    error: "Failed to register",
    haveAccount: "Already have an account?",
    login: "Log in",
    minChars: "Minimum 6 characters",
    confirmPassword: "Confirm Password"
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
    title: "Settings",
    subtitle: "Customize your system experience",
    account: {
      title: "Account Information",
      description: "Manage your user information and preferences",
      email: "Email"
    },
    appearance: {
      title: "Appearance",
      description: "Customize the system's visual aspects",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System (Automatic)"
    },
    language: {
      title: "Language",
      description: "Choose your preferred language",
      enUS: "English (USA)",
      ptBR: "Portuguese (Brazil)",
      es: "Spanish"
    },
    notifications: {
      title: "Notifications",
      description: "Configure how you wish to receive notifications",
      email: {
        title: "Email Notifications",
        description: "Receive task updates by email"
      },
      push: {
        title: "Push Notifications",
        description: "Receive notifications in the browser"
      },
      digest: {
        title: "Weekly Digest",
        description: "Receive a summary of weekly activities"
      },
      reminders: {
        title: "Task Reminders",
        description: "Receive reminders when a task is approaching its deadline"
      }
    },
    saveButton: "Save All Settings",
    saving: "Saving...",
    saveSuccess: "Settings saved",
    saveError: "Failed to save settings"
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
    title: "Reports",
    description: "View statistics and track progress",
    export: "Export",
    exporting: "Exporting...",
    exported: "Report exported",
    exportError: "Error exporting report",
    loading: "Loading report data...",
    monthlyTasks: "Tasks by Month",
    monthlyDescription: "Monthly task count evolution",
    memberTasks: "Tasks by Member",
    memberDescription: "Task distribution among team members"
  },

  // Tasks
  tasks: {
    title: "Task Details",
    description: "View and edit task information",
    viewDescription: "Description",
    assignedTo: "Assigned to:",
    statusLabel: "Status:",
    dueDate: "Due date:",
    addTask: "New Task",
    totalTasks: "Total Tasks",
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    lowPriority: "Low Priority",
    all: "All",
    priority: {
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    status: {
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      canceled: "Canceled",
      undefined: "Not defined"
    },
    editTitle: "Edit Task",
    editDescription: "Update this task's information",
    titleLabel: "Title",
    descriptionLabel: "Description",
    priorityLabel: "Priority",
    assignLabel: "Assign to",
    unassigned: "Unassigned",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    createdAt: "Created on",
    deleted: "Task deleted",
    deleteError: "Error deleting task",
    updated: "Task updated",
    updateError: "Error updating task",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this task?",
    back: "Back to Dashboard",
    notFound: "Task not found",
    notFoundDescription: "The task you are looking for does not exist or was removed."
  },

  // General
  general: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    tryAgain: "Try again",
    administrator: "Administrator"
  }
};
